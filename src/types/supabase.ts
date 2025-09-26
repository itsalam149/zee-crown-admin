export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      addresses: {
        Row: {
          id: number
          user_id: string
          label: string | null
          name: string
          mobile: string
          address_line1: string
          address_line2: string | null
          city: string
          state: string
          zip: string
        }
        Insert: {
          id?: number
          user_id: string
          label?: string | null
          name: string
          mobile: string
          address_line1: string
          address_line2?: string | null
          city: string
          state: string
          zip: string
        }
        Update: {
          id?: number
          user_id?: string
          label?: string | null
          name?: string
          mobile?: string
          address_line1?: string
          address_line2?: string | null
          city?: string
          state?: string
          zip?: string
        }
        Relationships: [
          {
            foreignKeyName: "addresses_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      admin_actions: {
        Row: {
          id: number
          admin_id: string
          action: string
          target_table: string
          target_id: string
          created_at: string
        }
        Insert: {
          id?: number
          admin_id: string
          action: string
          target_table: string
          target_id: string
          created_at?: string
        }
        Update: {
          id?: number
          admin_id?: string
          action?: string
          target_table?: string
          target_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_actions_admin_id_fkey"
            columns: ["admin_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      cart_items: {
        Row: {
          cart_id: number
          product_id: number
          qty: number
          added_at: string
        }
        Insert: {
          cart_id: number
          product_id: number
          qty: number
          added_at?: string
        }
        Update: {
          cart_id?: number
          product_id?: number
          qty?: number
          added_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_cart_id_fkey"
            columns: ["cart_id"]
            referencedRelation: "carts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
      carts: {
        Row: {
          id: number
          user_id: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: number
          user_id?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: number
          user_id?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "carts_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      notifications: {
        Row: {
          id: number
          user_id: string
          message: string
          expires_at: string | null
          created_at: string
        }
        Insert: {
          id?: number
          user_id: string
          message: string
          expires_at?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          message?: string
          expires_at?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      order_items: {
        Row: {
          order_id: number
          product_id: number
          qty: number
          price: number
        }
        Insert: {
          order_id: number
          product_id: number
          qty: number
          price: number
        }
        Update: {
          order_id?: number
          product_id?: number
          qty?: number
          price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
      orders: {
        Row: {
          id: number
          user_id: string
          status: string
          total_amount: number
          shipping_name: string
          shipping_email: string
          shipping_mobile: string
          shipping_address: string
          shipping_city: string
          shipping_state: string
          shipping_zip: string
          payment_method: string
          created_at: string
          address_id: number | null
        }
        Insert: {
          id?: number
          user_id: string
          status: string
          total_amount: number
          shipping_name: string
          shipping_email: string
          shipping_mobile: string
          shipping_address: string
          shipping_city: string
          shipping_state: string
          shipping_zip: string
          payment_method: string
          created_at?: string
          address_id?: number | null
        }
        Update: {
          id?: number
          user_id?: string
          status?: string
          total_amount?: number
          shipping_name?: string
          shipping_email?: string
          shipping_mobile?: string
          shipping_address?: string
          shipping_city?: string
          shipping_state?: string
          shipping_zip?: string
          payment_method?: string
          created_at?: string
          address_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_address_id_fkey"
            columns: ["address_id"]
            referencedRelation: "addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      payments: {
        Row: {
          id: number
          order_id: number
          method: string
          status: string
          transaction_id: string
          amount: number
          created_at: string
        }
        Insert: {
          id?: number
          order_id: number
          method: string
          status: string
          transaction_id: string
          amount: number
          created_at?: string
        }
        Update: {
          id?: number
          order_id?: number
          method?: string
          status?: string
          transaction_id?: string
          amount?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_order_id_fkey"
            columns: ["order_id"]
            referencedRelation: "orders"
            referencedColumns: ["id"]
          }
        ]
      }
      products: {
        Row: {
          id: number
          name: string
          description: string | null
          price: number
          image_url: string | null
          category: string | null
          created_at: string
          stock: number
          expiry_date: string | null
          prescription_required: boolean
        }
        Insert: {
          id?: number
          name: string
          description?: string | null
          price: number
          image_url?: string | null
          category?: string | null
          created_at?: string
          stock: number
          expiry_date?: string | null
          prescription_required: boolean
        }
        Update: {
          id?: number
          name?: string
          description?: string | null
          price?: number
          image_url?: string | null
          category?: string | null
          created_at?: string
          stock?: number
          expiry_date?: string | null
          prescription_required?: boolean
        }
        Relationships: []
      }
      profiles: {
        Row: {
          id: string
          name: string | null
          email: string | null
          mobile: string | null
          role: string | null
          created_at: string
          address: string | null
          city: string | null
          state: string | null
          zip: string | null
        }
        Insert: {
          id: string
          name?: string | null
          email?: string | null
          mobile?: string | null
          role?: string | null
          created_at?: string
          address?: string | null
          city?: string | null
          state?: string | null
          zip?: string | null
        }
        Update: {
          id?: string
          name?: string | null
          email?: string | null
          mobile?: string | null
          role?: string | null
          created_at?: string
          address?: string | null
          city?: string | null
          state?: string | null
          zip?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      tracking_history: {
        Row: {
          id: number
          order_id: number
          status: string
          updated_at: string
        }
        Insert: {
          id?: number
          order_id: number
          status: string
          updated_at?: string
        }
        Update: {
          id?: number
          order_id?: number
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tracking_history_order_id_fkey"
            columns: ["order_id"]
            referencedRelation: "orders"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}