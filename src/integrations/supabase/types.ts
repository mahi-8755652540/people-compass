export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      candidates: {
        Row: {
          applied_date: string | null
          created_at: string | null
          email: string
          id: string
          job_id: string | null
          name: string
          notes: string | null
          phone: string | null
          position: string
          rating: number | null
          resume_url: string | null
          stage: string | null
          updated_at: string | null
        }
        Insert: {
          applied_date?: string | null
          created_at?: string | null
          email: string
          id?: string
          job_id?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          position: string
          rating?: number | null
          resume_url?: string | null
          stage?: string | null
          updated_at?: string | null
        }
        Update: {
          applied_date?: string | null
          created_at?: string | null
          email?: string
          id?: string
          job_id?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
          position?: string
          rating?: number | null
          resume_url?: string | null
          stage?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "candidates_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "job_openings"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_attendance: {
        Row: {
          check_in: string | null
          check_out: string | null
          created_at: string
          date: string
          id: string
          latitude: number | null
          location_address: string | null
          longitude: number | null
          notes: string | null
          photo_url: string | null
          status: string
          user_id: string
        }
        Insert: {
          check_in?: string | null
          check_out?: string | null
          created_at?: string
          date?: string
          id?: string
          latitude?: number | null
          location_address?: string | null
          longitude?: number | null
          notes?: string | null
          photo_url?: string | null
          status?: string
          user_id: string
        }
        Update: {
          check_in?: string | null
          check_out?: string | null
          created_at?: string
          date?: string
          id?: string
          latitude?: number | null
          location_address?: string | null
          longitude?: number | null
          notes?: string | null
          photo_url?: string | null
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      interviews: {
        Row: {
          candidate_id: string
          created_at: string | null
          id: string
          interview_date: string
          interview_time: string
          interviewer: string | null
          job_id: string | null
          notes: string | null
          status: string | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          candidate_id: string
          created_at?: string | null
          id?: string
          interview_date: string
          interview_time: string
          interviewer?: string | null
          job_id?: string | null
          notes?: string | null
          status?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          candidate_id?: string
          created_at?: string | null
          id?: string
          interview_date?: string
          interview_time?: string
          interviewer?: string | null
          job_id?: string | null
          notes?: string | null
          status?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "interviews_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interviews_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "job_openings"
            referencedColumns: ["id"]
          },
        ]
      }
      job_openings: {
        Row: {
          applicants: number | null
          created_at: string | null
          department: string
          description: string | null
          id: string
          location: string
          posted: string | null
          status: string | null
          title: string
          type: string
          updated_at: string | null
        }
        Insert: {
          applicants?: number | null
          created_at?: string | null
          department: string
          description?: string | null
          id?: string
          location: string
          posted?: string | null
          status?: string | null
          title: string
          type?: string
          updated_at?: string | null
        }
        Update: {
          applicants?: number | null
          created_at?: string | null
          department?: string
          description?: string | null
          id?: string
          location?: string
          posted?: string | null
          status?: string | null
          title?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      labour_attendance: {
        Row: {
          created_at: string | null
          date: string
          id: string
          labourer_id: string
          marked_by: string | null
          notes: string | null
          overtime_hours: number | null
          site_id: string
          status: string | null
        }
        Insert: {
          created_at?: string | null
          date?: string
          id?: string
          labourer_id: string
          marked_by?: string | null
          notes?: string | null
          overtime_hours?: number | null
          site_id: string
          status?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          labourer_id?: string
          marked_by?: string | null
          notes?: string | null
          overtime_hours?: number | null
          site_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "labour_attendance_labourer_id_fkey"
            columns: ["labourer_id"]
            isOneToOne: false
            referencedRelation: "labourers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "labour_attendance_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      labourers: {
        Row: {
          aadhar_number: string | null
          contractor_id: string
          created_at: string | null
          daily_wage: number | null
          id: string
          name: string
          phone: string | null
          site_id: string | null
          skill_type: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          aadhar_number?: string | null
          contractor_id: string
          created_at?: string | null
          daily_wage?: number | null
          id?: string
          name: string
          phone?: string | null
          site_id?: string | null
          skill_type?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          aadhar_number?: string | null
          contractor_id?: string
          created_at?: string | null
          daily_wage?: number | null
          id?: string
          name?: string
          phone?: string | null
          site_id?: string | null
          skill_type?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "labourers_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      leave_balance: {
        Row: {
          created_at: string
          id: string
          leave_type: string
          total_days: number
          updated_at: string
          used_days: number
          user_id: string
          year: number
        }
        Insert: {
          created_at?: string
          id?: string
          leave_type: string
          total_days?: number
          updated_at?: string
          used_days?: number
          user_id: string
          year?: number
        }
        Update: {
          created_at?: string
          id?: string
          leave_type?: string
          total_days?: number
          updated_at?: string
          used_days?: number
          user_id?: string
          year?: number
        }
        Relationships: []
      }
      leave_requests: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string
          end_date: string
          id: string
          leave_type: string
          reason: string | null
          start_date: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          end_date: string
          id?: string
          leave_type: string
          reason?: string | null
          start_date: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          end_date?: string
          id?: string
          leave_type?: string
          reason?: string | null
          start_date?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      payment_requests: {
        Row: {
          amount: number
          approved_at: string | null
          approved_by: string | null
          contractor_id: string
          created_at: string | null
          description: string | null
          id: string
          request_date: string | null
          site_id: string
          status: string | null
        }
        Insert: {
          amount: number
          approved_at?: string | null
          approved_by?: string | null
          contractor_id: string
          created_at?: string | null
          description?: string | null
          id?: string
          request_date?: string | null
          site_id: string
          status?: string | null
        }
        Update: {
          amount?: number
          approved_at?: string | null
          approved_by?: string | null
          contractor_id?: string
          created_at?: string | null
          description?: string | null
          id?: string
          request_date?: string | null
          site_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_requests_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bank_details: Json | null
          created_at: string | null
          department: string | null
          designation: string | null
          email: string
          father_name: string | null
          id: string
          mother_name: string | null
          name: string
          permanent_address: Json | null
          phone: string | null
          present_address: Json | null
          salary: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          bank_details?: Json | null
          created_at?: string | null
          department?: string | null
          designation?: string | null
          email: string
          father_name?: string | null
          id: string
          mother_name?: string | null
          name: string
          permanent_address?: Json | null
          phone?: string | null
          present_address?: Json | null
          salary?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          bank_details?: Json | null
          created_at?: string | null
          department?: string | null
          designation?: string | null
          email?: string
          father_name?: string | null
          id?: string
          mother_name?: string | null
          name?: string
          permanent_address?: Json | null
          phone?: string | null
          present_address?: Json | null
          salary?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      sites: {
        Row: {
          contractor_id: string | null
          created_at: string | null
          id: string
          location: string | null
          name: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          contractor_id?: string | null
          created_at?: string | null
          id?: string
          location?: string | null
          name: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          contractor_id?: string | null
          created_at?: string | null
          id?: string
          location?: string | null
          name?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      todos: {
        Row: {
          assigned_by: string | null
          completed_at: string | null
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          priority: string | null
          status: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          assigned_by?: string | null
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string | null
          status?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          assigned_by?: string | null
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string | null
          status?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      work_progress: {
        Row: {
          contractor_id: string
          created_at: string | null
          date: string
          description: string
          id: string
          photos: string[] | null
          progress_percentage: number | null
          site_id: string
        }
        Insert: {
          contractor_id: string
          created_at?: string | null
          date?: string
          description: string
          id?: string
          photos?: string[] | null
          progress_percentage?: number | null
          site_id: string
        }
        Update: {
          contractor_id?: string
          created_at?: string | null
          date?: string
          description?: string
          id?: string
          photos?: string[] | null
          progress_percentage?: number | null
          site_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "work_progress_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "hr" | "staff" | "contractor"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "hr", "staff", "contractor"],
    },
  },
} as const
