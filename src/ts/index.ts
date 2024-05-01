import { Product } from "./Product";

const serverUrl = "http://localhost:5000";

function main() {
  getProducts();
}

function listProducts(products: Product[]) {
  let productListElement: string[] = [];

  productListElement = products.map((item) => {
    return `<div class="product">
      <div class="product__image">
        <img src="${item.image}" alt="${item.name}"/>
      </div>
      <h3 class="product__name">
        ${item.name}
      </h3>
      <div class="product__price">
        <p class="product__list-price">${item.price.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })}</p>
        <span class="product__installments">até ${
          item.parcelamento[0]
        }x de ${item.parcelamento[1].toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })}</span>
      </div>
      <button class="product__buybutton" data-product-id="${item.id}">
        COMPRAR
      </button>
    </div>`;
  });

  const shelfWrapper = document.getElementById("shelf-list");
  if (shelfWrapper) {
    shelfWrapper.innerHTML = productListElement.join("");
  }
}

function getFilterFromProducts(products: Product[]) {
  let colors = new Set();
  products.map((item) => {
    colors.add(item.color);
  });
  let colorsOrdered: string[] = Array.from(colors).sort();

  let sizes = new Set();
  products.map((item) => {
    item.size.forEach((variacao) => {
      sizes.add(variacao);
    });
  });
  const ordem = [
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

  let sizesOrdered = Array.from(sizes).sort((a: string, b: string) => {
    return ordem.indexOf(a) - ordem.indexOf(b);
  });

  let prices = new Set();
  products.map((item) => {
    prices.add(item.price);
  });
  let pricesOrdered = Array.from(prices).sort();

  mountColorFilter(colorsOrdered);
  mountSizeFilter(sizesOrdered);
}

function mountColorFilter(colors: string[]) {
  let colorsList: string[] = [];

  colorsList = colors.map((item) => {
    return `<div class="filter__item" data-filter-id="${item}">
      <input class="filter__input" type="checkbox" id="${item}" name="${item}" />
      <label class="filter__label"  for="${item}">${item}</label>
    </div>`;
  });

  const colorFilterWrapper = document.getElementById("filter-color");
  if (colorFilterWrapper) {
    colorFilterWrapper.innerHTML = colorsList.join("");
  }
}

function mountSizeFilter(sizes: string[]) {
  let sizesList: string[] = [];

  sizesList = sizes.map((item) => {
    return `<div class="filter__item">
      <input class="filter__input" type="checkbox" id="${item}" name="${item}" />
      <label class="filter__label"  for="${item}">${item}</label>
    </div>`;
  });

  const sizesFilterWrapper = document.getElementById("filter-size");
  if (sizesFilterWrapper) {
    sizesFilterWrapper.innerHTML = sizesList.join("");
  }
}

async function getProducts() {
  const products: Product[] = await fetch(`${serverUrl}/products`)
    .then((response: Response) => {
      if (!response.ok) {
        throw new Error("Ocorreu um erro na requisição!");
      }
      return response.json();
    })
    .catch((error: Error) => {
      console.error("Ocorreu um erro ao buscar os produtos:", error.message);
      throw error;
    });

  listProducts(products);
  getFilterFromProducts(products);
}

document.addEventListener("DOMContentLoaded", main);
