import { Edit, Trash2, MapPin, TruckIcon, Package, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GoodSeed } from '@/types';
import { MapPreview } from './map-preview';
import { Badge } from '@/components/ui/badge';
import { formatNumber } from '@/lib/utils';

interface GoodSeedDetailProps {
  goodSeed: GoodSeed | null;
  onEdit: (goodSeed: GoodSeed) => void;
  onDelete: (id: number) => void;
  googleLoaded: boolean;
}

export function GoodSeedDetail({ goodSeed, onEdit, onDelete, googleLoaded }: GoodSeedDetailProps) {
  if (!goodSeed) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-gray-500 dark:text-gray-400">
        <MapPin className="h-12 w-12 mb-4 opacity-50" />
        <p className="text-lg font-medium">Select a location to view details</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header with title and actions */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div>
          <h2 className="text-xl font-semibold">{goodSeed.district} - {goodSeed.goodName}</h2>
          <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">
            Active
          </Badge>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(goodSeed)}
            className="text-blue-600 hover:text-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/20"
          >
            <Edit className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(goodSeed.id)}
            className="text-red-600 hover:text-red-800 hover:bg-red-100 dark:hover:bg-red-900/20"
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {/* Map */}
        <div className="h-64 w-full">
          <MapPreview
            lat={goodSeed.latitude}
            lng={goodSeed.longitude}
            googleLoaded={googleLoaded}
          />
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-4 p-4">
          <div className="col-span-2 sm:col-span-1">
            <h3 className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              <MapPin className="h-4 w-4 mr-1" />
              Route Details
            </h3>
            <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-md">
              <div className="mb-2">
                <span className="block text-sm text-gray-500 dark:text-gray-400">Route Code</span>
                <span className="font-medium">RT-{formatNumber(goodSeed.id)}</span>
              </div>
              <div>
                <span className="block text-sm text-gray-500 dark:text-gray-400">Full Address</span>
                <span className="font-medium">{goodSeed.routeAddress}</span>
              </div>
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <h3 className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              <TruckIcon className="h-4 w-4 mr-1" />
              Transport Information
            </h3>
            <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-md">
              <div className="mb-2">
                <span className="block text-sm text-gray-500 dark:text-gray-400">Transport Type</span>
                <span className="font-medium">{goodSeed.transportType}</span>
              </div>
              <div>
                <span className="block text-sm text-gray-500 dark:text-gray-400">KMS</span>
                <span className="font-medium">{formatNumber(Math.floor(Math.random() * 1000) + 100)}</span>
              </div>
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <h3 className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              <Package className="h-4 w-4 mr-1" />
              Good Details
            </h3>
            <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-md">
              <div className="mb-2">
                <span className="block text-sm text-gray-500 dark:text-gray-400">Good Name</span>
                <span className="font-medium">{goodSeed.goodName}</span>
              </div>
              <div>
                <span className="block text-sm text-gray-500 dark:text-gray-400">Category</span>
                <span className="font-medium">Essential Commodities</span>
              </div>
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <h3 className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              <Building className="h-4 w-4 mr-1" />
              Location Details
            </h3>
            <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-md">
              <div className="mb-2">
                <span className="block text-sm text-gray-500 dark:text-gray-400">City</span>
                <span className="font-medium">{goodSeed.city}</span>
              </div>
              <div className="mb-2">
                <span className="block text-sm text-gray-500 dark:text-gray-400">State</span>
                <span className="font-medium">{goodSeed.state}</span>
              </div>
              <div>
                <span className="block text-sm text-gray-500 dark:text-gray-400">Pincode</span>
                <span className="font-medium">{goodSeed.pincode}</span>
              </div>
            </div>
          </div>

          <div className="col-span-2">
            <h3 className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              <MapPin className="h-4 w-4 mr-1" />
              GPS Coordinates
            </h3>
            <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-md">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="block text-sm text-gray-500 dark:text-gray-400">Latitude</span>
                  <span className="font-medium">{goodSeed.latitude}</span>
                </div>
                <div>
                  <span className="block text-sm text-gray-500 dark:text-gray-400">Longitude</span>
                  <span className="font-medium">{goodSeed.longitude}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}