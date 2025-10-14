import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Zap, 
  Trash2, 
  Leaf, 
  Car,
  CheckCircle,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useProgress } from "@/hooks/useProgress";
import { useAchievements } from "@/hooks/useAchievements";
import { useToast } from "@/hooks/use-toast";

const categoryIcons: any = {
  "Energy Saving": Zap,
  "Waste Reduction": Trash2,
  "Sustainable Food": Leaf,
  "Eco Travel": Car,
};

const difficultyColors: any = {
  "beginner": "bg-success/10 text-success border-success/20",
  "intermediate": "bg-primary/10 text-primary border-primary/20",
  "advanced": "bg-destructive/10 text-destructive border-destructive/20",
};

export default function Lessons() {
  const { user } = useAuth();
  const { addXP, incrementLessons, updateStreak, progress } = useProgress();
  const { checkAndAwardAchievements } = useAchievements();
  const { toast } = useToast();
  const [lessons, setLessons] = useState<any[]>([]);
  const [userProgress, setUserProgress] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", "Energy Saving", "Waste Reduction", "Sustainable Food", "Eco Travel"];

  useEffect(() => {
    if (user) {
      fetchLessons();
    }
  }, [user]);

  const fetchLessons = async () => {
    if (!user) return;

    const { data: lessonsData } = await supabase
      .from('lessons')
      .select('*')
      .order('category', { ascending: true })
      .order('order_index', { ascending: true });

    const { data: progressData } = await supabase
      .from('user_lesson_progress')
      .select('*')
      .eq('user_id', user.id);

    setLessons(lessonsData || []);
    setUserProgress(progressData || []);
    setLoading(false);
  };

  const completeLesson = async (lesson: any) => {
    if (!user) return;

    const existingProgress = userProgress.find(p => p.lesson_id === lesson.id);

    if (existingProgress?.completed) {
      toast({
        title: "Already completed",
        description: "You've already completed this lesson!",
      });
      return;
    }

    const { error } = await supabase
      .from('user_lesson_progress')
      .upsert({
        user_id: user.id,
        lesson_id: lesson.id,
        completed: true,
        completed_at: new Date().toISOString(),
        score: 100,
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to complete lesson",
        variant: "destructive",
      });
      return;
    }

    await addXP(lesson.xp_reward);
    await incrementLessons();
    await updateStreak();
    await fetchLessons();

    if (progress) {
      await checkAndAwardAchievements(progress);
    }

    toast({
      title: "Lesson Complete! 🎉",
      description: `You earned ${lesson.xp_reward} XP!`,
    });
  };

  const isLessonCompleted = (lessonId: string) => {
    return userProgress.some(p => p.lesson_id === lessonId && p.completed);
  };

  const filteredLessons = selectedCategory === "All" 
    ? lessons 
    : lessons.filter(l => l.category === selectedCategory);

  const completedCount = userProgress.filter(p => p.completed).length;
  const totalCount = lessons.length;
  const completionPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 p-4 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Eco Lessons</h1>
        <p className="text-muted-foreground">Learn sustainable practices</p>
      </div>

      {/* Progress Overview */}
      <Card className="bg-gradient-to-r from-eco-primary/10 to-eco-secondary/10">
        <CardHeader>
          <CardTitle>Your Progress</CardTitle>
          <CardDescription>
            {completedCount} of {totalCount} lessons completed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={completionPercentage} className="h-3" />
        </CardContent>
      </Card>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            onClick={() => setSelectedCategory(category)}
            className="whitespace-nowrap"
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Lessons List */}
      <div className="space-y-4">
        {filteredLessons.map((lesson) => {
          const Icon = categoryIcons[lesson.category] || Leaf;
          const completed = isLessonCompleted(lesson.id);

          return (
            <Card key={lesson.id} className={completed ? "bg-success/5" : ""}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    completed 
                      ? "bg-success/20" 
                      : "bg-gradient-to-r from-eco-primary to-eco-secondary"
                  }`}>
                    {completed ? (
                      <CheckCircle className="w-6 h-6 text-success" />
                    ) : (
                      <Icon className="w-6 h-6 text-white" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{lesson.title}</h3>
                      {completed && (
                        <CheckCircle className="w-5 h-5 text-success" />
                      )}
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">
                      {lesson.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <Badge variant="outline" className={difficultyColors[lesson.difficulty]}>
                          {lesson.difficulty}
                        </Badge>
                        <Badge variant="outline">
                          +{lesson.xp_reward} XP
                        </Badge>
                      </div>
                      
                      <Button
                        onClick={() => completeLesson(lesson)}
                        disabled={completed}
                        size="sm"
                        className="bg-gradient-to-r from-eco-primary to-eco-secondary text-white"
                      >
                        {completed ? "Completed" : "Start Lesson"}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}