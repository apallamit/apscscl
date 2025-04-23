declare interface Window {
  google?: {
    maps?: {
      Map?: any;
      MapTypeId?: {
        ROADMAP: string;
        SATELLITE: string;
        HYBRID: string;
        TERRAIN: string;
      };
      Marker?: any;
      LatLng?: any;
      Polygon?: any;
      places?: {
        Autocomplete?: any;
        AutocompleteService?: any;
        PlacesService?: any;
      };
      Animation?: {
        DROP: number;
        BOUNCE: number;
      };
    };
  };
}