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
      profiles: {
        Row: {
          id: string
          nama: string
          role: 'seller' | 'admin'
          created_at: string
        }
        Insert: {
          id: string
          nama?: string
          role?: 'seller' | 'admin'
          created_at?: string
        }
        Update: {
          id?: string
          nama?: string
          role?: 'seller' | 'admin'
          created_at?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          id: number
          nama: string
        }
        Insert: {
          id?: number
          nama: string
        }
        Update: {
          id?: number
          nama?: string
        }
        Relationships: []
      }
      regions: {
        Row: {
          id: number
          nama: string
        }
        Insert: {
          id?: number
          nama: string
        }
        Update: {
          id?: number
          nama?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          id: string
          seller_id: string
          category_id: number | null
          region_id: number | null
          nama: string
          deskripsi: string
          harga: number
          foto_url: string | null
          no_wa: string
          alamat: string | null
          status: 'pending' | 'approved' | 'rejected'
          alasan_tolak: string | null
          is_featured: boolean
          created_at: string
        }
        Insert: {
          id?: string
          seller_id: string
          category_id?: number | null
          region_id?: number | null
          nama: string
          deskripsi: string
          harga: number
          foto_url?: string | null
          no_wa: string
          alamat?: string | null
          status?: 'pending' | 'approved' | 'rejected'
          alasan_tolak?: string | null
          is_featured?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          seller_id?: string
          category_id?: number | null
          region_id?: number | null
          nama?: string
          deskripsi?: string
          harga?: number
          foto_url?: string | null
          no_wa?: string
          alamat?: string | null
          status?: 'pending' | 'approved' | 'rejected'
          alasan_tolak?: string | null
          is_featured?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          }
        ]
      }
      wa_clicks: {
        Row: {
          id: number
          product_id: string
          created_at: string
        }
        Insert: {
          id?: number
          product_id: string
          created_at?: string
        }
        Update: {
          id?: number
          product_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "wa_clicks_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      admin_get_users: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          email: string
          nama: string
          role: 'seller' | 'admin'
          created_at: string
          product_count: number
        }[]
      }
      admin_update_user: {
        Args: {
          target_user_id: string
          target_nama: string
          target_role: string
        }
        Returns: undefined
      }
      admin_delete_user: {
        Args: {
          target_user_id: string
        }
        Returns: {
          success: boolean
          deleted_products_count: number
        }
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
