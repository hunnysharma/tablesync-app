
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      tables: {
        Row: {
          id: string
          number: number
          capacity: number
          status: string
          current_order_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          number: number
          capacity: number
          status: string
          current_order_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          number?: number
          capacity?: number
          status?: string
          current_order_id?: string | null
          created_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_at?: string
        }
      }
      menu_items: {
        Row: {
          id: string
          name: string
          description: string | null
          price: number
          category_id: string
          image: string | null
          available: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          price: number
          category_id: string
          image?: string | null
          available?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          price?: number
          category_id?: string
          image?: string | null
          available?: boolean
          created_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          menu_item_id: string
          menu_item_name: string
          quantity: number
          price: number
          notes: string | null
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          menu_item_id: string
          menu_item_name: string
          quantity: number
          price: number
          notes?: string | null
          status: string
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          menu_item_id?: string
          menu_item_name?: string
          quantity?: number
          price?: number
          notes?: string | null
          status?: string
          created_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          table_id: string
          table_number: number
          status: string
          created_at: string
          updated_at: string
          subtotal: number
          tax: number
          total: number
          payment_status: string
          payment_method: string | null
        }
        Insert: {
          id?: string
          table_id: string
          table_number: number
          status: string
          created_at?: string
          updated_at?: string
          subtotal: number
          tax: number
          total: number
          payment_status: string
          payment_method?: string | null
        }
        Update: {
          id?: string
          table_id?: string
          table_number?: number
          status?: string
          created_at?: string
          updated_at?: string
          subtotal?: number
          tax?: number
          total?: number
          payment_status?: string
          payment_method?: string | null
        }
      }
      bills: {
        Row: {
          id: string
          order_id: string
          table_number: number
          subtotal: number
          tax: number
          total: number
          payment_status: string
          payment_method: string | null
          created_at: string
          paid_at: string | null
        }
        Insert: {
          id?: string
          order_id: string
          table_number: number
          subtotal: number
          tax: number
          total: number
          payment_status: string
          payment_method?: string | null
          created_at?: string
          paid_at?: string | null
        }
        Update: {
          id?: string
          order_id?: string
          table_number?: number
          subtotal?: number
          tax?: number
          total?: number
          payment_status?: string
          payment_method?: string | null
          created_at?: string
          paid_at?: string | null
        }
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
  }
}
