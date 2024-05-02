import { Request, Response } from "express";
import FilterRepository from "../repositories/FilterRepository";

class FilterController {
  public async index(request: Request, response: Response) {
    const filters = await FilterRepository.findAll();

    response.status(200).send(filters);
  }
}

export default new FilterController();
