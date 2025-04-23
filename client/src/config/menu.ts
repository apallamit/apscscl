export interface MenuItem {
  key: string;
  name: string;
  icon?: string;
  link?: string;
  child?: MenuItem[];
  class?: string;
  fontSize?: string;
  badge?: string;
  maticon?: string;
  caption?: string;
  title?: boolean;
  category?: string;
}

// Define the menu structure following the design from attachments
export const menuItems: MenuItem[] = [
  {
    key: 'master',
    name: 'Master',
    icon: 'ios-settings-outline',
  },
  {
    key: 'major',
    name: 'Major',
    icon: 'ios-paper-outline',
  },
  {
    key: 'hr',
    name: 'HR',
    icon: 'ios-people-outline',
  }
];

// Define child menus separately
export const childMenus: Record<string, MenuItem[]> = {
  'master': [
    {
      key: 'locations_setting',
      name: 'LOCATIONS SETTING',
      title: true,
    },
    {
      key: 'good_seeds',
      name: 'Good Seeds',
      link: '/master/good-seeds',
      icon: 'MapPin',
      category: 'master',
    },
    {
      key: 'transit_setting',
      name: 'TRANSIT SETTING',
      title: true,
    },
    {
      key: 'vehicle',
      name: 'Vehicle',
      link: '/master/vehicle',
      icon: 'Truck',
      category: 'master',
    },
    {
      key: 'trolley',
      name: 'Trolley',
      link: '/master/trolley',
      icon: 'Truck',
      category: 'master',
    },
    {
      key: 'route_planner',
      name: 'Route Planner',
      link: '/master/route-planner',
      icon: 'Map',
      category: 'master',
    },
    {
      key: 'trip_rate',
      name: 'Trip Rate',
      link: '/master/trip-rate',
      icon: 'DollarSign',
      category: 'master',
    },
    {
      key: 'fuel_rate',
      name: 'Fuel Rate',
      link: '/master/fuel-rate',
      icon: 'Droplet',
      category: 'master',
    },
    {
      key: 'driver_foreman',
      name: 'Driver/Foreman',
      link: '/master/driver-foreman',
      icon: 'User',
      category: 'master',
    },
    {
      key: 'guarantor',
      name: 'Guarantor',
      link: '/master/guarantor',
      icon: 'Users',
      category: 'master',
    },
    {
      key: 'mechanics',
      name: 'Mechanics',
      link: '/master/mechanics',
      icon: 'Tool',
      category: 'master',
    },
    {
      key: 'cards',
      name: 'Cards',
      link: '/master/cards',
      icon: 'CreditCard',
      category: 'master',
    },
    {
      key: 'business_setting',
      name: 'BUSINESS SETTING',
      title: true,
    },
    {
      key: 'company',
      name: 'Company',
      link: '/master/company',
      icon: 'Building',
      category: 'master',
    },
    {
      key: 'customer',
      name: 'Customer',
      link: '/master/customer',
      icon: 'Users',
      category: 'master',
    }
  ],
  'major': [
    {
      key: 'transportation',
      name: 'TRANSPORTATION',
      title: true,
    },
    {
      key: 'trip_booking',
      name: 'Trip Booking',
      link: '/major/trip-booking',
      icon: 'Bookmark',
      category: 'major',
    },
    {
      key: 'dispatch',
      name: 'Dispatch',
      link: '/major/dispatch',
      icon: 'Send',
      category: 'major',
    }
  ],
  'hr': [
    {
      key: 'employee',
      name: 'EMPLOYEE',
      title: true,
    },
    {
      key: 'attendance',
      name: 'Attendance',
      link: '/hr/attendance',
      icon: 'Calendar',
      category: 'hr',
    },
    {
      key: 'payroll',
      name: 'Payroll',
      link: '/hr/payroll',
      icon: 'DollarSign',
      category: 'hr',
    }
  ]
};