import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Flame, 
  Zap, 
  TreePine, 
  Droplets,
  Calendar,
  Star,
  ChevronRight,
  BookOpen
} from "lucide-react";

export default function Dashboard() {
  const streakDays = 7;
  const totalXP = 1250;
  const levelXP = 950;
  const nextLevelXP = 1000;

  const dailyQuests = [
    { title: "Complete 3 lessons", progress: 2, total: 3, xp: 50 },
    { title: "Use scanner feature", progress: 0, total: 1, xp: 30 },
    { title: "Learn about renewable energy", progress: 1, total: 1, xp: 40 },
  ];

  const categories = [
    { name: "Energy Saving", icon: Zap, color: "text-yellow-600", progress: 65 },
    { name: "Waste Reduction", icon: TreePine, color: "text-green-600", progress: 45 },
    { name: "Sustainable Food", icon: Droplets, color: "text-blue-600", progress: 30 },
    { name: "Eco Travel", icon: Calendar, color: "text-purple-600", progress: 20 },
  ];

  return (
    <div className="min-h-screen bg-background pb-20 p-4 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-eco-primary to-eco-secondary rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Welcome back!</h1>
            <p className="text-white/80">Ready to save the planet?</p>
          </div>
          <div className="flex items-center gap-2 bg-white/20 rounded-full px-3 py-1">
            <Flame className="w-5 h-5" />
            <span className="font-bold">{streakDays}</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm">Level 5</span>
            <span className="text-sm">{levelXP}/{nextLevelXP} XP</span>
          </div>
          <Progress value={(levelXP / nextLevelXP) * 100} className="h-2" />
        </div>
      </div>

      {/* Daily Quests */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-primary" />
            Daily Quests
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {dailyQuests.map((quest, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="space-y-1">
                <p className="font-medium">{quest.title}</p>
                <div className="flex items-center gap-2">
                  <Progress 
                    value={(quest.progress / quest.total) * 100} 
                    className="h-2 w-24"
                  />
                  <span className="text-sm text-muted-foreground">
                    {quest.progress}/{quest.total}
                  </span>
                </div>
              </div>
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                +{quest.xp} XP
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Progress Overview */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Your Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {categories.map((category, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <category.icon className={`w-5 h-5 ${category.color}`} />
                  <span className="font-medium">{category.name}</span>
                </div>
                <span className="text-sm text-muted-foreground">{category.progress}%</span>
              </div>
              <Progress value={category.progress} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Button 
          className="h-16 bg-gradient-to-r from-eco-primary to-eco-secondary text-white border-0 shadow-eco"
          size="lg"
        >
          <BookOpen className="w-5 h-5 mr-2" />
          Start Lesson
        </Button>
        <Button 
          variant="outline" 
          className="h-16 border-primary/30 hover:bg-primary/5"
          size="lg"
        >
          <Zap className="w-5 h-5 mr-2" />
          View Skills
        </Button>
      </div>
    </div>
  );
}