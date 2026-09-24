import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface ISuccess {
  total: number;
}

export class Success extends Component<ISuccess> {
  private readonly descriptionElement: HTMLElement;
  private readonly closeButton: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    private readonly events: IEvents,
  ) {
    super(container);

    this.descriptionElement = container.querySelector(
      ".order-success__description",
    ) as HTMLElement;

    this.closeButton = container.querySelector(
      ".order-success__close",
    ) as HTMLButtonElement;

    this.closeButton.addEventListener("click", () => {
      this.events.emit("success:close");
    });
  }

  render(data: ISuccess): HTMLElement {
    this.descriptionElement.textContent = `Списано ${data.total} синапсов`;

    return this.container;
  }
}
