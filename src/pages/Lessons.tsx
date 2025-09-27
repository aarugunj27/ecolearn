import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Zap, 
  TreePine, 
  Droplets, 
  Car,
  Lock,
  Play,
  CheckCircle,
  Clock
} from "lucide-react";

export default function Lessons() {
  const categories = [
    {
      id: 1,
      name: "Energy Saving",
      icon: Zap,
      color: "from-yellow-400 to-orange-500",
      lessons: 12,
      completed: 8,
      description: "Learn to reduce energy consumption",
      unlocked: true
    },
    {
      id: 2,
      name: "Waste Reduction",
      icon: TreePine,
      color: "from-green-400 to-emerald-600",
      lessons: 10,
      completed: 5,
      description: "Master recycling and waste management",
      unlocked: true
    },
    {
      id: 3,
      name: "Sustainable Food",
      icon: Droplets,
      color: "from-blue-400 to-cyan-500",
      lessons: 8,
      completed: 2,
      description: "Discover eco-friendly eating habits",
      unlocked: true
    },
    {
      id: 4,
      name: "Eco Travel",
      icon: Car,
      color: "from-purple-400 to-indigo-500",
      lessons: 6,
      completed: 0,
      description: "Learn sustainable transportation",
      unlocked: false
    }
  ];

  const recentLessons = [
    {
      title: "LED vs Incandescent Bulbs",
      category: "Energy Saving",
      duration: "5 min",
      xp: 25,
      completed: true
    },
    {
      title: "Composting at Home",
      category: "Waste Reduction",
      duration: "8 min",
      xp: 40,
      completed: true
    },
    {
      title: "Smart Thermostats",
      category: "Energy Saving",
      duration: "6 min",
      xp: 30,
      completed: false
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-20 p-4 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Eco Lessons</h1>
        <p className="text-muted-foreground">Learn sustainable practices step by step</p>
      </div>

      {/* Categories */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Categories</h2>
        <div className="grid gap-4">
          {categories.map((category) => (
            <Card 
              key={category.id} 
              className={`overflow-hidden transition-all duration-300 hover:shadow-eco ${
                category.unlocked ? 'hover:scale-[1.02]' : 'opacity-75'
              }`}
            >
              <div className={`h-2 bg-gradient-to-r ${category.color}`} />
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${category.color}`}>
                      <category.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{category.name}</h3>
                      <p className="text-sm text-muted-foreground">{category.description}</p>
                    </div>
                  </div>
                  {!category.unlocked && (
                    <Lock className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {category.completed}/{category.lessons} lessons completed
                    </span>
                    <Badge variant="secondary">
                      {Math.round((category.completed / category.lessons) * 100)}%
                    </Badge>
                  </div>
                  <Progress 
                    value={(category.completed / category.lessons) * 100} 
                    className="h-2"
                  />
                  <Button 
                    className={`w-full ${category.unlocked 
                      ? 'bg-gradient-to-r from-eco-primary to-eco-secondary text-white' 
                      : 'bg-muted text-muted-foreground cursor-not-allowed'
                    }`}
                    disabled={!category.unlocked}
                  >
                    {category.unlocked ? (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Continue Learning
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        Unlock with XP
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Lessons */}
      <Card>
        <CardHeader>
          <CardTitle>Continue Learning</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentLessons.map((lesson, index) => (
            <div 
              key={index}
              className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/70 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                {lesson.completed ? (
                  <CheckCircle className="w-6 h-6 text-success" />
                ) : (
                  <Play className="w-6 h-6 text-primary" />
                )}
                <div>
                  <h4 className="font-medium">{lesson.title}</h4>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{lesson.category}</span>
                    <span>•</span>
                    <Clock className="w-3 h-3" />
                    <span>{lesson.duration}</span>
                  </div>
                </div>
              </div>
              <Badge variant="outline" className="text-primary border-primary/30">
                +{lesson.xp} XP
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}