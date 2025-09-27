import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Camera, 
  Upload, 
  Scan,
  CheckCircle,
  XCircle,
  Recycle,
  Trash2,
  Lightbulb,
  AlertCircle
} from "lucide-react";

export default function Scanner() {
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleScan = async () => {
    setIsScanning(true);
    // Simulate scanning process
    setTimeout(() => {
      setResult({
        item: "Plastic Water Bottle",
        category: "Recyclable",
        confidence: 92,
        tips: [
          "Remove the cap and label before recycling",
          "Rinse out any remaining liquid",
          "Check your local recycling guidelines"
        ],
        impact: {
          co2Saved: "0.2 kg",
          energySaved: "1.2 kWh"
        }
      });
      setIsScanning(false);
    }, 2000);
  };

  const scanHistory = [
    {
      item: "Aluminum Can",
      category: "Recyclable",
      date: "Today",
      confidence: 98,
      correct: true
    },
    {
      item: "Pizza Box",
      category: "Compostable",
      date: "Yesterday",
      confidence: 85,
      correct: true
    },
    {
      item: "Styrofoam Container",
      category: "Trash",
      date: "2 days ago",
      confidence: 94,
      correct: false
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-20 p-4 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Eco Scanner</h1>
        <p className="text-muted-foreground">Identify recyclable items with AI</p>
      </div>

      {/* Scanner Card */}
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="text-center space-y-6">
            {!isScanning && !result && (
              <>
                <div className="w-32 h-32 mx-auto bg-gradient-to-r from-eco-primary to-eco-secondary rounded-full flex items-center justify-center animate-bounce-soft">
                  <Scan className="w-16 h-16 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Ready to Scan</h3>
                  <p className="text-muted-foreground mb-6">
                    Point your camera at an item to identify if it's recyclable
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <Button 
                      onClick={handleScan}
                      className="bg-gradient-to-r from-eco-primary to-eco-secondary text-white h-14"
                    >
                      <Camera className="w-5 h-5 mr-2" />
                      Take Photo
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-14 border-primary/30"
                      onClick={handleScan}
                    >
                      <Upload className="w-5 h-5 mr-2" />
                      Upload Image
                    </Button>
                  </div>
                </div>
              </>
            )}
            
            {isScanning && (
              <div className="space-y-4 animate-scale-in">
                <div className="w-32 h-32 mx-auto bg-gradient-to-r from-eco-primary to-eco-secondary rounded-full flex items-center justify-center animate-pulse">
                  <Scan className="w-16 h-16 text-white animate-spin" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Analyzing...</h3>
                  <p className="text-muted-foreground">AI is identifying your item</p>
                </div>
              </div>
            )}
            
            {result && (
              <div className="space-y-6 animate-slide-up">
                <div className="w-32 h-32 mx-auto bg-gradient-to-r from-success to-eco-primary rounded-full flex items-center justify-center">
                  {result.category === "Recyclable" ? (
                    <Recycle className="w-16 h-16 text-white" />
                  ) : (
                    <Trash2 className="w-16 h-16 text-white" />
                  )}
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold text-foreground">{result.item}</h3>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <Badge 
                      variant={result.category === "Recyclable" ? "default" : "destructive"}
                      className="text-lg px-4 py-1"
                    >
                      {result.category}
                    </Badge>
                    <Badge variant="outline">
                      {result.confidence}% confident
                    </Badge>
                  </div>
                </div>
                
                {/* Tips */}
                <Card className="bg-muted/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Lightbulb className="w-5 h-5 text-primary" />
                      Recycling Tips
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {result.tips.map((tip: string, index: number) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{tip}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
                
                {/* Environmental Impact */}
                <Card className="bg-success/10 border-success/20">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-success mb-2">Environmental Impact</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="font-medium">CO₂ Saved</div>
                        <div className="text-success">{result.impact.co2Saved}</div>
                      </div>
                      <div>
                        <div className="font-medium">Energy Saved</div>
                        <div className="text-success">{result.impact.energySaved}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Button 
                  onClick={() => setResult(null)}
                  className="w-full bg-gradient-to-r from-eco-primary to-eco-secondary text-white"
                >
                  Scan Another Item
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Scan History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Scans</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {scanHistory.map((scan, index) => (
            <div 
              key={index}
              className="flex items-center justify-between p-3 bg-muted rounded-lg"
            >
              <div className="flex items-center gap-3">
                {scan.category === "Recyclable" ? (
                  <Recycle className="w-5 h-5 text-success" />
                ) : scan.category === "Compostable" ? (
                  <CheckCircle className="w-5 h-5 text-eco-primary" />
                ) : (
                  <Trash2 className="w-5 h-5 text-destructive" />
                )}
                <div>
                  <div className="font-medium">{scan.item}</div>
                  <div className="text-sm text-muted-foreground">
                    {scan.category} • {scan.date}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {scan.confidence}%
                </Badge>
                {scan.correct ? (
                  <CheckCircle className="w-4 h-4 text-success" />
                ) : (
                  <XCircle className="w-4 h-4 text-destructive" />
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}