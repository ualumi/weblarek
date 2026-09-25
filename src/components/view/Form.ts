import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

export abstract class Form<T> extends Component<T> {
  protected readonly errorsElement: HTMLElement;
  protected readonly submitButton: HTMLButtonElement;

  constructor(
    protected readonly container: HTMLFormElement,
    protected readonly events: IEvents,
  ) {
    super(container);

    this.errorsElement = ensureElement<HTMLElement>(".form__errors", container);

    this.submitButton = ensureElement<HTMLButtonElement>(
      'button[type="submit"]',
      container,
    );

    this.container.addEventListener("submit", (event) => {
      event.preventDefault();
      this.events.emit(`${this.container.name}:submit`);
    });
  }

  set errors(errors: string[]) {
    this.errorsElement.textContent = errors.join(", ");
  }

  set valid(isValid: boolean) {
    this.submitButton.disabled = !isValid;
  }
}
