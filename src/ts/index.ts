import { Product } from "./Product";

const serverUrl = "http://localhost:5000";

function main() {
  listProducts();
}

async function listProducts() {
  try {
    const products = await getProducts();
    let productListElement: string[] = [];

    productListElement = products.map((product) => {
      return `<div class="product">
        <div class="product__image">
          <img src="${product.image}" alt="${product.name}"/>
        </div>
        <h3 class="product__name">
          ${product.name}
        </h3>
        <div class="product__price">
          <p class="product__list-price">${product.price.toLocaleString(
            "pt-BR",
            { style: "currency", currency: "BRL" }
          )}</p>
          <span class="product__installments">até ${
            product.parcelamento[0]
          }x de ${product.parcelamento[1].toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      })}</span>
        </div>
        <button class="product__buybutton" data-product-id="${product.id}">
          COMPRAR
        </button>
      </div>`;
    });

    const shelfWrapper = document.getElementById("shelf-list");
    if (shelfWrapper) {
      shelfWrapper.innerHTML = productListElement.join("");
    }
  } catch (error) {
    console.error("Ocorreu um erro:", error.message);
  }
}

function getProducts(): Promise<Product[]> {
  return fetch(`${serverUrl}/products`)
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
}

document.addEventListener("DOMContentLoaded", main);
