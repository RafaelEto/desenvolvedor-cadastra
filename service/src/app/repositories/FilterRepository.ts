import ProductRepository from "./ProductRepository";
import { Product } from "../typings/Product";
import { Filters } from "../typings/Filters";

class FilterRepository {
  getColors(products: Product[]) {
    const colorsList = products.map((item) => item.color);
    const colorsRemoveDuplicated = [...new Set(colorsList)];
    const colorsOrdered = colorsRemoveDuplicated.sort();

    return colorsOrdered;
  }

  getSizes(products: Product[]) {
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
    const sizesArray = products.map((item) => item.size);
    const sizesList = sizesArray.reduce((acc, curr) => acc.concat(curr), []);
    const sizesRemoveDuplicated = [...new Set(sizesList)];
    const sizesOrdered = sizesRemoveDuplicated.sort((a: string, b: string) => {
      return order.indexOf(a) - order.indexOf(b);
    });

    return sizesOrdered;
  }

  getPrice(products: Product[]) {
    const prices = products.map((item) => item.price);
    const pricesOrdered = prices.sort();
    const minPrice = Math.min(...pricesOrdered);
    const maxPrice = Math.max(...pricesOrdered);

    return { minPrice, maxPrice };
  }

  public async findAll() {
    const products = await ProductRepository.findAll();

    const colors = this.getColors(products);
    const sizes = this.getSizes(products);
    const { minPrice, maxPrice } = this.getPrice(products);

    const filters: Filters = {
      colors,
      sizes,
      priceRange: {
        min: minPrice,
        max: maxPrice,
      },
    };

    return filters;
  }
}

export default new FilterRepository();
