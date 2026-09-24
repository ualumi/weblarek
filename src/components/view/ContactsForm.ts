import { IBuyer } from "../../types";
import { IEvents } from "../base/Events";
import { Form } from "./Form";

export class ContactsForm extends Form<IBuyer> {
  private readonly emailInput: HTMLInputElement;
  private readonly phoneInput: HTMLInputElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);

    this.emailInput = this.form.querySelector(
      '[name="email"]',
    ) as HTMLInputElement;

    this.phoneInput = this.form.querySelector(
      '[name="phone"]',
    ) as HTMLInputElement;

    this.emailInput.addEventListener("input", () => {
      this.events.emit("contacts:email", {
        email: this.emailInput.value,
      });
    });

    this.phoneInput.addEventListener("input", () => {
      this.events.emit("contacts:phone", {
        phone: this.phoneInput.value,
      });
    });
  }

  render(data: IBuyer): HTMLElement {
    this.emailInput.value = data.email;
    this.phoneInput.value = data.phone;

    return this.container;
  }

  showErrors(errors: string[]): void {
    this.setErrors(errors);
  }

  setSubmitState(enabled: boolean): void {
    this.setSubmitEnabled(enabled);
  }
}
