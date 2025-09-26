import { SupabaseClient } from "@supabase/supabase-js";

import { Database } from "@/types/supabase";
import { queryPaginatedTable } from "@/helpers/queryPaginatedTable";
import { Product, FetchProductsParams, FetchProductsResponse, ProductDetails } from "./types";

export async function fetchProducts(
  client: SupabaseClient<Database>,
  {
    page = 1,
    limit = 10,
    search,
    category,
    priceSort,
    dateSort,
  }: FetchProductsParams
): Promise<FetchProductsResponse> {
  let query = client.from("products").select("*", { count: "exact" });

  if (search) {
    query = query.ilike("name", `%${search}%`);
  }

  if (category) {
    query = query.eq("category", category);
  }

  if (priceSort) {
    query = query.order("price", {
      ascending: priceSort === "lowest-first",
    });
  } else if (dateSort) {
    query = query.order("created_at", {
      ascending: dateSort === "date-added-asc",
    });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  const paginatedProducts = await queryPaginatedTable<Product, "products">({
    name: "products",
    page,
    limit,
    query,
  });

  return paginatedProducts;
}

export async function fetchProductDetails(
  client: SupabaseClient<Database>,
  { id }: { id: string }
) {
  const { data, error } = await client
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error.message);
    throw new Error(`Failed to fetch product details: ${error.message}`);
  }

  if (!data) {
    console.error("Failed to fetch product details");
    throw new Error("Failed to fetch product details");
  }

  return { product: data as ProductDetails };
}