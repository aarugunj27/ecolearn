import { useState, useRef } from "react";
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
  AlertCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function Scanner() {
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Trigger file input (camera on mobile when `capture` is supported)
  const handleScan = () => {
    inputRef.current?.click();
  };

  // Image compression helper
  const compressImage = (
    file: File,
    maxSize: number,
    quality: number
  ): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        if (!e.target?.result) return;
        img.src = e.target.result as string;
      };

      img.onload = () => {
        let { width, height } = img;

        if (width > height && width > maxSize) {
          height *= maxSize / width;
          width = maxSize;
        } else if (height > maxSize) {
          width *= maxSize / height;
          height = maxSize;
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");

        if (!ctx) return reject("Canvas context error");
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject("Compression failed");
          },
          "image/jpeg",
          quality
        );
      };

      reader.onerror = () => reject("Image loading failed");
      reader.readAsDataURL(file);
    });
  };

  // Save scan result to Supabase table `scan_history` if user is logged in
  const saveScanToHistory = async (scanResult: any) => {
    try {
      const { data } = await supabase.auth.getUser();
      const user = data?.user ?? null;
      if (!user) return;

      // supabase client Database types in this repo may not include the `scan_history` table.
      // Cast the client to any to avoid TypeScript overload errors at this call site.
      await ((supabase as any).from("scan_history") as any).insert({
        user_id: user.id,
        item_name: scanResult.item || scanResult.name || null,
        is_recyclable:
          scanResult.recyclable ?? scanResult.category === "Recyclable",
        confidence_score:
          scanResult.confidence ?? scanResult.confidence_score ?? null,
        category: scanResult.category ?? null,
        instructions: JSON.stringify(
          scanResult.tips ?? scanResult.instructions ?? []
        ),
      });
    } catch (error) {
      console.error("Error saving scan:", error);
    }
  };

  // Handle file selection / upload
  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    toast({
      title: "Analyzing image...",
      description: "Please wait while we process your image.",
    });
    setIsScanning(true);

    // Cold start warning
    let coldStartTimeout = setTimeout(() => {
      toast({
        title: "Still processing...",
        description:
          "If this is your first scan in a while, the backend may be cold starting. This can take up to a minute.",
      });
    }, 10000);

    try {
      const compressedBlob = await compressImage(file, 512, 0.7);
      const previewURL = URL.createObjectURL(compressedBlob);

      const formData = new FormData();
      formData.append(
        "file",
        new File([compressedBlob as Blob], file.name, { type: "image/jpeg" })
      );

      const response = await fetch(
        "https://aarugunj-waste-classifier.hf.space/predict",
        {
          method: "POST",
          body: formData,
        }
      );

      clearTimeout(coldStartTimeout);

      const json = await response.json();

      // attach preview for UI
      json.preview = previewURL;

      // Map incoming result to the UI-friendly shape if needed
      const mapped = {
        item: json.item ?? json.name ?? "Unknown Item",
        category: json.category ?? (json.recyclable ? "Recyclable" : "Trash"),
        confidence:
          json.confidence ??
          json.confidence_score ??
          Math.round((json.score || 0) * 100),
        tips: json.tips ?? json.instructions ?? [],
        impact: json.impact ?? {
          co2Saved: json.co2Saved ?? "N/A",
          energySaved: json.energySaved ?? "N/A",
        },
        preview: json.preview,
        recyclable: json.recyclable ?? json.category === "Recyclable",
      };

      setResult(mapped);
      await saveScanToHistory(mapped);

      toast({
        title: "Analysis complete!",
        description: `${mapped.item} is ${
          mapped.recyclable ? "recyclable" : "not recyclable"
        }.`,
      });
    } catch (err) {
      clearTimeout(coldStartTimeout);
      console.error("Error analyzing image:", err);
      toast({
        title: "Error",
        description: "Failed to analyze image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
    }
  };

  const scanHistory = [
    {
      item: "Aluminum Can",
      category: "Recyclable",
      date: "Today",
      confidence: 98,
      correct: true,
    },
    {
      item: "Pizza Box",
      category: "Compostable",
      date: "Yesterday",
      confidence: 85,
      correct: true,
    },
    {
      item: "Styrofoam Container",
      category: "Trash",
      date: "2 days ago",
      confidence: 94,
      correct: false,
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20 p-4 space-y-6">
      {/* Hidden file input used by the Take Photo / Upload buttons */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleImageUpload}
        className="hidden"
      />
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Eco Scanner</h1>
        <p className="text-muted-foreground">
          Identify recyclable items with AI
        </p>
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
                  <p className="text-muted-foreground">
                    AI is identifying your item
                  </p>
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
                  <h3 className="text-2xl font-bold text-foreground">
                    {result.item}
                  </h3>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <Badge
                      variant={
                        result.category === "Recyclable"
                          ? "default"
                          : "destructive"
                      }
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
                    <h4 className="font-semibold text-success mb-2">
                      Environmental Impact
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="font-medium">CO₂ Saved</div>
                        <div className="text-success">
                          {result.impact.co2Saved}
                        </div>
                      </div>
                      <div>
                        <div className="font-medium">Energy Saved</div>
                        <div className="text-success">
                          {result.impact.energySaved}
                        </div>
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
