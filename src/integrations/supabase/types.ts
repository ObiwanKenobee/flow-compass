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
      capital_flows: {
        Row: {
          amount: number
          created_at: string
          flow_date: string
          id: string
          instrument_type: string | null
          source_name: string
          source_region_id: string | null
          target_name: string
          target_region_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          flow_date?: string
          id?: string
          instrument_type?: string | null
          source_name: string
          source_region_id?: string | null
          target_name: string
          target_region_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          flow_date?: string
          id?: string
          instrument_type?: string | null
          source_name?: string
          source_region_id?: string | null
          target_name?: string
          target_region_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "capital_flows_source_region_id_fkey"
            columns: ["source_region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "capital_flows_target_region_id_fkey"
            columns: ["target_region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
        ]
      }
      climate_funds: {
        Row: {
          approved: number
          co_financing_ratio: number
          contracted: number
          created_at: string
          deployed: number
          geographic_concentration: Json | null
          id: string
          name: string
          pledged: number
          released: number
          updated_at: string
          verified: number
        }
        Insert: {
          approved?: number
          co_financing_ratio?: number
          contracted?: number
          created_at?: string
          deployed?: number
          geographic_concentration?: Json | null
          id?: string
          name: string
          pledged?: number
          released?: number
          updated_at?: string
          verified?: number
        }
        Update: {
          approved?: number
          co_financing_ratio?: number
          contracted?: number
          created_at?: string
          deployed?: number
          geographic_concentration?: Json | null
          id?: string
          name?: string
          pledged?: number
          released?: number
          updated_at?: string
          verified?: number
        }
        Relationships: []
      }
      credit_price_history: {
        Row: {
          id: string
          instrument_id: string | null
          price: number
          recorded_at: string
        }
        Insert: {
          id?: string
          instrument_id?: string | null
          price: number
          recorded_at?: string
        }
        Update: {
          id?: string
          instrument_id?: string | null
          price?: number
          recorded_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "credit_price_history_instrument_id_fkey"
            columns: ["instrument_id"]
            isOneToOne: false
            referencedRelation: "market_instruments"
            referencedColumns: ["id"]
          },
        ]
      }
      funding_gaps: {
        Row: {
          adaptation: number
          biodiversity: number
          clean_energy: number
          created_at: string
          food_systems: number
          health_resilience: number
          id: string
          region: string
          updated_at: string
          urgency: Database["public"]["Enums"]["urgency_level"]
        }
        Insert: {
          adaptation?: number
          biodiversity?: number
          clean_energy?: number
          created_at?: string
          food_systems?: number
          health_resilience?: number
          id?: string
          region: string
          updated_at?: string
          urgency?: Database["public"]["Enums"]["urgency_level"]
        }
        Update: {
          adaptation?: number
          biodiversity?: number
          clean_energy?: number
          created_at?: string
          food_systems?: number
          health_resilience?: number
          id?: string
          region?: string
          updated_at?: string
          urgency?: Database["public"]["Enums"]["urgency_level"]
        }
        Relationships: []
      }
      impact_projects: {
        Row: {
          capital_deployed: number
          created_at: string
          financial_return: number
          id: string
          impact_return: number
          name: string
          region: string
          risk_tier: Database["public"]["Enums"]["risk_tier"]
          sector: string
          updated_at: string
          verified: boolean
        }
        Insert: {
          capital_deployed?: number
          created_at?: string
          financial_return?: number
          id?: string
          impact_return?: number
          name: string
          region: string
          risk_tier?: Database["public"]["Enums"]["risk_tier"]
          sector: string
          updated_at?: string
          verified?: boolean
        }
        Update: {
          capital_deployed?: number
          created_at?: string
          financial_return?: number
          id?: string
          impact_return?: number
          name?: string
          region?: string
          risk_tier?: Database["public"]["Enums"]["risk_tier"]
          sector?: string
          updated_at?: string
          verified?: boolean
        }
        Relationships: []
      }
      market_instruments: {
        Row: {
          change_30d: number
          created_at: string
          id: string
          impact_linkage_score: number
          issued_volume: number
          liquidity_depth: number
          name: string
          price_unit: string
          regions_supported: string[]
          retired_volume: number
          spot_price: number
          type: Database["public"]["Enums"]["instrument_type"]
          updated_at: string
          verification_lag_days: number
          verification_tier: Database["public"]["Enums"]["verification_tier"]
        }
        Insert: {
          change_30d?: number
          created_at?: string
          id?: string
          impact_linkage_score?: number
          issued_volume?: number
          liquidity_depth?: number
          name: string
          price_unit: string
          regions_supported?: string[]
          retired_volume?: number
          spot_price: number
          type: Database["public"]["Enums"]["instrument_type"]
          updated_at?: string
          verification_lag_days?: number
          verification_tier?: Database["public"]["Enums"]["verification_tier"]
        }
        Update: {
          change_30d?: number
          created_at?: string
          id?: string
          impact_linkage_score?: number
          issued_volume?: number
          liquidity_depth?: number
          name?: string
          price_unit?: string
          regions_supported?: string[]
          retired_volume?: number
          spot_price?: number
          type?: Database["public"]["Enums"]["instrument_type"]
          updated_at?: string
          verification_lag_days?: number
          verification_tier?: Database["public"]["Enums"]["verification_tier"]
        }
        Relationships: []
      }
      microfinance_loans: {
        Row: {
          active_loans: number
          avg_loan_size: number
          created_at: string
          id: string
          lat: number
          lng: number
          region: string
          repayment_rate: number
          resilience_linked: boolean
          sectors: string[]
          total_loans: number
          updated_at: string
          women_borrowers: number
          youth_borrowers: number
        }
        Insert: {
          active_loans?: number
          avg_loan_size?: number
          created_at?: string
          id?: string
          lat: number
          lng: number
          region: string
          repayment_rate?: number
          resilience_linked?: boolean
          sectors?: string[]
          total_loans?: number
          updated_at?: string
          women_borrowers?: number
          youth_borrowers?: number
        }
        Update: {
          active_loans?: number
          avg_loan_size?: number
          created_at?: string
          id?: string
          lat?: number
          lng?: number
          region?: string
          repayment_rate?: number
          resilience_linked?: boolean
          sectors?: string[]
          total_loans?: number
          updated_at?: string
          women_borrowers?: number
          youth_borrowers?: number
        }
        Relationships: []
      }
      regions: {
        Row: {
          capital_in: number
          capital_out: number
          created_at: string
          funding_gap: number | null
          id: string
          lat: number
          lng: number
          name: string
          sectors: string[]
          status: Database["public"]["Enums"]["flow_status"]
          updated_at: string
        }
        Insert: {
          capital_in?: number
          capital_out?: number
          created_at?: string
          funding_gap?: number | null
          id?: string
          lat: number
          lng: number
          name: string
          sectors?: string[]
          status?: Database["public"]["Enums"]["flow_status"]
          updated_at?: string
        }
        Update: {
          capital_in?: number
          capital_out?: number
          created_at?: string
          funding_gap?: number | null
          id?: string
          lat?: number
          lng?: number
          name?: string
          sectors?: string[]
          status?: Database["public"]["Enums"]["flow_status"]
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      flow_status: "healthy" | "warning" | "critical"
      instrument_type:
        | "carbon"
        | "biodiversity"
        | "water"
        | "adaptation"
        | "resilience"
      risk_tier: "low" | "medium" | "high"
      urgency_level: "low" | "medium" | "high" | "critical"
      verification_tier: "gold" | "silver" | "bronze" | "unverified"
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
      flow_status: ["healthy", "warning", "critical"],
      instrument_type: [
        "carbon",
        "biodiversity",
        "water",
        "adaptation",
        "resilience",
      ],
      risk_tier: ["low", "medium", "high"],
      urgency_level: ["low", "medium", "high", "critical"],
      verification_tier: ["gold", "silver", "bronze", "unverified"],
    },
  },
} as const
