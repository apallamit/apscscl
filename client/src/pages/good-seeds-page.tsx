import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, ChevronRight, Home } from "lucide-react";
import { AppLayout } from "@/components/layout/app-layout";
import { GoodSeedForm } from "@/components/good-seeds/good-seed-form";
import { GoodSeed } from "@/types";
import { GoodSeedList } from "@/components/good-seeds/good-seed-list";
import { GoodSeedDetail } from "@/components/good-seeds/good-seed-detail";
import { useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

export default function GoodSeedsPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSeedId, setSelectedSeedId] = useState<number | null>(null);
  const [editingGoodSeed, setEditingGoodSeed] = useState<GoodSeed | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [googleLoaded, setGoogleLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<'routes-approval' | 'active-routes' | 'inactive-routes'>('active-routes');
  const { toast } = useToast();

  // Query to get all good seeds
  const { data: goodSeeds } = useQuery<GoodSeed[]>({
    queryKey: ['/api/good-seeds'],
    queryFn: async () => {
      const res = await apiRequest('GET', '/api/good-seeds');
      return await res.json();
    },
  });

  // Set the first good seed as selected when data is loaded
  useEffect(() => {
    if (goodSeeds && goodSeeds.length > 0 && !selectedSeedId) {
      setSelectedSeedId(goodSeeds[0].id);
    }
  }, [goodSeeds, selectedSeedId]);

  // Get the selected good seed object
  const selectedSeed = goodSeeds?.find(seed => seed.id === selectedSeedId) || null;

  // Handle adding a new good seed
  const handleAddNew = () => {
    setEditingGoodSeed(null);
    setShowAddModal(true);
  };

  // Handle editing a good seed
  const handleEdit = (goodSeed: GoodSeed) => {
    setEditingGoodSeed(goodSeed);
    setShowAddModal(true);
  };

  // Handle selecting a good seed
  const handleSelectSeed = (goodSeed: GoodSeed) => {
    setSelectedSeedId(goodSeed.id);
  };

  // Handle deleting a good seed
  const handleDelete = (id: number) => {
    setDeletingId(id);
    setDeleteConfirmOpen(true);
  };

  // Confirm deletion of a good seed
  const confirmDelete = async () => {
    if (deletingId) {
      try {
        await apiRequest('DELETE', `/api/good-seeds/${deletingId}`);
        
        // Invalidate the cache to refetch the updated list
        queryClient.invalidateQueries({ queryKey: ['/api/good-seeds'] });
        
        toast({
          title: 'Good Seed Deleted',
          description: 'The good seed has been deleted successfully.',
        });

        // If the deleted seed was selected, clear the selection
        if (deletingId === selectedSeedId) {
          setSelectedSeedId(null);
        }
      } catch (error: any) {
        toast({
          title: 'Error deleting Good Seed',
          description: error.message || 'An error occurred while deleting the good seed.',
          variant: 'destructive',
        });
      } finally {
        setDeleteConfirmOpen(false);
        setDeletingId(null);
      }
    }
  };

  return (
    <AppLayout>
      <div className="mb-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
        <Home className="h-4 w-4 mr-1" />
        <span>Dashboard</span>
        <ChevronRight className="h-4 w-4 mx-1" />
        <span>Master</span>
        <ChevronRight className="h-4 w-4 mx-1" />
        <span className="text-gray-800 dark:text-gray-200">Good Seeds Routes</span>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Good Seeds Routes</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage routes for good seeds transport</p>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="mb-6 bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="flex">
          <button
            onClick={() => setActiveTab('routes-approval')}
            className={`py-3 px-5 text-center font-medium text-gray-600 dark:text-gray-300 flex items-center ${
              activeTab === 'routes-approval'
                ? 'border-b-2 border-primary text-primary dark:text-primary'
                : 'hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            <span className="mr-2 rounded-full bg-gray-200 dark:bg-gray-700 w-6 h-6 flex items-center justify-center text-xs text-gray-700 dark:text-gray-300">
              ✓
            </span>
            Routes Approval
          </button>
          <button
            onClick={() => setActiveTab('active-routes')}
            className={`py-3 px-5 text-center font-medium text-gray-600 dark:text-gray-300 flex items-center ${
              activeTab === 'active-routes'
                ? 'border-b-2 border-primary text-primary dark:text-primary'
                : 'hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            <span className="mr-2 rounded-full bg-green-100 dark:bg-green-900 w-6 h-6 flex items-center justify-center text-xs text-green-700 dark:text-green-300">
              ✓
            </span>
            Active Routes
          </button>
          <button
            onClick={() => setActiveTab('inactive-routes')}
            className={`py-3 px-5 text-center font-medium text-gray-600 dark:text-gray-300 flex items-center ${
              activeTab === 'inactive-routes'
                ? 'border-b-2 border-primary text-primary dark:text-primary'
                : 'hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            <span className="mr-2 rounded-full bg-gray-200 dark:bg-gray-700 w-6 h-6 flex items-center justify-center text-xs text-gray-700 dark:text-gray-300">
              -
            </span>
            InActive Routes
          </button>
        </div>
        
        <div className="p-4">
          <div className="relative max-w-md mb-4">
            <input
              type="text"
              placeholder="Search"
              className="w-full py-2 pl-10 pr-4 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <button className="text-blue-500 hover:text-blue-600 focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            4344 ROUTES
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-7 gap-6 mb-8 h-[calc(100vh-330px)]">
        {/* Left Side - List */}
        <div className="md:col-span-2 bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <GoodSeedList 
            onSelectSeed={handleSelectSeed} 
            selectedSeedId={selectedSeedId} 
          />
        </div>

        {/* Right Side - Details */}
        <div className="md:col-span-5 bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <GoodSeedDetail 
            goodSeed={selectedSeed} 
            onEdit={handleEdit} 
            onDelete={handleDelete}
            googleLoaded={googleLoaded}
          />
        </div>
      </div>

      {/* Floating Add Button */}
      <Button 
        onClick={handleAddNew} 
        className="fixed bottom-6 right-6 rounded-full w-12 h-12 shadow-lg"
        size="icon"
      >
        <Plus className="h-6 w-6" />
      </Button>

      {/* Add/Edit Form */}
      <GoodSeedForm 
        open={showAddModal} 
        onOpenChange={setShowAddModal} 
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this Good Seed route?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the route
              and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
