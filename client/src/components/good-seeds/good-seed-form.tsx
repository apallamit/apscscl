import { useState, useEffect, useRef } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { transportTypes, loadGoogleMapsAPI } from '@/lib/utils';
import { MapPreview } from '@/components/good-seeds/map-preview';
import { AddressResult } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from "@/lib/queryClient";

// Schema for the form
const goodSeedSchema = z.object({
  district: z.string().min(1, { message: 'District is required' }),
  transportType: z.string().min(1, { message: 'Transport type is required' }),
  goodName: z.string().min(1, { message: 'Good name is required' }),
  routeAddress: z.string().min(1, { message: 'Route address is required' }),
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

type GoodSeedFormValues = z.infer<typeof goodSeedSchema>;

interface GoodSeedFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GoodSeedForm({ open, onOpenChange }: GoodSeedFormProps) {
  const [googleLoaded, setGoogleLoaded] = useState(false);
  const [autocomplete, setAutocomplete] = useState<any>(null);
  const addressInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const form = useForm<GoodSeedFormValues>({
    resolver: zodResolver(goodSeedSchema),
    defaultValues: {
      district: '',
      transportType: 'truck',
      goodName: '',
      routeAddress: '',
      street: '',
      city: '',
      state: '',
      pincode: '',
      latitude: undefined,
      longitude: undefined,
    },
  });

  // Load Google Maps API
  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY';
    
    if (open && !googleLoaded) {
      loadGoogleMapsAPI(apiKey)
        .then(() => {
          setGoogleLoaded(true);
        })
        .catch((error) => {
          toast({
            title: 'Error loading Google Maps',
            description: error.message,
            variant: 'destructive',
          });
        });
    }
  }, [open, googleLoaded, toast]);

  // Setup autocomplete when Google Maps API is loaded
  useEffect(() => {
    if (googleLoaded && addressInputRef.current && !autocomplete) {
      const options = {
        types: ['geocode', 'establishment'],
      };
      
      try {
        const autoCompleteInstance = window.google?.maps?.places 
          ? new window.google.maps.places.Autocomplete(
              addressInputRef.current,
              options
            )
          : null;
        
        if (autoCompleteInstance) {
          autoCompleteInstance.addListener('place_changed', () => {
            const place = autoCompleteInstance.getPlace();
            
            if (!place.geometry) {
              toast({
                title: 'No details available for this place',
                description: 'Please select a place from the dropdown',
                variant: 'destructive',
              });
              return;
            }
            
            // Get address components
            let street = '';
            let city = '';
            let state = '';
            let pincode = '';
            
            place.address_components?.forEach((component: any) => {
              const types = component.types;
              
              if (types.includes('street_number')) {
                street = component.long_name;
              } else if (types.includes('route')) {
                street = street ? `${street} ${component.long_name}` : component.long_name;
              } else if (types.includes('locality')) {
                city = component.long_name;
              } else if (types.includes('administrative_area_level_1')) {
                state = component.long_name;
              } else if (types.includes('postal_code')) {
                pincode = component.long_name;
              }
            });
            
            // Update form values
            form.setValue('routeAddress', place.formatted_address || '');
            form.setValue('street', street);
            form.setValue('city', city);
            form.setValue('state', state);
            form.setValue('pincode', pincode);
            form.setValue('latitude', place.geometry?.location?.lat() || 0);
            form.setValue('longitude', place.geometry?.location?.lng() || 0);
          });
          
          setAutocomplete(autoCompleteInstance);
        }
      } catch (error) {
        console.error('Error initializing Google Places Autocomplete:', error);
      }
    }
  }, [googleLoaded, form, toast]);

  const onSubmit = async (values: GoodSeedFormValues) => {
    try {
      console.log('Form submission payload:', values);
      
      // In a real application, you would send this data to your API
      const res = await apiRequest('POST', '/api/good-seeds', values);
      const data = await res.json();
      
      // Invalidate the cache to refetch the updated list
      queryClient.invalidateQueries({ queryKey: ['/api/good-seeds'] });
      
      toast({
        title: 'Good Seed Added',
        description: 'The good seed has been added successfully.',
      });
      
      // Reset form and close dialog
      form.reset();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: 'Error adding Good Seed',
        description: error.message || 'An error occurred while adding the good seed.',
        variant: 'destructive',
      });
    }
  };

  const handleReset = () => {
    form.reset();
    // Clear the map by resetting coordinates
    form.setValue('latitude', undefined);
    form.setValue('longitude', undefined);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle>Add New Good Seed</DialogTitle>
          <DialogDescription>
            Fill in the details to add a new good seed location.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-6">
              <FormField
                control={form.control}
                name="district"
                render={({ field }) => (
                  <FormItem className="sm:col-span-3">
                    <FormLabel>District</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter district" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="transportType"
                render={({ field }) => (
                  <FormItem className="sm:col-span-3">
                    <FormLabel>Transport Type</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a transport type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {transportTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="goodName"
                render={({ field }) => (
                  <FormItem className="sm:col-span-6">
                    <FormLabel>Good Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter good name" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="routeAddress"
                render={({ field }) => (
                  <FormItem className="sm:col-span-6">
                    <FormLabel>Route Address</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Begin typing to search for an address..." 
                        {...field} 
                        ref={addressInputRef}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="street"
                render={({ field }) => (
                  <FormItem className="sm:col-span-3">
                    <FormLabel>Street</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Street" 
                        {...field} 
                        readOnly 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem className="sm:col-span-3">
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="City" 
                        {...field} 
                        readOnly 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="State" 
                        {...field} 
                        readOnly 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="pincode"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Pincode</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Pincode" 
                        {...field} 
                        readOnly 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="latitude"
                render={({ field }) => (
                  <FormItem className="sm:col-span-1">
                    <FormLabel>Latitude</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="0.000000" 
                        value={field.value?.toString() || ''} 
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        readOnly 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="longitude"
                render={({ field }) => (
                  <FormItem className="sm:col-span-1">
                    <FormLabel>Longitude</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="0.000000" 
                        value={field.value?.toString() || ''} 
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        readOnly 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="sm:col-span-6">
                <FormLabel className="block mb-2">Map Preview</FormLabel>
                <MapPreview 
                  lat={form.watch('latitude')} 
                  lng={form.watch('longitude')} 
                  googleLoaded={googleLoaded}
                />
              </div>
            </div>
            
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
              >
                Reset
              </Button>
              
              <Button type="submit">Submit</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
