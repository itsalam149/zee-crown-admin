import * as z from "zod";

const MAX_FILE_SIZE_MB = 3;
const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024; // 3MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const fileSchema = z
  .instanceof(File)
  .refine(
    (file) => file.size <= MAX_FILE_SIZE,
    `File size must be less than ${MAX_FILE_SIZE_MB}MB`
  )
  .refine(
    (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
    "Only .jpg, .jpeg, .png and .webp formats are supported"
  );

export const productFormSchema = z
  .object({
    name: z
      .string()
      .min(1, { message: "Product name is required" })
      .max(100, "Product name must be 100 characters or less"),
    description: z
      .string()
      .min(1, { message: "Product description is required" })
      .max(1000, "Product description must be 1000 characters or less"),
    image: z.union([fileSchema, z.string().url()]).optional().nullable(),
    category: z.enum(["Medicines", "Perfumes", "Cosmetics", "Food"], {
      required_error: "Category is required",
    }),
    price: z.coerce
      .number({ invalid_type_error: "Price must be a number" })
      .positive({ message: "Price must be greater than zero" })
      .finite(),
    stock: z.coerce
      .number({
        invalid_type_error: "Stock must be a number",
      })
      .int({ message: "Stock must be a whole number" })
      .min(0, { message: "Stock cannot be negative" }),
    expiryDate: z
      .string()
      .optional()
      .refine(
        (val) => !val || !Number.isNaN(Date.parse(val)),
        "Invalid date format"
      ),
    prescriptionRequired: z.coerce.boolean().optional(),
  });

export const productBulkFormSchema = z
  .object({
    category: z.enum(["Medicines", "Perfumes", "Cosmetics", "Food"]).optional(),
  })
  .superRefine((data, ctx) => {
    if (typeof data.category === "undefined") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Category must be provided.",
        path: ["category"],
      });
    }
  });

export type ProductFormData = z.infer<typeof productFormSchema>;
export type ProductBulkFormData = z.infer<typeof productBulkFormSchema>;