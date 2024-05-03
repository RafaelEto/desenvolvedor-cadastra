import { Product } from "./Product";

export interface Minicart {
  id: string;
  quantity: number;
}

export interface MinicartProduct extends Product {
  quantity: number;
}
