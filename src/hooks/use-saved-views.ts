import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SavedView {
  id: string;
  name: string;
  view_config: any;
  created_at: string;
}

interface ComparisonPreset {
  id: string;
  name: string;
  preset_type: string;
  left_id: string;
  right_id: string;
  created_at: string;
}

export function useSavedViews(userId: string | undefined) {
  const [views, setViews] = useState<SavedView[]>([]);
  const [presets, setPresets] = useState<ComparisonPreset[]>([]);

  const fetchViews = useCallback(async () => {
    if (!userId) return;
    const { data } = await supabase.from('saved_views').select('*').order('created_at', { ascending: false });
    if (data) setViews(data as SavedView[]);
  }, [userId]);

  const fetchPresets = useCallback(async () => {
    if (!userId) return;
    const { data } = await supabase.from('comparison_presets').select('*').order('created_at', { ascending: false });
    if (data) setPresets(data as ComparisonPreset[]);
  }, [userId]);

  useEffect(() => {
    fetchViews();
    fetchPresets();
  }, [fetchViews, fetchPresets]);

  const saveView = async (name: string, config: any) => {
    if (!userId) { toast.error('Sign in to save views'); return; }
    const { error } = await supabase.from('saved_views').insert({ user_id: userId, name, view_config: config });
    if (error) { toast.error(error.message); return; }
    toast.success('View saved');
    fetchViews();
  };

  const deleteView = async (id: string) => {
    const { error } = await supabase.from('saved_views').delete().eq('id', id);
    if (error) { toast.error(error.message); return; }
    fetchViews();
  };

  const savePreset = async (name: string, type: string, leftId: string, rightId: string) => {
    if (!userId) { toast.error('Sign in to save presets'); return; }
    const { error } = await supabase.from('comparison_presets').insert({
      user_id: userId, name, preset_type: type, left_id: leftId, right_id: rightId,
    });
    if (error) { toast.error(error.message); return; }
    toast.success('Preset saved');
    fetchPresets();
  };

  const deletePreset = async (id: string) => {
    const { error } = await supabase.from('comparison_presets').delete().eq('id', id);
    if (error) { toast.error(error.message); return; }
    fetchPresets();
  };

  return { views, presets, saveView, deleteView, savePreset, deletePreset };
}
