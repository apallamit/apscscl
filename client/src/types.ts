export interface GoodSeed {
  id: number;
  district: string;
  transportType: string;
  goodName: string;
  routeAddress: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  latitude: number;
  longitude: number;
  createdAt?: string;
}

export interface RouteInfo {
  id: number;
  source: string;
  sourceLocation: string;
  destination: string;
  destinationLocation: string;
  kilometers: number;
}

export interface StatCard {
  title: string;
  value: number;
  icon: string;
  gradient: string;
}

export interface ChartData {
  date: string;
  value: number;
}

export interface RouteAddress {
  street: string;
  city: string;
  state: string;
  pincode: string;
  latitude: number;
  longitude: number;
  formattedAddress: string;
}

export interface MenuItem {
  label: string;
  icon: string;
  path?: string;
  items?: MenuItem[];
  section?: string;
}

export interface AddressResult {
  street: string;
  city: string;
  state: string;
  pincode: string;
  latitude: number;
  longitude: number;
  fullAddress: string;
}
