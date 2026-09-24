import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IHeader {
  count: number;
}

export class Header extends Component<IHeader> {
  private readonly basketButton: HTMLButtonElement;
  private readonly basketCounter: HTMLElement;

  constructor(
    container: HTMLElement,
    private readonly events: IEvents,
  ) {
    super(container);

    this.basketButton = container.querySelector(
      ".header__basket",
    ) as HTMLButtonElement;

    this.basketCounter = container.querySelector(
      ".header__basket-counter",
    ) as HTMLElement;

    this.basketButton.addEventListener("click", () => {
      this.events.emit("basket:open");
    });
  }

  render(data: IHeader): HTMLElement {
    this.basketCounter.textContent = String(data.count);

    return this.container;
  }
}
