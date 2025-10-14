import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export function useProgress() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [progress, setProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProgress();
    }
  }, [user]);

  const fetchProgress = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Error fetching progress:', error);
    } else {
      setProgress(data);
    }
    setLoading(false);
  };

  const addXP = async (amount: number) => {
    if (!user || !progress) return;

    const newXP = progress.xp + amount;
    const newLevel = Math.floor(newXP / 100) + 1;

    const { error } = await supabase
      .from('user_progress')
      .update({ 
        xp: newXP, 
        level: newLevel,
        last_activity_date: new Date().toISOString().split('T')[0]
      })
      .eq('user_id', user.id);

    if (error) {
      console.error('Error updating XP:', error);
      toast({
        title: "Error",
        description: "Failed to update XP",
        variant: "destructive",
      });
    } else {
      await fetchProgress();
      if (newLevel > progress.level) {
        toast({
          title: "Level Up!",
          description: `You've reached level ${newLevel}! 🎉`,
        });
      }
    }
  };

  const updateStreak = async () => {
    if (!user || !progress) return;

    const today = new Date().toISOString().split('T')[0];
    const lastActivity = progress.last_activity_date;
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    let newStreak = progress.streak_days;
    
    if (lastActivity === yesterdayStr) {
      newStreak += 1;
    } else if (lastActivity !== today) {
      newStreak = 1;
    }

    const { error } = await supabase
      .from('user_progress')
      .update({ 
        streak_days: newStreak,
        last_activity_date: today
      })
      .eq('user_id', user.id);

    if (!error) {
      await fetchProgress();
    }
  };

  const incrementScans = async () => {
    if (!user || !progress) return;

    const { error } = await supabase
      .from('user_progress')
      .update({ total_scans: progress.total_scans + 1 })
      .eq('user_id', user.id);

    if (!error) {
      await fetchProgress();
    }
  };

  const incrementLessons = async () => {
    if (!user || !progress) return;

    const { error } = await supabase
      .from('user_progress')
      .update({ total_lessons_completed: progress.total_lessons_completed + 1 })
      .eq('user_id', user.id);

    if (!error) {
      await fetchProgress();
    }
  };

  return {
    progress,
    loading,
    addXP,
    updateStreak,
    incrementScans,
    incrementLessons,
    refreshProgress: fetchProgress,
  };
}