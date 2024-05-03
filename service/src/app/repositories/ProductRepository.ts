import products from "../../products.json";
import { Product } from "../typings/Product";

class ProductRepository {
  public findAll(): Promise<Product[]> {
    return new Promise((resolve, reject) => {
      resolve(products);
    });
  }
}

export default new ProductRepository();
