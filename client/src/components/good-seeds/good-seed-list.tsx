import { useState } from 'react';
import { Search, MapPin, RotateCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { GoodSeed } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Badge } from '@/components/ui/badge';

interface GoodSeedListProps {
  onSelectSeed: (goodSeed: GoodSeed) => void;
  selectedSeedId: number | null;
}

export function GoodSeedList({ onSelectSeed, selectedSeedId }: GoodSeedListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: goodSeeds, isLoading, isError, refetch } = useQuery<GoodSeed[]>({
    queryKey: ['/api/good-seeds'],
    queryFn: async () => {
      const res = await apiRequest('GET', '/api/good-seeds');
      return await res.json();
    },
  });

  // Filter good seeds based on search term
  const filteredSeeds = goodSeeds?.filter(seed => 
    searchTerm === '' || 
    seed.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
    seed.goodName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    seed.routeAddress.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8 h-full">
        <RotateCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center p-8 h-full">
        <p className="text-red-500 mb-2">Error loading locations</p>
        <Button onClick={() => refetch()} variant="outline" size="sm">Retry</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <Input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 py-2 text-sm h-9"
          />
        </div>
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          {filteredSeeds ? `${filteredSeeds.length} ROUTES` : '0 ROUTES'}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {filteredSeeds && filteredSeeds.length > 0 ? (
          <div className="space-y-1 p-1">
            {filteredSeeds.map((seed) => (
              <div
                key={seed.id}
                onClick={() => onSelectSeed(seed)}
                className={`flex items-start p-3 rounded-md cursor-pointer transition-colors ${
                  selectedSeedId === seed.id
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <div className="flex-shrink-0 mr-3">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                    <MapPin className="h-4 w-4" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center">
                    <h4 className="font-medium text-sm truncate">
                      {seed.district} - {seed.goodName}
                    </h4>
                    {selectedSeedId === seed.id && (
                      <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 text-xs">
                        Active
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 truncate mt-1">
                    {seed.routeAddress}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    Route Code: RT-{seed.id}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-8 text-gray-500 dark:text-gray-400">
            <MapPin className="h-12 w-12 mb-4 opacity-50" />
            <p className="text-lg font-medium">No routes found</p>
            <p className="text-sm text-center mt-2">
              {searchTerm ? 'Try a different search term' : 'Add a new route to get started'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}