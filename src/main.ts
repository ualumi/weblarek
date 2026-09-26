import "./scss/styles.scss";

import { Api } from "./components/base/Api";
import { EventEmitter } from "./components/base/Events";

import { Products } from "./components/models/Products";
import { Basket } from "./components/models/Basket";
import { Buyer } from "./components/models/Buyer";

import { ShopApi } from "./components/ShopApi";

import { Gallery } from "./components/view/Gallery";
import { Header } from "./components/view/Header";
import { Modal } from "./components/view/Modal";
import { Basket as BasketView } from "./components/view/Basket";
import { CatalogCard } from "./components/view/CatalogCard";
import { BasketCard } from "./components/view/BasketCard";
import { PreviewCard } from "./components/view/PreviewCard";
import { OrderForm } from "./components/view/OrderForm";
import { ContactsForm } from "./components/view/ContactsForm";
import { Success } from "./components/view/Success";

import { CDN_URL, API_URL } from "./utils/constants";
import { ensureElement } from "./utils/utils";
import { TPayment } from "./types";

const events = new EventEmitter();

// Templates
const catalogTemplate = ensureElement<HTMLTemplateElement>("#card-catalog");
const basketCardTemplate = ensureElement<HTMLTemplateElement>("#card-basket");
const basketTemplate = ensureElement<HTMLTemplateElement>("#basket");
const orderTemplate = ensureElement<HTMLTemplateElement>("#order");
const contactsTemplate = ensureElement<HTMLTemplateElement>("#contacts");
const successTemplate = ensureElement<HTMLTemplateElement>("#success");
const previewTemplate = ensureElement<HTMLTemplateElement>("#card-preview");

// Gallery
const gallery = new Gallery(ensureElement<HTMLElement>(".gallery"));

// Modal
const modal = new Modal(ensureElement<HTMLElement>("#modal-container"));

// Basket View
const basketElement = basketTemplate.content.firstElementChild?.cloneNode(
  true,
) as HTMLElement;

const basketView = new BasketView(basketElement, events);

// Order Form
const orderElement = orderTemplate.content.firstElementChild?.cloneNode(
  true,
) as HTMLFormElement;

const orderForm = new OrderForm(orderElement, events);

// Contacts Form
const contactsElement = contactsTemplate.content.firstElementChild?.cloneNode(
  true,
) as HTMLFormElement;

const contactsForm = new ContactsForm(contactsElement, events);

// Success
const successElement = successTemplate.content.firstElementChild?.cloneNode(
  true,
) as HTMLElement;

const success = new Success(successElement, events);

// Header
const header = new Header(ensureElement<HTMLElement>(".header"), events);

// Models
const productsModel = new Products(events);
const basketModel = new Basket(events);
const buyerModel = new Buyer(events);

// API
const api = new Api(API_URL);
const shopApi = new ShopApi(api);

// Preview Card
const previewElement = previewTemplate.content.firstElementChild?.cloneNode(
  true,
) as HTMLElement;

const previewCard = new PreviewCard(previewElement, events);

// Products changed
events.on("products:changed", () => {
  const cards = productsModel.getItems().map((product) => {
    const cardElement = catalogTemplate.content.firstElementChild?.cloneNode(
      true,
    ) as HTMLElement;

    const card = new CatalogCard(cardElement, () => {
      events.emit("card:select", {
        id: product.id,
      });
    });

    return card.render({
      title: product.title,
      price: product.price,
      category: product.category,
      image: {
        src: `${CDN_URL}${product.image}`,
        alt: product.title,
      },
    });
  });

  gallery.catalog = cards;
});

// Card selected
events.on<{ id: string }>("card:select", ({ id }) => {
  const product = productsModel.getItem(id);

  if (product) {
    productsModel.setSelected(product);
  }
});

// Product selected
events.on("product:selected", () => {
  const product = productsModel.getSelected();

  if (!product) {
    return;
  }

  const preview = previewCard.render({
    title: product.title,
    price: product.price,
    category: product.category,
    image: {
      src: `${CDN_URL}${product.image}`,
      alt: product.title,
    },
    description: product.description,
    buttonText:
      product.price === null
        ? "Недоступно"
        : basketModel.has(product.id)
          ? "Удалить из корзины"
          : "В корзину",
    buttonDisabled: product.price === null,
  });

  modal.open(preview);
});

// Preview action
events.on("card:action", () => {
  const product = productsModel.getSelected();

  if (!product) {
    return;
  }

  if (basketModel.has(product.id)) {
    basketModel.delete(product.id);
  } else {
    basketModel.add(product);
  }

  modal.close();
});

// Basket changed
events.on("basket:changed", () => {
  header.count = basketModel.getCount();

  const cards = basketModel.getItems().map((product, index) => {
    const cardElement = basketCardTemplate.content.firstElementChild?.cloneNode(
      true,
    ) as HTMLElement;

    const card = new BasketCard(cardElement, () => {
      events.emit("basket:remove", {
        id: product.id,
      });
    });

    return card.render({
      title: product.title,
      price: product.price,
      index: index + 1,
    });
  });

  basketView.items = cards;
  basketView.total = basketModel.getTotal();
  basketView.buttonDisabled = basketModel.getCount() === 0;
});

// Basket open
events.on("basket:open", () => {
  modal.open(basketView.render());
});

// Basket remove
events.on<{ id: string }>("basket:remove", ({ id }) => {
  basketModel.delete(id);
});

// Basket checkout
events.on("basket:checkout", () => {
  modal.open(orderForm.render());
});

// Order payment
events.on<{ payment: TPayment }>("order:payment", ({ payment }) => {
  buyerModel.setData({
    payment,
  });
});

// Order address
events.on<{ address: string }>("order:address", ({ address }) => {
  buyerModel.setData({
    address,
  });
});

// Order submit
events.on("order:submit", () => {
  modal.open(contactsForm.render());
});

// Contacts email
events.on<{ email: string }>("contacts:email", ({ email }) => {
  buyerModel.setData({
    email,
  });
});

// Contacts phone
events.on<{ phone: string }>("contacts:phone", ({ phone }) => {
  buyerModel.setData({
    phone,
  });
});

// Contacts submit
events.on("contacts:submit", () => {
  const buyer = buyerModel.getData();
  const items = basketModel.getItems();

  shopApi
    .postOrder({
      ...buyer,
      items: items.map((item) => item.id),
      total: basketModel.getTotal(),
    })
    .then((response) => {
      basketModel.clear();
      buyerModel.clear();

      modal.open(
        success.render({
          total: response.total,
        }),
      );
    })
    .catch((error) => {
      console.error("Не удалось оформить заказ:", error);
    });
});

// Buyer changed
events.on("buyer:changed", () => {
  const data = buyerModel.getData();

  const orderErrors = buyerModel.validate(["payment", "address"]);

  orderForm.render({
    payment: data.payment,
    address: data.address,
    errors: Object.values(orderErrors),
    valid: Object.keys(orderErrors).length === 0,
  });

  const contactsErrors = buyerModel.validate(["email", "phone"]);

  contactsForm.render({
    email: data.email,
    phone: data.phone,
    errors: Object.values(contactsErrors),
    valid: Object.keys(contactsErrors).length === 0,
  });
});

// Success close
events.on("success:close", () => {
  modal.close();
});

// Initial state
basketModel.clear();
buyerModel.clear();

// Load catalog
shopApi
  .getProducts()
  .then((response) => {
    productsModel.setItems(response.items);
  })
  .catch((error) => {
    console.error("Не удалось получить каталог с сервера:", error);
  });
