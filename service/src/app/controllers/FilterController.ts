import { Request, Response } from "express";
import FilterRepository from "../repositories/FilterRepository";

class FilterController {
  public async index(request: Request, response: Response) {
    const products = await FilterRepository.findAll();

    return products;
  }
}

export default new FilterController();
