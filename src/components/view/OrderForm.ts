import { IOrderForm, TPayment } from "../../types";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { Form } from "./Form";

export class OrderForm extends Form<IOrderForm> {
  private readonly cardButton: HTMLButtonElement;
  private readonly cashButton: HTMLButtonElement;
  private readonly addressInput: HTMLInputElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);

    this.cardButton = ensureElement<HTMLButtonElement>(
      '[name="card"]',
      container,
    );

    this.cashButton = ensureElement<HTMLButtonElement>(
      '[name="cash"]',
      container,
    );

    this.addressInput = ensureElement<HTMLInputElement>(
      '[name="address"]',
      container,
    );

    this.cardButton.addEventListener("click", () => {
      this.events.emit<{ payment: TPayment }>("order:payment", {
        payment: "card",
      });
    });

    this.cashButton.addEventListener("click", () => {
      this.events.emit<{ payment: TPayment }>("order:payment", {
        payment: "cash",
      });
    });

    this.addressInput.addEventListener("input", () => {
      this.events.emit("order:address", {
        address: this.addressInput.value,
      });
    });
  }

  set address(value: string) {
    this.addressInput.value = value;
  }

  set payment(value: TPayment | null) {
    this.cardButton.classList.toggle("button_alt-active", value === "card");

    this.cashButton.classList.toggle("button_alt-active", value === "cash");
  }
}
