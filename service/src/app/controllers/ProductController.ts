import { Request, Response } from "express";
import ProductRepository from "../repositories/ProductRepository";
import { Product } from "../typings/Product";
import { priceRangeData } from "../utils/products";

enum PriceRange {
  One = 1,
  Two = 2,
  Three = 3,
  Four = 4,
  Five = 5,
}

class ProductController {
  async index(request: Request, response: Response) {
    const products = await ProductRepository.findAll();
    let productsFiltered: Product[] = [];

    const { color, size, priceRange, orderBy, page, limit } = request?.query;
    const pageNumber = parseInt(page as string) || 1;
    const limitPerPage = parseInt(limit as string) || 9;
    const skip = (pageNumber - 1) * limitPerPage;

    const queryDecodeColor = color
      ? (JSON.parse(decodeURIComponent(color as string)) as string[])
      : [];

    const queryDecodeSize = size
      ? (JSON.parse(decodeURIComponent(size as string)) as string[])
      : [];

    const queryDecodePriceRange = priceRange
      ? (JSON.parse(decodeURIComponent(priceRange as string)) as PriceRange[])
      : [];

    const queryDecodeOrderBy = orderBy
      ? (JSON.parse(decodeURIComponent(orderBy as string)) as string)
      : "";

    const queryDecodePage = page
      ? (JSON.parse(decodeURIComponent(page as string)) as string)
      : "1";

    const queryDecodeLimit = limit
      ? (JSON.parse(decodeURIComponent(limit as string)) as string)
      : "9";

    const filterByColor = (products: Product[], colors: string[]) =>
      colors.length > 0
        ? products.filter((item) => colors.includes(item.color))
        : products;

    const filterBySize = (products: Product[], sizes: string[]) =>
      sizes.length > 0
        ? products.filter((item) =>
            item.size.some((size) => sizes.includes(size))
          )
        : products;

    const filterByPriceRange = (
      products: Product[],
      priceRanges: PriceRange[]
    ) => {
      let filteredProducts = products;
      priceRanges.forEach((range) => {
        const rangeData = priceRangeData[range];
        if (rangeData) {
          const { min, max } = rangeData;
          if (max) {
            filteredProducts = filteredProducts.filter(
              (item) => item.price >= min && item.price <= max
            );
          } else {
            filteredProducts = filteredProducts.filter(
              (item) => item.price >= min
            );
          }
        }
      });
      return filteredProducts;
    };

    const applyFilters = (
      products: Product[],
      colors: string[],
      sizes: string[],
      priceRanges: PriceRange[]
    ) => {
      let filteredProducts = filterByColor(products, colors);
      filteredProducts = filterBySize(filteredProducts, sizes);
      filteredProducts = filterByPriceRange(filteredProducts, priceRanges);
      return filteredProducts;
    };

    productsFiltered = applyFilters(
      products,
      queryDecodeColor,
      queryDecodeSize,
      queryDecodePriceRange
    );

    if (queryDecodeOrderBy == "asc") {
      productsFiltered.sort((a, b) => a.price - b.price);
    } else if (queryDecodeOrderBy == "desc") {
      productsFiltered.sort((a, b) => b.price - a.price);
    } else if (queryDecodeOrderBy == "newer") {
      productsFiltered.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    }

    let paginatedProducts: Product[] = [];

    if (page && limit) {
      paginatedProducts = productsFiltered.slice(skip, skip + limitPerPage);
    } else {
      paginatedProducts = productsFiltered;
    }

    response.send(paginatedProducts);
  }
}

export default new ProductController();
