import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, RotateCw } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { GoodSeed } from '@/types';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

// Sample data in case API is not connected
const dummyGoodSeeds: GoodSeed[] = [
  {
    id: 1,
    district: 'Hyderabad',
    transportType: 'Truck',
    goodName: 'Rice',
    routeAddress: '123 Main St, Hyderabad',
    street: '123 Main St',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500001',
    latitude: 17.385044,
    longitude: 78.486671,
  },
  {
    id: 2,
    district: 'Bangalore',
    transportType: 'Train',
    goodName: 'Wheat',
    routeAddress: '456 Park Ave, Bangalore',
    street: '456 Park Ave',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560001',
    latitude: 12.971599,
    longitude: 77.594563,
  },
];

interface GoodSeedsTableProps {
  onEdit: (goodSeed: GoodSeed) => void;
}

export function GoodSeedsTable({ onEdit }: GoodSeedsTableProps) {
  const { toast } = useToast();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const { data: goodSeeds, isLoading, isError, refetch } = useQuery<GoodSeed[]>({
    queryKey: ['/api/good-seeds'],
    queryFn: async () => {
      try {
        // In a real application, this would be fetched from an API
        const res = await apiRequest('GET', '/api/good-seeds');
        return await res.json();
      } catch (error) {
        // Fallback to dummy data
        console.error('Error fetching good seeds:', error);
        return dummyGoodSeeds;
      }
    },
  });

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    setDeleteConfirmOpen(true);
  };

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RotateCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <p className="text-red-500">Error loading good seeds</p>
        <Button onClick={() => refetch()}>Retry</Button>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>District</TableHead>
              <TableHead>Transport Type</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Pincode</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {goodSeeds && goodSeeds.length > 0 ? (
              goodSeeds.map((goodSeed) => (
                <TableRow key={goodSeed.id}>
                  <TableCell className="font-medium">{goodSeed.goodName}</TableCell>
                  <TableCell>{goodSeed.district}</TableCell>
                  <TableCell>{goodSeed.transportType}</TableCell>
                  <TableCell className="max-w-xs truncate">{goodSeed.routeAddress}</TableCell>
                  <TableCell>{goodSeed.pincode}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(goodSeed)}
                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(goodSeed.id)}
                        className="text-red-600 hover:text-red-800 hover:bg-red-100"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                  No good seeds found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this Good Seed?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the good seed
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
    </>
  );
}
