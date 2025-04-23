import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat().format(value);
}

export function getInitials(name: string): string {
  if (!name) return "";
  
  const parts = name.split(' ');
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export const transportTypes = [
  { value: "truck", label: "Truck" },
  { value: "train", label: "Train" },
  { value: "ship", label: "Ship" },
  { value: "air", label: "Air" }
];

// Function to load Google Maps API script
let googleMapsPromise: Promise<void> | null = null;

export function loadGoogleMapsAPI(apiKey: string): Promise<void> {
  if (googleMapsPromise) return googleMapsPromise;

  googleMapsPromise = new Promise<void>((resolve, reject) => {
    // If the API is already loaded, resolve immediately
    if (window.google && window.google.maps) {
      resolve();
      return;
    }

    // Create a callback function to be called when the API is loaded
    const callbackName = `googleMapsCallback_${Date.now()}`;
    window[callbackName] = () => {
      resolve();
      delete window[callbackName];
    };

    // Create script element
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=${callbackName}`;
    script.async = true;
    script.defer = true;
    script.onerror = (error) => {
      reject(new Error(`Failed to load Google Maps API: ${error}`));
    };

    // Add script to the document
    document.head.appendChild(script);
  });

  return googleMapsPromise;
}
