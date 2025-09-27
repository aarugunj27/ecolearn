import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  MapPin, 
  Search, 
  Navigation,
  Clock,
  Star,
  Phone,
  Recycle,
  Trash,
  TreePine,
  Zap
} from "lucide-react";

export default function Map() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  const recyclingCenters = [
    {
      id: 1,
      name: "EcoCenter Downtown",
      address: "123 Green Street, Downtown",
      distance: "0.5 miles",
      rating: 4.8,
      type: "Full Service",
      accepts: ["Plastic", "Glass", "Metal", "Paper", "Electronics"],
      hours: "Mon-Sat: 8AM-6PM",
      phone: "(555) 123-4567",
      coordinates: { lat: 40.7128, lng: -74.0060 }
    },
    {
      id: 2,
      name: "Green Valley Recycling",
      address: "456 Eco Avenue, Midtown",
      distance: "1.2 miles",
      rating: 4.6,
      type: "Electronics Only",
      accepts: ["Electronics", "Batteries"],
      hours: "Mon-Fri: 9AM-5PM",
      phone: "(555) 234-5678",
      coordinates: { lat: 40.7614, lng: -73.9776 }
    },
    {
      id: 3,
      name: "Community Compost Hub",
      address: "789 Earth Way, Uptown",
      distance: "2.1 miles",
      rating: 4.9,
      type: "Organic Waste",
      accepts: ["Compost", "Organic Waste"],
      hours: "Daily: 7AM-7PM",
      phone: "(555) 345-6789",
      coordinates: { lat: 40.7831, lng: -73.9712 }
    },
    {
      id: 4,
      name: "Metro Hazardous Waste Center",
      address: "321 Safety Drive, Industrial",
      distance: "3.5 miles",
      rating: 4.4,
      type: "Hazardous Materials",
      accepts: ["Hazardous Waste", "Chemicals", "Paint"],
      hours: "Sat-Sun: 10AM-4PM",
      phone: "(555) 456-7890",
      coordinates: { lat: 40.6892, lng: -74.0445 }
    }
  ];

  const filters = [
    { id: "all", label: "All Centers", icon: MapPin, count: recyclingCenters.length },
    { id: "electronics", label: "Electronics", icon: Zap, count: 1 },
    { id: "organic", label: "Compost", icon: TreePine, count: 1 },
    { id: "hazardous", label: "Hazardous", icon: Trash, count: 1 }
  ];

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "electronics only":
        return Zap;
      case "organic waste":
        return TreePine;
      case "hazardous materials":
        return Trash;
      default:
        return Recycle;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "electronics only":
        return "from-yellow-400 to-orange-500";
      case "organic waste":
        return "from-green-400 to-emerald-600";
      case "hazardous materials":
        return "from-red-400 to-pink-500";
      default:
        return "from-blue-400 to-cyan-500";
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 p-4 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Recycling Map</h1>
        <p className="text-muted-foreground">Find nearby recycling centers</p>
      </div>

      {/* Search & Location */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by address or zip code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Button className="w-full bg-gradient-to-r from-eco-primary to-eco-secondary text-white">
            <Navigation className="w-4 h-4 mr-2" />
            Use My Location
          </Button>
        </CardContent>
      </Card>

      {/* Map Placeholder */}
      <Card className="overflow-hidden">
        <div className="h-64 bg-gradient-to-br from-eco-secondary/20 to-eco-primary/20 relative flex items-center justify-center">
          <div className="text-center space-y-2">
            <MapPin className="w-12 h-12 text-eco-primary mx-auto" />
            <div className="text-lg font-semibold">Interactive Map</div>
            <div className="text-sm text-muted-foreground">
              Google Maps integration will show centers near you
            </div>
          </div>
          
          {/* Mock location pins */}
          <div className="absolute top-6 left-8">
            <div className="w-3 h-3 bg-success rounded-full animate-bounce-soft"></div>
          </div>
          <div className="absolute top-12 right-12">
            <div className="w-3 h-3 bg-primary rounded-full animate-bounce-soft" style={{ animationDelay: '0.5s' }}></div>
          </div>
          <div className="absolute bottom-8 left-1/3">
            <div className="w-3 h-3 bg-warning rounded-full animate-bounce-soft" style={{ animationDelay: '1s' }}></div>
          </div>
        </div>
      </Card>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {filters.map((filter) => (
          <Button
            key={filter.id}
            variant={selectedFilter === filter.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedFilter(filter.id)}
            className={`flex-shrink-0 ${
              selectedFilter === filter.id 
                ? "bg-primary text-primary-foreground" 
                : "hover:bg-muted"
            }`}
          >
            <filter.icon className="w-4 h-4 mr-1" />
            {filter.label}
            <Badge variant="secondary" className="ml-2 text-xs">
              {filter.count}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Recycling Centers List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Nearby Centers</h2>
        
        {recyclingCenters.map((center) => {
          const TypeIcon = getTypeIcon(center.type);
          const typeColor = getTypeColor(center.type);
          
          return (
            <Card 
              key={center.id}
              className="overflow-hidden hover:shadow-eco transition-all duration-300 hover:scale-[1.02]"
            >
              <div className={`h-1 bg-gradient-to-r ${typeColor}`} />
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${typeColor}`}>
                        <TypeIcon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{center.name}</h3>
                        <p className="text-sm text-muted-foreground">{center.address}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="text-sm font-medium">{center.rating}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">•</span>
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{center.distance}</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {center.type}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <h4 className="text-sm font-medium mb-1">Accepts:</h4>
                      <div className="flex flex-wrap gap-1">
                        {center.accepts.map((item, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{center.hours}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        <span>{center.phone}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="hover:bg-muted"
                    >
                      <Navigation className="w-4 h-4 mr-1" />
                      Directions
                    </Button>
                    <Button 
                      size="sm"
                      className="bg-gradient-to-r from-eco-primary to-eco-secondary text-white"
                    >
                      <Phone className="w-4 h-4 mr-1" />
                      Call
                    </Button>
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