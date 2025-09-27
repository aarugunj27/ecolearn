import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Trophy, 
  Award, 
  Star, 
  Crown,
  Target,
  Flame,
  Zap,
  TreePine,
  Droplets,
  Car,
  Calendar,
  Users
} from "lucide-react";

export default function Achievements() {
  const achievements = [
    {
      id: 1,
      name: "First Steps",
      description: "Complete your first eco lesson",
      icon: Star,
      earned: true,
      earnedDate: "2024-01-15",
      rarity: "common",
      xp: 25,
      color: "from-yellow-400 to-orange-500"
    },
    {
      id: 2,
      name: "Energy Saver",
      description: "Complete 10 energy saving lessons",
      icon: Zap,
      earned: true,
      earnedDate: "2024-01-20",
      rarity: "uncommon",
      xp: 100,
      color: "from-yellow-400 to-orange-500"
    },
    {
      id: 3,
      name: "Week Warrior",
      description: "Maintain a 7-day streak",
      icon: Flame,
      earned: true,
      earnedDate: "2024-01-22",
      rarity: "rare",
      xp: 150,
      color: "from-red-400 to-orange-500"
    },
    {
      id: 4,
      name: "Green Guardian",
      description: "Master waste reduction skills",
      icon: TreePine,
      earned: false,
      earnedDate: null,
      rarity: "epic",
      xp: 250,
      color: "from-green-400 to-emerald-600"
    },
    {
      id: 5,
      name: "Eco Explorer",
      description: "Use the scanner 20 times",
      icon: Target,
      earned: false,
      earnedDate: null,
      rarity: "uncommon",
      xp: 75,
      color: "from-blue-400 to-cyan-500"
    },
    {
      id: 6,
      name: "Sustainability Sage",
      description: "Complete all skill categories",
      icon: Crown,
      earned: false,
      earnedDate: null,
      rarity: "legendary",
      xp: 500,
      color: "from-purple-400 to-pink-500"
    },
    {
      id: 7,
      name: "Water Wise",
      description: "Learn about water conservation",
      icon: Droplets,
      earned: true,
      earnedDate: "2024-01-18",
      rarity: "common",
      xp: 50,
      color: "from-blue-400 to-cyan-500"
    },
    {
      id: 8,
      name: "Transport Pioneer",
      description: "Unlock eco travel category",
      icon: Car,
      earned: false,
      earnedDate: null,
      rarity: "rare",
      xp: 200,
      color: "from-purple-400 to-indigo-500"
    }
  ];

  const stats = {
    totalEarned: achievements.filter(a => a.earned).length,
    totalXP: achievements.filter(a => a.earned).reduce((sum, a) => sum + a.xp, 0),
    streak: 7,
    level: 5
  };

  const rarityColors = {
    common: "border-gray-400 bg-gray-50",
    uncommon: "border-green-400 bg-green-50",
    rare: "border-blue-400 bg-blue-50",
    epic: "border-purple-400 bg-purple-50",
    legendary: "border-yellow-400 bg-yellow-50"
  };

  const rarityLabels = {
    common: "Common",
    uncommon: "Uncommon", 
    rare: "Rare",
    epic: "Epic",
    legendary: "Legendary"
  };

  return (
    <div className="min-h-screen bg-background pb-20 p-4 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Achievements</h1>
        <p className="text-muted-foreground">Celebrate your eco-friendly milestones</p>
      </div>

      {/* Stats */}
      <div className="bg-gradient-to-r from-eco-primary to-eco-secondary rounded-2xl p-6 text-white">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <Trophy className="w-8 h-8 mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.totalEarned}</div>
            <div className="text-sm text-white/80">Badges Earned</div>
          </div>
          <div>
            <Star className="w-8 h-8 mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.totalXP}</div>
            <div className="text-sm text-white/80">Badge XP</div>
          </div>
          <div>
            <Flame className="w-8 h-8 mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.streak}</div>
            <div className="text-sm text-white/80">Day Streak</div>
          </div>
          <div>
            <Award className="w-8 h-8 mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.level}</div>
            <div className="text-sm text-white/80">Current Level</div>
          </div>
        </div>
      </div>

      {/* Achievement Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Your Badges</h2>
        
        <div className="grid gap-4">
          {achievements.map((achievement) => (
            <Card 
              key={achievement.id}
              className={`overflow-hidden transition-all duration-300 ${
                achievement.earned 
                  ? 'hover:shadow-eco animate-scale-in' 
                  : 'opacity-60'
              } ${rarityColors[achievement.rarity]} border-2`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className={`relative p-3 rounded-full bg-gradient-to-r ${achievement.color} ${
                    achievement.earned ? 'animate-bounce-soft' : ''
                  }`}>
                    <achievement.icon className="w-8 h-8 text-white" />
                    {achievement.earned && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-success rounded-full flex items-center justify-center">
                        <Award className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{achievement.name}</h3>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant="outline" 
                          className={`${rarityColors[achievement.rarity]} text-xs`}
                        >
                          {rarityLabels[achievement.rarity]}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-primary" />
                        <span className="font-medium">+{achievement.xp} XP</span>
                      </div>
                      {achievement.earned ? (
                        <div className="text-sm text-success font-medium">
                          Earned {new Date(achievement.earnedDate!).toLocaleDateString()}
                        </div>
                      ) : (
                        <div className="text-sm text-muted-foreground">
                          Not earned yet
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Progress Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            Achievement Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-2">
            <div className="text-3xl font-bold text-primary">
              {stats.totalEarned}/{achievements.length}
            </div>
            <p className="text-muted-foreground">
              Keep going! You're making a real difference for our planet.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}