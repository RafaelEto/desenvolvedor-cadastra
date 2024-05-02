import { Request, Response } from "express";
import ProductRepository from "../repositories/ProductRepository";

class ProductController {
  async index(request: Request, response: Response) {
    const products = await ProductRepository.findAll();

    response.send(products);
  }
}

export default new ProductController();
