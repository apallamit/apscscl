import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChartComponent } from "@/components/dashboard/line-chart";

const routes = [
  { id: "1", label: "Guwahati - Bangalore (568)" },
  { id: "2", label: "Mumbai - Hyderabad (342)" },
  { id: "3", label: "Delhi - Chennai (897)" }
];

const routeDetails = {
  "1": {
    source: "Guwahati, Assam, India",
    destination: "Bangalore, Karnataka, India",
    kilometers: 2814
  },
  "2": {
    source: "Mumbai, Maharashtra, India",
    destination: "Hyderabad, Telangana, India",
    kilometers: 706
  },
  "3": {
    source: "Delhi, India",
    destination: "Chennai, Tamil Nadu, India",
    kilometers: 2182
  }
};

// Sample data
const generateChartData = (seed: number = 42) => {
  const dates = [
    "Jan-19", "Apr-19", "Jul-19", "Oct-19", 
    "Jan-20", "Apr-20", "Jul-20", "Oct-20", 
    "Jan-21", "Apr-21", "Jul-21", "Oct-21",
    "Jan-22", "Apr-22"
  ];
  
  // Generate slightly increasing rate/ton data with small variations
  const rateTonData = dates.map((date, i) => ({
    date,
    value: 3000 + (i * 50) + Math.floor(Math.random() * 200 - 100)
  }));
  
  // Generate shipment cost data with upward trend
  const shipmentCostData = dates.map((date, i) => ({
    date,
    value: 80000 + (i * 2000) + Math.floor(Math.random() * 5000 - 2500)
  }));
  
  return { rateTonData, shipmentCostData };
};

const { rateTonData, shipmentCostData } = generateChartData();

export function ShipmentCost() {
  const [selectedRoute, setSelectedRoute] = useState("1");
  const details = routeDetails[selectedRoute as keyof typeof routeDetails];
  
  return (
    <Card className="glassmorphism rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <CardHeader className="border-b border-gray-200 dark:border-gray-700">
        <CardTitle>Cargo Shipment Cost Variation</CardTitle>
      </CardHeader>
      
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-6">
          <div className="w-full md:w-1/3">
            <label htmlFor="selectRoute" className="block text-sm font-medium mb-1">
              Select Route
            </label>
            <Select
              value={selectedRoute}
              onValueChange={setSelectedRoute}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select route" />
              </SelectTrigger>
              <SelectContent>
                {routes.map((route) => (
                  <SelectItem key={route.id} value={route.id}>
                    {route.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Source</div>
            <div className="mt-1 text-lg font-semibold">{details.source}</div>
          </div>
          
          <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Destination</div>
            <div className="mt-1 text-lg font-semibold">{details.destination}</div>
          </div>
          
          <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Kilometers</div>
            <div className="mt-1 text-lg font-semibold">{details.kilometers.toLocaleString()}</div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <LineChartComponent 
            title="Rate/Ton (Rs.) vs. Date"
            series={{
              name: "Rate/Ton (Rs.)",
              data: rateTonData,
              color: "#3B82F6" // blue
            }}
            yAxisFormatter={(value) => `${value}`}
          />
          
          <LineChartComponent 
            title="Shipment Cost (Rs.) vs. Date"
            series={{
              name: "Shipment Cost (Rs.)",
              data: shipmentCostData,
              color: "#10B981" // green
            }}
            yAxisFormatter={(value) => `${value}`}
          />
        </div>
      </CardContent>
    </Card>
  );
}
