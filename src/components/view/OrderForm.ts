import { IBuyer, TPayment } from "../../types";
import { IEvents } from "../base/Events";
import { Form } from "./Form";

export class OrderForm extends Form<IBuyer> {
  private readonly cardButton: HTMLButtonElement;
  private readonly cashButton: HTMLButtonElement;
  private readonly addressInput: HTMLInputElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);

    this.cardButton = this.form.querySelector(
      '[name="card"]',
    ) as HTMLButtonElement;

    this.cashButton = this.form.querySelector(
      '[name="cash"]',
    ) as HTMLButtonElement;

    this.addressInput = this.form.querySelector(
      '[name="address"]',
    ) as HTMLInputElement;

    this.cardButton.addEventListener("click", () => {
      this.events.emit("order:payment", {
        payment: "card" as TPayment,
      });
    });

    this.cashButton.addEventListener("click", () => {
      this.events.emit("order:payment", {
        payment: "cash" as TPayment,
      });
    });

    this.addressInput.addEventListener("input", () => {
      this.events.emit("order:address", {
        address: this.addressInput.value,
      });
    });
  }

  render(data: IBuyer): HTMLElement {
    this.addressInput.value = data.address;

    this.cardButton.classList.toggle(
      "button_alt-active",
      data.payment === "card",
    );

    this.cashButton.classList.toggle(
      "button_alt-active",
      data.payment === "cash",
    );

    return this.container;
  }

  showErrors(errors: string[]): void {
    this.setErrors(errors);
  }

  setSubmitState(enabled: boolean): void {
    this.setSubmitEnabled(enabled);
  }
}
