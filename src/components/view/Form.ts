import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export abstract class Form<T> extends Component<T> {
  protected readonly form: HTMLFormElement;
  protected readonly errorsElement: HTMLElement;
  protected readonly submitButton: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    protected readonly events: IEvents,
  ) {
    super(container);

    this.form = container as HTMLFormElement;

    this.errorsElement = this.form.querySelector(
      ".form__errors",
    ) as HTMLElement;

    this.submitButton = this.form.querySelector(
      'button[type="submit"]',
    ) as HTMLButtonElement;

    this.form.addEventListener("submit", (event) => {
      event.preventDefault();

      this.events.emit("form:submit", {
        form: this.form.name,
      });
    });
  }

  protected setErrors(errors: string[]): void {
    this.errorsElement.textContent = errors.join(", ");
  }

  protected setSubmitEnabled(enabled: boolean): void {
    this.submitButton.disabled = !enabled;
  }
}
