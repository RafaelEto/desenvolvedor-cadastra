import { Request, Response } from "express";
import ProductRepository from "../repositories/ProductRepository";
import { Product } from "../typings/Product";

class ProductController {
  async index(request: Request, response: Response) {
    const products = await ProductRepository.findAll();
    let productsList = products;
    let productsFiltered: Product[] = [];

    const { color, size } = request?.query;

    if (color && size) {
      const queryDecodeColor = JSON.parse(
        decodeURIComponent(color as string)
      ) as string[];
      const queryDecodeSize = JSON.parse(
        decodeURIComponent(size as string)
      ) as string[];

      if (queryDecodeColor.length > 0 && queryDecodeSize.length == 0) {
        productsFiltered = products.filter((item) =>
          queryDecodeColor.includes(item.color)
        );
      } else if (queryDecodeColor.length == 0 && queryDecodeSize.length > 0) {
        productsFiltered = products.filter((item) =>
          item.size.some((size) => queryDecodeSize.includes(size))
        );
      } else if (queryDecodeColor.length > 0 && queryDecodeSize.length > 0) {
        productsFiltered = products.filter(
          (item) =>
            queryDecodeColor.includes(item.color) &&
            item.size.some((size) => queryDecodeSize.includes(size))
        );
      }

      if (queryDecodeColor.length > 0 || queryDecodeSize.length > 0) {
        productsList = productsFiltered;
      } else {
        productsList = products;
      }
    }

    response.send(productsList);
  }
}

export default new ProductController();
