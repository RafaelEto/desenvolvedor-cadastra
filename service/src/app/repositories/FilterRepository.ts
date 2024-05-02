import ProductRepository from "./ProductRepository";
import { Product } from "../ts/Product";
import { Filters } from "../ts/Filters";

export default class FilterRepository {
  static async findAll() {
    const products: Product[] = await ProductRepository.findAll();

    let colorsArray: Set<string> = new Set();
    products.map((item: Product) => {
      colorsArray.add(item.color);
    });
    let colorsOrdered: string[] = Array.from(colorsArray).sort();

    let sizesArray: Set<string> = new Set();
    products.map((item: Product) => {
      item.size.forEach((variacao) => {
        sizesArray.add(variacao);
      });
    });
    const order = [
      "PP",
      "P",
      "M",
      "G",
      "GG",
      "XG",
      "U",
      "36",
      "38",
      "40",
      "42",
      "44",
      "46",
    ];

    let sizesOrdered: string[] = Array.from(sizesArray).sort(
      (a: string, b: string) => {
        return order.indexOf(a) - order.indexOf(b);
      }
    );

    let prices: Set<number> = new Set();
    products.map((item: Product) => {
      prices.add(item.price);
    });
    let pricesOrdered: number[] = Array.from(prices).sort();
    let minPrice = Math.min(...pricesOrdered);
    let maxPrice = Math.max(...pricesOrdered);

    const filters: Filters = {
      colors: colorsOrdered,
      sizes: sizesOrdered,
      priceRange: {
        min: minPrice,
        max: maxPrice,
      },
    };

    return new Promise((resolve, reject) => {
      resolve(filters);
    });
  }
}
