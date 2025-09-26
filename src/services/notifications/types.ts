export type Notification = {
  id: string;
  title: string;
  image_url: string;
  type: "new_order" | "low_stock";
  is_read: boolean;
  published: boolean;
  staff_id: string;
  created_at: string;
};
