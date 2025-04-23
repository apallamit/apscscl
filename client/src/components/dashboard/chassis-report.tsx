import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const vehicles = [
  { id: "all", label: "All" },
  { id: "AP01AB1234", label: "AP01 AB1234" },
  { id: "AP02CD5678", label: "AP02 CD5678" },
  { id: "TN01EF9012", label: "TN01 EF9012" }
];

export function ChassisReport() {
  const [selectedVehicle, setSelectedVehicle] = useState("all");
  const [fromDate, setFromDate] = useState<Date | undefined>(new Date("2025-01-01"));
  const [toDate, setToDate] = useState<Date | undefined>(new Date("2025-04-30"));
  const [hasSearched, setHasSearched] = useState(false);
  
  const handleSearch = () => {
    setHasSearched(true);
    // In a real application, this would trigger an API call to fetch data
  };
  
  return (
    <Card className="glassmorphism rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <CardHeader className="border-b border-gray-200 dark:border-gray-700">
        <CardTitle>AL Chassis Carrier Load And Empty KMS</CardTitle>
      </CardHeader>
      
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label htmlFor="selectVehicle" className="block text-sm font-medium mb-1">
              Select Vehicle
            </label>
            <Select
              value={selectedVehicle}
              onValueChange={setSelectedVehicle}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select vehicle" />
              </SelectTrigger>
              <SelectContent>
                {vehicles.map((vehicle) => (
                  <SelectItem key={vehicle.id} value={vehicle.id}>
                    {vehicle.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              From Date
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !fromDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {fromDate ? format(fromDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={fromDate}
                  onSelect={setFromDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              To Date
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !toDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {toDate ? format(toDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={toDate}
                  onSelect={setToDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        <div className="flex justify-end mb-6">
          <Button 
            onClick={handleSearch}
            className="flex items-center"
          >
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
        
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
            AL Kilometers Driven per Month (kms.) vs. Month
          </h4>
          <div className="h-[200px] flex justify-center items-center">
            {!hasSearched && (
              <div className="flex flex-col items-center text-gray-500 dark:text-gray-400">
                <Search className="h-6 w-6 mb-2" />
                <span>Select date range and click Search to view data</span>
              </div>
            )}
            {hasSearched && (
              <div className="w-full h-full bg-white dark:bg-slate-800 flex items-center justify-center">
                <div className="text-center text-gray-500 dark:text-gray-400">
                  {/* In a real application, this would be replaced with a chart component */}
                  <div className="text-sm">No data available for the selected criteria</div>
                  <div className="text-xs mt-2">Try selecting a different date range or vehicle</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
