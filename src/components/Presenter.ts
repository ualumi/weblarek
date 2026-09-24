import { IEvents } from "./base/Events";
import { Products } from "./models/Products";
import { Basket as BasketModel } from "./models/Basket";
import { Buyer } from "./models/Buyer";
import { Gallery } from "./view/Gallery";
import { Modal } from "./view/Modal";
import { PreviewCard } from "./view/PreviewCard";
import { Basket as BasketView } from "./view/Basket";
import { Header } from "./view/Header";
import { OrderForm } from "./view/OrderForm";
import { ContactsForm } from "./view/ContactsForm";
import { ShopApi } from "./ShopApi";
import { Success } from "./view/Success";

export class Presenter {
  constructor(
    private readonly events: IEvents,
    private readonly productsModel: Products,
    private readonly basketModel: BasketModel,
    private readonly buyerModel: Buyer,
    private readonly gallery: Gallery,
    private readonly modal: Modal,
    private readonly basketView: BasketView,
    private readonly header: Header,
    private readonly orderForm: OrderForm,
    private readonly contactsForm: ContactsForm,
    private readonly shopApi: ShopApi,
    private readonly success: Success,
  ) {
    this.events.on("products:changed", () => {
      this.renderCatalog();
    });

    this.events.on("basket:changed", () => {
      this.updateBasket();
    });

    this.events.on<{ id: string }>("card:select", (data) => {
      const product = this.productsModel.getItem(data.id);

      if (!product) {
        return;
      }

      this.productsModel.setSelected(product);

      const template = document.querySelector(
        "#card-preview",
      ) as HTMLTemplateElement;

      const cardElement = template.content.firstElementChild?.cloneNode(
        true,
      ) as HTMLElement;

      const previewCard = new PreviewCard(cardElement, this.events);

      this.modal.open(
        previewCard.render({
          ...product,
          inBasket: this.basketModel.has(product.id),
        }),
      );
    });

    this.events.on("basket:open", () => {
      this.openBasket();
    });

    this.events.on<{ id: string }>("basket:remove", (data) => {
      this.basketModel.delete(data.id);
      this.openBasket();
    });

    this.events.on<{ payment: "card" | "cash" }>("order:payment", (data) => {
      this.buyerModel.setData({
        payment: data.payment,
      });

      this.updateOrderForm();
    });

    this.events.on<{ address: string }>("order:address", (data) => {
      this.buyerModel.setData({
        address: data.address,
      });

      this.updateOrderForm();
    });

    this.events.on("basket:checkout", () => {
      if (this.basketModel.getCount() === 0) {
        return;
      }

      this.openOrderForm();
    });

    this.events.on<{ form: string }>("form:submit", (data) => {
      if (data.form === "order") {
        this.openContactsForm();
      } else if (data.form === "contacts") {
        this.submitOrder();
      }
    });

    this.events.on<{ email: string }>("contacts:email", (data) => {
      this.buyerModel.setData({
        email: data.email,
      });

      this.updateContactsForm();
    });

    this.events.on<{ phone: string }>("contacts:phone", (data) => {
      this.buyerModel.setData({
        phone: data.phone,
      });

      this.updateContactsForm();
    });

    this.events.on("success:close", () => {
      this.modal.close();
    });

    this.events.on("basket:toggle", () => {
      const product = this.productsModel.getSelected();

      if (!product) {
        return;
      }

      if (this.basketModel.has(product.id)) {
        this.basketModel.delete(product.id);
      } else {
        this.basketModel.add(product);
      }

      this.modal.close();
    });
  }

  renderCatalog(): void {
    this.gallery.render(this.productsModel.getItems());
  }

  private updateBasket(): void {
    this.header.render({
      count: this.basketModel.getCount(),
    });
  }

  private openBasket(): void {
    const basket = this.basketView.render({
      items: this.basketModel.getItems(),
      total: this.basketModel.getTotal(),
    });

    this.modal.open(basket);
  }

  private updateOrderForm(): HTMLElement {
    const data = this.buyerModel.getData();
    const errors = this.buyerModel.validate(["payment", "address"]);
    const form = this.orderForm.render(data);

    this.orderForm.showErrors(Object.values(errors));
    this.orderForm.setSubmitState(Object.keys(errors).length === 0);
    return form;
  }

  private openOrderForm(): void {
    this.modal.open(this.updateOrderForm());
  }

  private openContactsForm(): void {
    const errors = this.buyerModel.validate(["payment", "address"]);

    if (Object.keys(errors).length > 0) {
      this.orderForm.showErrors(Object.values(errors));
      return;
    }

    this.modal.open(this.updateContactsForm());
  }

  private updateContactsForm(): HTMLElement {
    const data = this.buyerModel.getData();
    const errors = this.buyerModel.validate(["email", "phone"]);

    const form = this.contactsForm.render(data);

    this.contactsForm.showErrors(Object.values(errors));
    this.contactsForm.setSubmitState(Object.keys(errors).length === 0);

    return form;
  }

  private submitOrder(): void {
    const errors = this.buyerModel.validate();

    if (Object.keys(errors).length > 0) {
      this.contactsForm.showErrors(Object.values(errors));
      return;
    }

    const buyer = this.buyerModel.getData();
    const items = this.basketModel.getItems();

    this.shopApi
      .postOrder({
        ...buyer,
        items: items.map((item) => item.id),
        total: this.basketModel.getTotal(),
      })
      .then((response) => {
        this.basketModel.clear();
        this.buyerModel.clear();

        this.modal.open(
          this.success.render({
            total: response.total,
          }),
        );
      })
      .catch((error) => {
        console.error("Не удалось оформить заказ:", error);
      });
  }
}
