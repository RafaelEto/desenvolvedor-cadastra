export interface Filters {
  colors: string[];
  sizes: string[];
  priceRange: {
    min: number;
    max: number;
  };
}

export interface FilterOption {
  value: string;
  type: string;
}
