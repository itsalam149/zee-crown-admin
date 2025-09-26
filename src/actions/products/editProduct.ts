"use server";

import { revalidatePath } from "next/cache";

import { createServerActionClient } from "@/lib/supabase/server-action";
import { productFormSchema } from "@/app/(dashboard)/products/_components/form/schema";
import { formatValidationErrors } from "@/helpers/formatValidationErrors";
import { ProductServerActionResponse } from "@/types/server-action";

export async function editProduct(
  productId: string,
  formData: FormData
): Promise<ProductServerActionResponse> {
  const supabase = createServerActionClient();

  const parsedData = productFormSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    image: formData.get("image"),
    category: formData.get("category"),
    price: formData.get("price"),
    stock: formData.get("stock"),
    expiryDate: formData.get("expiryDate"),
    prescriptionRequired: formData.get("prescriptionRequired"),
  });

  if (!parsedData.success) {
    return {
      validationErrors: formatValidationErrors(
        parsedData.error.flatten().fieldErrors
      ),
    };
  }

  const { image, ...productData } = parsedData.data;

  let imageUrl: string | undefined;

  if (image instanceof File && image.size > 0) {
    const { data: oldProductData, error: fetchError } = await supabase
      .from("products")
      .select("image_url, name")
      .eq("id", productId)
      .single();

    if (fetchError) {
      console.error("Failed to fetch old product data:", fetchError);
      return { dbError: "Could not find the product to update." };
    }

    const oldImageUrl = oldProductData.image_url;

    const fileExt = image.name.split(".").pop();
    const safeName = String(oldProductData.name || productData.name)
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    const fileName = `products/${safeName}-${Date.now()}.${fileExt}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("assets")
      .upload(fileName, image);

    if (uploadError) {
      console.error("Image upload failed:", uploadError);
      return { validationErrors: { image: "Failed to upload image" } };
    }

    const { data: publicUrlData } = supabase.storage
      .from("assets")
      .getPublicUrl(uploadData.path);

    imageUrl = publicUrlData.publicUrl;

    if (oldImageUrl) {
      const oldImageFileName = oldImageUrl.split("/").pop();

      if (oldImageFileName) {
        await supabase.storage.from("assets").remove([oldImageFileName]);
      }
    }
  }

  const { data: updatedProduct, error: dbError } = await supabase
    .from("products")
    .update({
      name: productData.name,
      description: productData.description,
      price: productData.price,
      stock: productData.stock,
      category: productData.category,
      expiry_date: productData.expiryDate || null,
      prescription_required: Boolean(productData.prescriptionRequired) || false,
      ...(imageUrl && { image_url: imageUrl }),
    })
    .eq("id", productId)
    .select()
    .single();

  if (dbError) {
    console.error("Database update failed:", dbError);
    return { dbError: "Something went wrong. Please try again later." };
  }

  revalidatePath("/products");
  revalidatePath(`/products/${updatedProduct.id}`);

  return { success: true, product: updatedProduct };
}
