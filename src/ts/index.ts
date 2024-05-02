import { Product } from "../typings/Product";
import { Filters } from "../typings/Filters";
import { MinicartProducts } from "../typings/Minicart";

const serverUrl = "http://localhost:5001";

function main() {
  getProducts();
  getFilters();
  updateMinicartQuantity();
  openMinicart();
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

  buyProduct();
}

function mountColorFilter(colors: string[]) {
  let colorsList: string[] = [];

  colorsList = colors.map((item) => {
    return `<div class="filter__item">
      <input class="filter__input" type="checkbox" id="${item}" name="${item}" data-filter-type="color" />
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
      <input class="filter__input" type="checkbox" id="${item}" name="${item}" data-filter-type="size"/>
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
}

async function getFilters() {
  const filters: Filters = await fetch(`${serverUrl}/filters`)
    .then((response: Response) => {
      if (!response.ok) {
        throw new Error("Ocorreu um erro na requisição!");
      }
      return response.json();
    })
    .catch((error: Error) => {
      console.error("Ocorreu um erro ao buscar os filtros:", error.message);
      throw error;
    });

  mountColorFilter(filters.colors);
  mountSizeFilter(filters.sizes);
  filterProducts();
}

function filterProducts() {
  const inputs = document.querySelectorAll<HTMLInputElement>(".filter__input");
  let clickedInputs: { value: string; type: string }[] = [];

  inputs.forEach((input) => {
    input.addEventListener("click", function (e) {
      const name = input.getAttribute("name");
      const type = input.getAttribute("data-filter-type");

      if (!name || !type) return;

      const index = clickedInputs.findIndex(
        (item) => item.value === name && item.type === type
      );

      if (index !== -1) {
        clickedInputs.splice(index, 1);
      } else {
        clickedInputs.push({ value: name, type });
      }

      const url = new URL(`${serverUrl}/products`);
      const params = new URLSearchParams();

      const colors = clickedInputs
        .filter((item) => item.type === "color")
        .map((item) => item.value);
      const sizes = clickedInputs
        .filter((item) => item.type === "size")
        .map((item) => item.value);

      params.append("color", encodeURIComponent(JSON.stringify(colors)));
      params.append("size", encodeURIComponent(JSON.stringify(sizes)));

      fetch(`${url}?${params}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          listProducts(data);
        })
        .catch((error) => {
          // Manipula erros
          console.error("Erro:", error);
        });
    });
  });
}

function buyProduct() {
  const buyButtons = document.querySelectorAll<HTMLButtonElement>(
    ".product__buybutton"
  );

  buyButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      const productId = button.getAttribute("data-product-id");

      const productSendToMinicart: MinicartProducts = {
        id: productId,
        quantity: 1,
      };

      sendToMinicart(productSendToMinicart);
    });
  });
}

function sendToMinicart(product: MinicartProducts) {
  const minicartProducts: MinicartProducts[] =
    JSON.parse(localStorage.getItem("carrinho")) || [];

  const productIsOnMinicart = minicartProducts.find(
    (item) => item.id === product.id
  );

  if (productIsOnMinicart) {
    productIsOnMinicart.quantity += 1;
  } else {
    minicartProducts.push(product);
  }

  localStorage.setItem("carrinho", JSON.stringify(minicartProducts));
  updateMinicartQuantity();
}

function updateMinicartQuantity() {
  const minicartProducts: MinicartProducts[] =
    JSON.parse(localStorage.getItem("carrinho")) || [];

  const minicartQuantityArray = minicartProducts.map((item) => item.quantity);
  const minicartTotal = minicartQuantityArray.reduce((acc, cur) => acc + cur);

  const minicartCountIcon = document.querySelector(".header__minicart--count");

  if (minicartCountIcon) {
    minicartCountIcon.textContent = minicartTotal.toString();
  }
}

function openMinicart() {
  const minicartIcon =
    document.querySelector<HTMLButtonElement>(".header__minicart");

  minicartIcon.addEventListener("click", function (e) {
    const minicartWrapper = document.querySelector(".minicart__wrapper");
    const minicartShadow = document.querySelector(".minicart__shadow");

    console.log(minicartWrapper);

    minicartWrapper.classList.add("open");
    minicartShadow.classList.add("open");
  });
}

document.addEventListener("DOMContentLoaded", main);
