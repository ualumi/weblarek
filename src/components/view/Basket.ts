import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";
import { IBasket } from "../../types";

export class Basket extends Component<IBasket> {
  private readonly listElement: HTMLElement;
  private readonly priceElement: HTMLElement;
  private readonly orderButton: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    private readonly events: IEvents,
  ) {
    super(container);

    this.listElement = ensureElement<HTMLElement>(".basket__list", container);

    this.priceElement = ensureElement<HTMLElement>(".basket__price", container);

    this.orderButton = ensureElement<HTMLButtonElement>(
      ".basket__button",
      container,
    );

    this.orderButton.addEventListener("click", () => {
      this.events.emit("basket:checkout");
    });
  }

  set items(value: HTMLElement[]) {
    this.listElement.replaceChildren(...value);
  }

  set total(value: number) {
    this.priceElement.textContent = `${value} синапсов`;
  }

  set buttonDisabled(value: boolean) {
    this.orderButton.disabled = value;
  }
}
