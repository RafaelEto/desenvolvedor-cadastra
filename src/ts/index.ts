import { Product } from "../typings/Product";
import { FilterOption, Filters } from "../typings/Filters";
import { Minicart, MinicartProduct } from "../typings/Minicart";
import { cli } from "webpack";

const serverUrl = "http://localhost:5001";

function main() {
  loadMoreProducts();
  getProductsFiltered(clickedInputs);
  listFilteredProducts();
  listMinicartProducts();
  mountFilter().then(filterProducts);
  orderProducts();
  updateMinicartQuantity();
  openMinicart();
  closeMinicart();
  selectPriceRange();

  if (isMobile()) {
    toggleFilters();
    openActionsMobile();
    closeActionsMobile();
    orderProductsMobile();
  }
}

async function listFilteredProducts() {
  const products = await getProductsFiltered(clickedInputs);
  mountProducts(products);
}

async function mountProducts(products: Product[]) {
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

  const loadMorebutton = document.querySelector(".shelf__load");

  if (productListElement.length == 0) {
    productListElement = [
      "<p class='shelf__empty'>Nenhum produto encontrado!</p>",
    ];

    loadMorebutton.classList.add("hide");
  } else {
    loadMorebutton.classList.remove("hide");
  }

  const shelfWrapper = document.getElementById("shelf-list");
  if (shelfWrapper) {
    shelfWrapper.innerHTML = productListElement.join("");
  }

  buyProduct();
}

async function mountFilter() {
  await mountColorFilter();
  await mountSizeFilter();
}

async function mountColorFilter() {
  const filters = await getFilters();
  let colorsList: string[] = [];

  colorsList = filters.colors.map((item) => {
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

async function mountSizeFilter() {
  const filters = await getFilters();
  let sizesList: string[] = [];

  sizesList = filters.sizes.map((item) => {
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

  return products;
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

  return filters;
}

function selectPriceRange() {
  const filterPrices = document.querySelector("#filter-price");
  const inputPrices = filterPrices.querySelectorAll(".filter__item");

  inputPrices.forEach((button) => {
    button.addEventListener("click", function (e) {
      const inputSiblings = Array.from(
        filterPrices.querySelectorAll(".filter__item")
      ).filter((element) => element !== button);

      inputSiblings.forEach((sibling) => {
        sibling.classList.toggle("disabled");
      });
    });
  });
}

let clickedInputs: FilterOption[] = [];
function filterProducts() {
  const inputs = document.querySelectorAll<HTMLInputElement>(".filter__input");

  inputs.forEach((input) => {
    input.addEventListener("click", async function () {
      resetPagination();
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

      const productsFiltered = await getProductsFiltered(clickedInputs);
      mountProducts(productsFiltered);
    });
  });
}

function orderProducts() {
  const select: HTMLSelectElement | null = document.querySelector("#orderby");

  if (select) {
    select.addEventListener("change", async function () {
      resetPagination();

      const selectValue = select.value;

      const selectOrderObj = {
        value: selectValue,
        type: "order",
      };

      const orderIndex = clickedInputs.findIndex(
        (item) => item.type === "order"
      );

      if (orderIndex !== -1) {
        clickedInputs.splice(orderIndex, 1, selectOrderObj);
      } else {
        clickedInputs.push(selectOrderObj);
      }

      const productsFiltered = await getProductsFiltered(clickedInputs);

      mountProducts(productsFiltered);
    });
  }
}

function orderProductsMobile() {
  const orderButtons = document.querySelectorAll<HTMLInputElement>(
    ".category__orderby-mobile--button"
  );

  orderButtons.forEach((button) => {
    button.addEventListener("click", async function () {
      resetPagination();

      const buttonClickedValue = button.getAttribute("data-order-value");

      const buttonOrderObj = {
        value: buttonClickedValue,
        type: "order",
      };

      const orderIndex = clickedInputs.findIndex(
        (item) => item.type === "order"
      );

      if (orderIndex !== -1) {
        clickedInputs.splice(orderIndex, 1, buttonOrderObj);
      } else {
        clickedInputs.push(buttonOrderObj);
      }

      const productsFiltered = await getProductsFiltered(clickedInputs);

      mountProducts(productsFiltered);

      const orderWrapper = document.querySelector(
        ".category__orderby-mobile--wrapper"
      );

      orderWrapper.classList.remove("open");
    });
  });
}

function resetPagination() {
  const pageIndex = clickedInputs.findIndex((item) => item.type === "page");

  if (pageIndex !== -1) {
    clickedInputs[pageIndex].value = "1";
  } else {
    clickedInputs.push({
      value: "1",
      type: "page",
    });
  }
}

async function loadMoreProducts() {
  const loadMoreButton = document.querySelector(".shelf__load--button");

  loadMoreButton.addEventListener("click", async function () {
    const pageIndex = clickedInputs.findIndex((item) => item.type === "page");

    let nextPage;
    if (pageIndex !== -1) {
      nextPage = parseInt(clickedInputs[pageIndex].value, 10) + 1;
      clickedInputs[pageIndex].value = nextPage.toString();
    } else {
      nextPage = 2;
      clickedInputs.push({
        value: nextPage.toString(),
        type: "page",
      });
    }

    const paginatedProducts = await getProductsFiltered(clickedInputs);

    if (paginatedProducts.length == 0) {
      loadMoreButton.parentElement.classList.add("hide");
    }

    renderProducts(paginatedProducts);
  });
}

async function getProductsFiltered(parameters: FilterOption[]) {
  const url = new URL(`${serverUrl}/products`);
  const params = new URLSearchParams();
  let limit = 9;

  if (isMobile()) limit = 4;

  const colors = parameters
    .filter((item) => item.type === "color")
    .map((item) => item.value);
  const sizes = parameters
    .filter((item) => item.type === "size")
    .map((item) => item.value);
  const pricesRange = parameters
    .filter((item) => item.type === "price")
    .map((item) => item.value);
  const orderBy = parameters
    .filter((item) => item.type === "order")
    .map((item) => item.value);
  let page = parameters
    .filter((item) => item.type === "page")
    .map((item) => item.value);

  if (page.length === 0) {
    page = ["1"];
  }

  if (colors.length > 0) {
    params.append("color", encodeURIComponent(JSON.stringify(colors)));
  }
  if (sizes.length > 0) {
    params.append("size", encodeURIComponent(JSON.stringify(sizes)));
  }
  if (pricesRange.length > 0) {
    params.append(
      "priceRange",
      encodeURIComponent(JSON.stringify(pricesRange))
    );
  }
  if (orderBy.length > 0) {
    params.append("orderBy", encodeURIComponent(JSON.stringify(orderBy)));
  }

  const productsFiltered = fetch(
    `${url}?${params}&page=${page}&limit=${limit}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error("Erro:", error);
    });

  return productsFiltered;
}

function toggleFilters() {
  const filterTitles = document.querySelectorAll(".filter__title");

  filterTitles.forEach((button) => {
    button.addEventListener("click", function (e) {
      const filterNextSibling = button.nextElementSibling;
      if (filterNextSibling instanceof HTMLElement) {
        button.classList.toggle("open");
        filterNextSibling.classList.toggle("open");

        if (filterNextSibling.style.maxHeight) {
          filterNextSibling.style.maxHeight = null;
        } else {
          const height = filterNextSibling.scrollHeight + "px";
          filterNextSibling.style.maxHeight = height;
        }
      }
    });
  });
}

function openActionsMobile() {
  const filterButton = document.querySelector<HTMLButtonElement>(
    ".category__open-filter"
  );
  const orderButton = document.querySelector<HTMLButtonElement>(
    ".category__open-orderby"
  );

  filterButton.addEventListener("click", function (e) {
    const filterWrapper = document.querySelector(".filter__wrapper");

    filterWrapper.classList.add("open");
  });

  orderButton.addEventListener("click", function (e) {
    const orderWrapper = document.querySelector(
      ".category__orderby-mobile--wrapper"
    );

    orderWrapper.classList.add("open");
  });
}

function closeActionsMobile() {
  const filterCloseButton = document.querySelector(".filter__close");
  const orderCloseButton = document.querySelector(
    ".category__orderby-mobile--close"
  );

  filterCloseButton.addEventListener("click", function (e) {
    const filterWrapper = document.querySelector(".filter__wrapper");

    filterWrapper.classList.remove("open");
  });

  orderCloseButton.addEventListener("click", function (e) {
    const orderWrapper = document.querySelector(
      ".category__orderby-mobile--wrapper"
    );

    orderWrapper.classList.remove("open");
  });
}

function buyProduct() {
  const buyButtons = document.querySelectorAll<HTMLButtonElement>(
    ".product__buybutton"
  );

  buyButtons.forEach((button) => {
    button.removeEventListener("click", handleBuyButtonClick);
  });

  buyButtons.forEach((button) => {
    button.addEventListener("click", handleBuyButtonClick);
  });
}

function handleBuyButtonClick(event: MouseEvent) {
  const button = event.currentTarget as HTMLButtonElement;
  const productId = button.getAttribute("data-product-id");

  const productSendToMinicart: Minicart = {
    id: productId,
    quantity: 1,
  };

  sendToMinicart(productSendToMinicart);
}

function sendToMinicart(product: Minicart) {
  const minicartProducts: Minicart[] =
    JSON.parse(localStorage.getItem("carrinho")) || [];

  const existingProductIndex = minicartProducts.findIndex(
    (item) => item.id === product.id
  );

  if (existingProductIndex !== -1) {
    minicartProducts[existingProductIndex].quantity += 1;
  } else {
    minicartProducts.push(product);
  }

  localStorage.setItem("carrinho", JSON.stringify(minicartProducts));

  updateMinicartQuantity();
  showBuyProductToast();
  listMinicartProducts();
}

function updateMinicartQuantity() {
  const minicartProducts: Minicart[] =
    JSON.parse(localStorage.getItem("carrinho")) || [];

  const minicartQuantityArray = minicartProducts?.map((item) => item?.quantity);
  const minicartTotal = minicartQuantityArray.reduce(
    (acc, cur) => acc + cur,
    0
  );

  const minicartCountIcon = document.querySelector(".header__minicart--count");

  if (minicartCountIcon) {
    minicartCountIcon.textContent = minicartTotal.toString();
  }
}

function showBuyProductToast() {
  const toastWrapper = document.querySelector(".toast");
  toastWrapper.classList.add("visible");

  setInterval(function () {
    toastWrapper.classList.remove("visible");
  }, 2500);
}

function openMinicart() {
  const minicartIcon =
    document.querySelector<HTMLButtonElement>(".header__minicart");

  minicartIcon.addEventListener("click", function (e) {
    const minicartWrapper = document.querySelector(".minicart__wrapper");
    const minicartShadow = document.querySelector(".minicart__shadow");

    minicartWrapper.classList.add("open");
    minicartShadow.classList.add("open");
  });
}

function closeMinicart() {
  const minicartWrapper = document.querySelector(".minicart__wrapper");
  const minicartShadow = document.querySelector(".minicart__shadow");

  const minicartCloseButton =
    document.querySelector<HTMLButtonElement>(".minicart__close");
  const minicartCloseShadow =
    document.querySelector<HTMLButtonElement>(".minicart__shadow");
  const minicartCloseKeepBuying = document.querySelector<HTMLButtonElement>(
    ".minicart__keep-buying"
  );
  const minicartCloseFinish =
    document.querySelector<HTMLButtonElement>(".minicart__finish");

  const minicartCloseArray = [];
  minicartCloseArray.push(
    minicartCloseButton,
    minicartCloseShadow,
    minicartCloseKeepBuying,
    minicartCloseFinish
  );

  minicartCloseArray.forEach((button) => {
    button.addEventListener("click", function (e) {
      minicartWrapper.classList.remove("open");
      minicartShadow.classList.remove("open");
    });
  });
}

async function getMinicartProducts() {
  const products = await getProducts();
  const minicart: Minicart[] =
    JSON.parse(localStorage.getItem("carrinho")) || [];

  const minicartProducts: MinicartProduct[] = minicart.map((item) => {
    const productMount = products.find((product) => product.id === item.id);

    if (!productMount) return null;

    return {
      ...productMount,
      price: productMount.price * item.quantity,
      quantity: item.quantity,
    };
  });

  const filteredMinicartProducts = minicartProducts.filter(
    (item) => item !== null
  );

  updateMinicartTotal(filteredMinicartProducts);

  return filteredMinicartProducts || [];
}

async function listMinicartProducts() {
  const minicartProducts = await getMinicartProducts();
  mountMinicartProducts(minicartProducts);
}

async function mountMinicartProducts(products: MinicartProduct[]) {
  let minicartProductListElement: string[] = [];

  minicartProductListElement = products?.map((item) => {
    return `<div class="minicart__product">
      <div class="minicart__product--image">
        <img src="${item.image}" alt="${item.name}"/>
      </div>
      <div class="minicart__product--right">
        <h3 class="minicart__product--name">
          ${item.name}
        </h3>
        <div class="minicart__product--quantity">
          Qtd: ${item.quantity}
        </div>
        <div class="minicart__product--price">
          ${item.price.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </div>
        <div class="minicart__product--remove" data-product-id="${
          item.id
        }"><svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.4944 19.5228C9.47458 19.4999 6.45742 19.5132 3.43854 19.5151C3.05857 19.5218 2.68661 19.4098 2.37525 19.1951C2.12572 19.0206 1.92308 18.7886 1.78553 18.5194C1.64799 18.2501 1.57934 17.9517 1.58581 17.6504C1.54907 16.7209 1.50376 15.7932 1.45928 14.8656C1.40319 13.6771 1.34024 12.4904 1.28222 11.3018C1.22871 10.1507 1.17489 8.99991 1.12074 7.84943C1.10721 7.57896 1.08994 7.30848 1.07447 7.01991H0.80393C0.715712 7.02833 0.626256 7.01741 0.54283 6.98794C0.459403 6.95846 0.384062 6.91117 0.32139 6.84944C0.258719 6.78771 0.210613 6.71309 0.180689 6.63092C0.150764 6.54875 0.139562 6.46108 0.14811 6.37419V4.36657C0.143046 4.16653 0.179293 3.96757 0.254817 3.7818C0.33034 3.59604 0.443368 3.42736 0.587212 3.28604C0.731056 3.14472 0.90267 3.03373 1.09147 2.95981C1.28027 2.88589 1.48235 2.85061 1.68544 2.8561C2.71171 2.8561 3.73747 2.8561 4.76246 2.8561H4.98295C4.98295 2.64562 4.98295 2.45515 4.98295 2.26562C4.98038 1.91039 5.08596 1.56255 5.28607 1.26699C5.48619 0.971437 5.77177 0.741734 6.10573 0.607527C6.2324 0.556098 6.36285 0.52086 6.49242 0.477051H9.51137C9.5307 0.490615 9.55141 0.502109 9.57322 0.511336C9.98971 0.592883 10.3636 0.816642 10.629 1.14316C10.8943 1.46968 11.0341 1.87799 11.0237 2.2961C11.0237 2.47991 11.0237 2.66372 11.0237 2.8561H11.2517C12.2832 2.8561 13.3125 2.8561 14.3401 2.8561C14.6786 2.85307 15.0084 2.96266 15.2759 3.16713C15.5433 3.3716 15.7331 3.65899 15.8141 3.98276C15.8258 4.01679 15.8394 4.05017 15.8547 4.08277V6.57038C15.6913 6.9961 15.3351 7.06086 14.9222 7.00753C14.9019 7.498 14.8835 7.95419 14.8623 8.41229C14.7778 10.0872 14.6942 11.7637 14.6111 13.4418C14.5415 14.871 14.4768 16.2996 14.4175 17.7275C14.4061 18.213 14.1996 18.6741 13.8434 19.0098C13.4871 19.3454 13.0104 19.5282 12.5176 19.518L12.4944 19.5228ZM2.30821 7.35515C2.32948 7.79991 2.35259 8.24657 2.37289 8.68848C2.41544 9.54562 2.45547 10.4094 2.49801 11.2685C2.55539 12.4875 2.614 13.7066 2.6746 14.9256C2.71908 15.8285 2.78222 16.7351 2.8035 17.6361C2.80093 17.7329 2.81937 17.8292 2.85779 17.9183C2.89622 18.0075 2.95385 18.0875 3.02635 18.1529C3.09885 18.2184 3.18449 18.2678 3.27801 18.2977C3.37153 18.3277 3.47067 18.3375 3.56838 18.3266C6.52441 18.3151 9.48031 18.3209 12.4373 18.3209C12.4934 18.3209 12.5502 18.3209 12.6063 18.3209C12.7554 18.3131 12.8962 18.2508 13.001 18.1462C13.1059 18.0415 13.1676 17.9021 13.1734 17.7551C13.1869 17.5694 13.1963 17.3837 13.206 17.199C13.2479 16.3101 13.2899 15.4193 13.3325 14.5266C13.3899 13.338 13.4484 12.1501 13.5077 10.9628C13.5541 10.0218 13.6044 9.08276 13.646 8.14277C13.6615 7.77324 13.646 7.40467 13.646 7.02753H2.30537C2.30828 7.14753 2.30434 7.25134 2.30821 7.35515ZM1.66608 4.04657C1.62493 4.04616 1.58416 4.05397 1.54615 4.06953C1.50815 4.08508 1.47385 4.10806 1.44511 4.13708C1.41637 4.1661 1.39386 4.20055 1.37901 4.23835C1.36417 4.27616 1.35727 4.31654 1.35871 4.35705C1.35097 4.83991 1.35871 5.32276 1.35871 5.8161H14.6418V4.50277C14.6418 4.12943 14.5538 4.04467 14.1767 4.04467H1.73313C1.71119 4.04404 1.68794 4.04468 1.66608 4.04657ZM6.7913 1.66562C6.65098 1.66198 6.514 1.70941 6.40696 1.79884C6.29992 1.88828 6.23024 2.01344 6.21102 2.15038C6.19373 2.38208 6.19193 2.61463 6.20535 2.84657H9.81213C9.81213 2.63419 9.81986 2.44372 9.81213 2.25419C9.81149 2.17628 9.7953 2.09924 9.76444 2.02749C9.73358 1.95575 9.68863 1.89069 9.63224 1.83603C9.57585 1.78138 9.50915 1.7382 9.43582 1.70896C9.36249 1.67972 9.28405 1.66499 9.20494 1.66562C8.80332 1.66181 8.40162 1.65991 8.00001 1.65991C7.59839 1.65991 7.19519 1.66245 6.79035 1.66753L6.7913 1.66562ZM4.40268 16.7132C4.38347 16.6415 4.37511 16.5674 4.37765 16.4932C4.37765 13.9415 4.37765 11.3901 4.37765 8.83895C4.37251 8.75826 4.38395 8.67737 4.41165 8.60126C4.43934 8.52514 4.48265 8.45539 4.53866 8.39627C4.59467 8.33716 4.66225 8.28992 4.73743 8.25746C4.81262 8.22499 4.89378 8.20798 4.97587 8.20746C5.05796 8.20694 5.13917 8.22293 5.21478 8.25444C5.29038 8.28595 5.35867 8.33233 5.41544 8.39073C5.47222 8.44913 5.5166 8.51833 5.54529 8.59409C5.57397 8.66985 5.58667 8.75058 5.58259 8.83134C5.58259 10.1145 5.58259 11.3967 5.58259 12.678C5.58259 13.9593 5.58259 15.2421 5.58259 16.5266C5.58536 16.6699 5.53562 16.8095 5.44283 16.9199C5.35003 17.0303 5.22038 17.1043 5.07691 17.1285C5.04774 17.1323 5.01804 17.1342 4.98862 17.1342C4.85834 17.1362 4.73113 17.0966 4.62553 17.0214C4.51993 16.9463 4.44164 16.8395 4.40268 16.7171V16.7132ZM10.4146 16.4932V12.6513C10.4146 11.3701 10.4146 10.0878 10.4146 8.80467C10.4124 8.66273 10.4619 8.52475 10.5544 8.41583C10.6468 8.30691 10.7757 8.23431 10.9179 8.21124C11.0601 8.18816 11.2061 8.21615 11.3292 8.29011C11.4522 8.36406 11.5442 8.47907 11.5884 8.61419C11.6103 8.68484 11.6205 8.75844 11.6191 8.83229C11.6191 11.3917 11.6191 13.9501 11.6191 16.5075C11.6242 16.5879 11.6129 16.6685 11.5851 16.7442C11.5572 16.82 11.5138 16.8892 11.4576 16.9477C11.4013 17.0061 11.3332 17.0525 11.2579 17.084C11.1826 17.1154 11.1017 17.1312 11.0199 17.1304C10.9368 17.1317 10.8542 17.1159 10.7777 17.0841C10.7011 17.0523 10.6322 17.0052 10.5751 16.9457C10.5181 16.8862 10.4746 16.8157 10.4467 16.7386C10.4188 16.6615 10.4076 16.5796 10.4136 16.498L10.4146 16.4932ZM7.99717 17.1294C7.91547 17.1294 7.83425 17.113 7.75921 17.0812C7.68417 17.0493 7.61655 17.0027 7.56043 16.9442C7.50431 16.8858 7.461 16.8166 7.43295 16.741C7.4049 16.6654 7.39293 16.585 7.39754 16.5047V12.6656C7.39754 11.3844 7.39754 10.1021 7.39754 8.81896C7.3938 8.67569 7.44265 8.53593 7.53541 8.4255C7.62816 8.31508 7.75868 8.24146 7.90227 8.21824C8.04586 8.19501 8.19308 8.22376 8.31682 8.29917C8.44056 8.37458 8.53211 8.49156 8.57509 8.62848C8.59491 8.69362 8.60436 8.76146 8.60247 8.82943C8.60247 11.3945 8.60247 13.9586 8.60247 16.5218C8.60673 16.6019 8.59418 16.6821 8.56564 16.7572C8.53711 16.8324 8.49287 16.9009 8.43627 16.9586C8.37968 17.0164 8.31182 17.062 8.23655 17.0927C8.16129 17.1234 8.08051 17.1385 7.99906 17.1371L7.99717 17.1294Z" fill="#333"/>
          </svg>
        </div>
      </div>
    </div>`;
  });

  if (minicartProductListElement.length == 0) {
    minicartProductListElement = [
      "<p class='minicart__empty'>Nenhum produto no carrinho!</p>",
    ];
  }

  const minicartListWrapper = document.querySelector(".minicart__list");
  if (minicartListWrapper) {
    minicartListWrapper.innerHTML = minicartProductListElement.join("");
  }

  removeProductFromMinicart();
}

async function removeProductFromMinicart() {
  const minicartProducts = await getMinicartProducts();

  const removeButton = document.querySelectorAll<HTMLButtonElement>(
    ".minicart__product--remove"
  );

  removeButton.forEach((button) => {
    button.addEventListener("click", function (e) {
      const productId = button.getAttribute("data-product-id");
      const newMinicartProducts = minicartProducts
        .map((product) => {
          if (product.id !== productId) {
            return product;
          } else if (product.id === productId && product.quantity > 1) {
            product.quantity = product.quantity - 1;
            return product;
          }

          return;
        })
        .filter(Boolean);

      localStorage.setItem("carrinho", JSON.stringify(newMinicartProducts));
      updateMinicartQuantity();
      mountMinicartProducts(newMinicartProducts || []);
    });
  });
}

async function updateMinicartTotal(productsMinicart: Product[]) {
  let count = 0;
  productsMinicart.forEach((item) => {
    count += item.price;
  });

  const totalWrapper = document.querySelector(".minicart__total--price");
  totalWrapper.innerHTML = `${count.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })}`;
}

async function renderProducts(products: Product[]) {
  const productListElements: string[] = products.map((item) => {
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
    shelfWrapper.insertAdjacentHTML("beforeend", productListElements.join(""));
  }

  buyProduct();
}

function isMobile() {
  return window.innerWidth < 991;
}

document.addEventListener("DOMContentLoaded", main);
