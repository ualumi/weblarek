import "./scss/styles.scss";

import { Api } from "./components/base/Api";
import { Basket } from "./components/models/Basket";
import { Buyer } from "./components/models/Buyer";
import { Products } from "./components/models/Products";
import { ShopApi } from "./components/ShopApi";
import { API_URL } from "./utils/constants";
import { EventEmitter } from "./components/base/Events";

import { Gallery } from "./components/view/Gallery";
import { Header } from "./components/view/Header";
import { Presenter } from "./components/Presenter";
import { Modal } from "./components/view/Modal";
import { Basket as BasketView } from "./components/view/Basket";
import { OrderForm } from "./components/view/OrderForm";
import { ContactsForm } from "./components/view/ContactsForm";
import { Success } from "./components/view/Success";

const events = new EventEmitter();

// Gallery
const galleryElement = document.querySelector(".gallery") as HTMLElement;
const gallery = new Gallery(galleryElement, events);

// Modal
const modalElement = document.querySelector("#modal-container") as HTMLElement;

const modal = new Modal(modalElement);

// Basket View
const basketTemplate = document.querySelector("#basket") as HTMLTemplateElement;

const basketElement = basketTemplate.content.firstElementChild?.cloneNode(
  true,
) as HTMLElement;

const basketView = new BasketView(basketElement, events);

// Order Form
const orderTemplate = document.querySelector("#order") as HTMLTemplateElement;

const orderElement = orderTemplate.content.firstElementChild?.cloneNode(
  true,
) as HTMLFormElement;

const orderForm = new OrderForm(orderElement, events);

// Contacts Form
const contactsTemplate = document.querySelector(
  "#contacts",
) as HTMLTemplateElement;

const contactsElement = contactsTemplate.content.firstElementChild?.cloneNode(
  true,
) as HTMLFormElement;

const contactsForm = new ContactsForm(contactsElement, events);

// Success
const successTemplate = document.querySelector(
  "#success",
) as HTMLTemplateElement;

const successElement = successTemplate.content.firstElementChild?.cloneNode(
  true,
) as HTMLElement;

const success = new Success(successElement, events);

// Header
const headerElement = document.querySelector(".header") as HTMLElement;

const header = new Header(headerElement, events);

// Models
const productsModel = new Products(events);
const basketModel = new Basket(events);
const buyerModel = new Buyer();

header.render({ count: basketModel.getCount() });

// API
const shopApi = new ShopApi(new Api(API_URL));

// Presenter
new Presenter(
  events,
  productsModel,
  basketModel,
  buyerModel,
  gallery,
  modal,
  basketView,
  header,
  orderForm,
  contactsForm,
  shopApi,
  success,
);

// Загрузка каталога
shopApi
  .getProducts()
  .then((response) => {
    productsModel.setItems(response.items);
  })
  .catch((error) => {
    console.error("Не удалось получить каталог с сервера:", error);
  });
