import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Home, ChevronRight, Search, MoreVertical, Printer, FileText, Eye, Edit, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface VehicleDocument {
  id: string;
  documentType: string;
  applicationNo?: string;
  ownerName?: string;
  make?: string;
  validityDate: string;
}

export default function VehiclePage() {
  const [activeTab, setActiveTab] = useState<'active-vehicle' | 'inactive-vehicle'>('active-vehicle');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>('AP39UQ8623');
  
  // Sample vehicle data
  const vehicles = [
    { id: 'AP39UQ8623', status: 'active', type: 'LJ 3018 TT', segment: 'Cargo', make: 'ASHOK LEYLAND LTD' },
    { id: 'NL21M4521', status: 'active', type: 'LJ 3018 TT', segment: 'Cargo', make: 'ASHOK LEYLAND LTD' },
    { id: 'NL21M4770', status: 'active', type: 'LJ 3018 TT', segment: 'Cargo', make: 'ASHOK LEYLAND LTD' },
    { id: 'NL21K8523', status: 'active', type: 'LJ 3018 TT', segment: 'Cargo', make: 'ASHOK LEYLAND LTD' },
    { id: 'NL21K8622', status: 'active', type: 'LJ 3018 TT', segment: 'Cargo', make: 'ASHOK LEYLAND LTD' },
    { id: 'NL21K8521', status: 'active', type: 'LJ 3018 TT', segment: 'Cargo', make: 'ASHOK LEYLAND LTD' },
    { id: 'NL21K8286', status: 'active', type: 'LJ 3018 TT', segment: 'Cargo', make: 'ASHOK LEYLAND LTD' },
    { id: 'NL21K8285', status: 'active', type: 'LJ 3018 TT', segment: 'Cargo', make: 'ASHOK LEYLAND LTD' },
    { id: 'NL21K8279', status: 'active', type: 'LJ 3018 TT', segment: 'Cargo', make: 'ASHOK LEYLAND LTD' },
    { id: 'NL21K8276', status: 'active', type: 'LJ 3018 TT', segment: 'Cargo', make: 'ASHOK LEYLAND LTD' }
  ];
  
  // Sample documents for the selected vehicle
  const documents: VehicleDocument[] = [
    { id: '1', documentType: 'Certificate of Registration', ownerName: 'MANNU LOGISTICS PRIVATE LIMITED', make: 'ASHOK LEYLAND LTD', validityDate: '01-March-2023' },
    { id: '2', documentType: 'Certificate of Fitness', applicationNo: 'FC0130642024P013', validityDate: '08-February-2024' },
    { id: '3', documentType: 'Basic goods', applicationNo: 'AP/GV75049/P/JC/2023', validityDate: '15-July-2025' },
    { id: '4', documentType: 'National Permit', applicationNo: 'NP/AP/1407/2023/53125', validityDate: '15-July-2024' },
    { id: '5', documentType: 'Road Tax', applicationNo: 'AP01/56871/22/2023', validityDate: '30-September-2023' },
    { id: '6', documentType: 'Pollution Under Control Certificate (PUCC)', applicationNo: 'ARD/201402/2185', validityDate: '07-January-2024' },
    { id: '7', documentType: 'Insurance', applicationNo: '8D/1063/01/2022/2783', validityDate: '15-May-2024' }
  ];
  
  // Get the details of selected vehicle
  const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId);
  
  const handleSelectVehicle = (vehicleId: string) => {
    setSelectedVehicleId(vehicleId);
  };
  
  return (
    <AppLayout>
      {/* Breadcrumb */}
      <div className="mb-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
        <Home className="h-4 w-4 mr-1" />
        <span>Dashboard</span>
        <ChevronRight className="h-4 w-4 mx-1" />
        <span>Master</span>
        <ChevronRight className="h-4 w-4 mx-1" />
        <span className="text-gray-800 dark:text-gray-200">Vehicle</span>
      </div>
      
      {/* Main container */}
      <div className="flex flex-col h-[calc(100vh-110px)]">
        {/* Blue header with tabs */}
        <div className="bg-blue-500 text-white p-4 rounded-t-lg">
          <h1 className="text-2xl font-bold mb-4">Vehicle</h1>
          
          <div className="flex">
            <button
              onClick={() => setActiveTab('active-vehicle')}
              className={`py-2 px-4 text-center font-medium flex items-center rounded-md ${
                activeTab === 'active-vehicle'
                  ? 'bg-white/20'
                  : 'hover:bg-white/10'
              }`}
            >
              <span className="mr-2 rounded-full bg-green-100 text-green-700 w-6 h-6 flex items-center justify-center text-xs">
                ✓
              </span>
              Active Vehicle
            </button>
            <button
              onClick={() => setActiveTab('inactive-vehicle')}
              className={`py-2 px-4 text-center font-medium flex items-center rounded-md ml-2 ${
                activeTab === 'inactive-vehicle'
                  ? 'bg-white/20'
                  : 'hover:bg-white/10'
              }`}
            >
              <span className="mr-2 rounded-full bg-gray-200 text-gray-700 w-6 h-6 flex items-center justify-center text-xs">
                -
              </span>
              Inactive Vehicle
            </button>
          </div>
        </div>
        
        {/* Search and content area */}
        <div className="flex flex-1 bg-white dark:bg-gray-900 shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Left sidebar for vehicles list */}
          <div className="w-64 border-r border-gray-200 dark:border-gray-800 flex flex-col">
            <div className="p-2 border-b border-gray-200 dark:border-gray-800">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Search" 
                  className="pl-8 h-9 text-sm"
                />
              </div>
              <div className="text-xs text-gray-500 mt-2 px-2">
                {vehicles.length} VEHICLES
              </div>
            </div>
            
            {/* Vehicle list */}
            <div className="overflow-y-auto flex-1">
              {vehicles.map(vehicle => (
                <div 
                  key={vehicle.id}
                  onClick={() => handleSelectVehicle(vehicle.id)}
                  className={`p-3 cursor-pointer border-b border-gray-200 dark:border-gray-800 ${
                    selectedVehicleId === vehicle.id 
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' 
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className="flex mb-1">
                    <div className="w-8 h-8 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full flex items-center justify-center mr-2">
                      <span className="text-xs">🚚</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{vehicle.id}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">LJ 3018 TT</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Right content area with vehicle details */}
          <div className="flex-1 p-4 flex flex-col overflow-hidden">
            {selectedVehicle && (
              <>
                {/* Vehicle header section */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-1">{selectedVehicle.id}</h2>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      Active
                    </span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                      <Printer className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                      <FileText className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                      <Eye className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                
                {/* Vehicle info boxes */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                    <div className="text-sm text-blue-600 dark:text-blue-400 mb-1">Vehicle Number</div>
                    <div className="text-lg font-medium">{selectedVehicle.id}</div>
                  </div>
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                    <div className="text-sm text-yellow-600 dark:text-yellow-400 mb-1">Model</div>
                    <div className="text-lg font-medium">{selectedVehicle.type}</div>
                  </div>
                  <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                    <div className="text-sm text-red-600 dark:text-red-400 mb-1">Segment Type</div>
                    <div className="text-lg font-medium">{selectedVehicle.segment}</div>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                    <div className="text-sm text-purple-600 dark:text-purple-400 mb-1">Make</div>
                    <div className="text-lg font-medium">{selectedVehicle.make}</div>
                  </div>
                </div>
                
                {/* Document sections */}
                <div className="flex-1 overflow-hidden flex flex-col">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-800 dark:text-white">TRUCK KYD DETAILS</h3>
                    <div className="relative">
                      <Input 
                        placeholder="Search..." 
                        className="h-8 w-60 text-sm"
                      />
                      <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  
                  {/* Documents table */}
                  <div className="overflow-auto flex-1">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Document Details</TableHead>
                          <TableHead>Application No.</TableHead>
                          <TableHead>Owner Name</TableHead>
                          <TableHead>Make</TableHead>
                          <TableHead>Validity Date</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {documents.map(doc => (
                          <TableRow key={doc.id}>
                            <TableCell className="font-medium">{doc.documentType}</TableCell>
                            <TableCell>{doc.applicationNo || '-'}</TableCell>
                            <TableCell>{doc.ownerName || 'MANNU LOGISTICS PRIVATE LIMITED'}</TableCell>
                            <TableCell>{doc.make || 'ASHOK LEYLAND LTD'}</TableCell>
                            <TableCell>{doc.validityDate}</TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <button className="text-blue-600 hover:text-blue-800">
                                  <Eye className="h-4 w-4" />
                                </button>
                                <button className="text-green-600 hover:text-green-800">
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button className="text-amber-600 hover:text-amber-800">
                                  <RotateCcw className="h-4 w-4" />
                                </button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  
                  {/* User checklist section */}
                  <div className="mt-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-800 dark:text-white">User Checklist</h3>
                      <div className="relative">
                        <Input 
                          placeholder="Search..." 
                          className="h-8 w-60 text-sm"
                        />
                        <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                    {/* Empty checklist or add checklist items here */}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Floating Add Button */}
      <button className="fixed right-6 bottom-6 w-14 h-14 rounded-full bg-teal-500 hover:bg-teal-600 flex items-center justify-center text-white shadow-lg transition-colors">
        <span className="text-2xl">+</span>
      </button>
    </AppLayout>
  );
}