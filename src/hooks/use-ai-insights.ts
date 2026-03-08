import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface AiInsight {
  id: string;
  text: string;
  confidence: number;
  type: 'warning' | 'opportunity' | 'risk' | 'trend';
  sources: string[];
  action?: string;
}

export function useAiInsights() {
  const [insights, setInsights] = useState<AiInsight[]>([]);
  const [loading, setLoading] = useState(false);

  const generateInsights = useCallback(async (dashboardData: Record<string, unknown[]>) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-insights', {
        body: { dashboardData },
      });

      if (error) {
        // Check for rate limit or payment errors
        if (error.message?.includes('429')) {
          toast.error('AI rate limited. Please try again in a moment.');
        } else if (error.message?.includes('402')) {
          toast.error('AI credits exhausted. Please add credits in Settings → Workspace → Usage.');
        } else {
          toast.error('Failed to generate AI insights');
        }
        return;
      }

      if (data?.insights?.length) {
        setInsights(data.insights.map((ins: Omit<AiInsight, 'id'>, i: number) => ({
          ...ins,
          id: `ai-${Date.now()}-${i}`,
        })));
      }
    } catch (e) {
      console.error('AI insights error:', e);
      toast.error('Failed to connect to AI service');
    } finally {
      setLoading(false);
    }
  }, []);

  return { insights, loading, generateInsights };
}
