export interface Filters {
  colors: string[];
  sizes: string[];
  priceRange: {
    min: number;
    max: number;
  };
}
