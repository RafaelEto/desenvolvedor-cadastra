import products from "../../products.json";
import { Product } from "../ts/Product";

export default class ProductRepository {
  static findAll(): Promise<Product[]> {
    return new Promise((resolve, reject) => {
      resolve(products);
    });
  }
}
