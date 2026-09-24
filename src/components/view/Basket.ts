import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { IProduct } from "../../types";
import { BasketCard } from "./BasketCard";

interface IBasket {
  items: IProduct[];
  total: number;
}

export class Basket extends Component<IBasket> {
  private readonly listElement: HTMLElement;
  private readonly priceElement: HTMLElement;
  private readonly orderButton: HTMLButtonElement;
  private readonly template: HTMLTemplateElement;

  constructor(
    container: HTMLElement,
    private readonly events: IEvents,
  ) {
    super(container);

    this.listElement = container.querySelector(".basket__list") as HTMLElement;

    this.priceElement = container.querySelector(
      ".basket__price",
    ) as HTMLElement;

    this.orderButton = container.querySelector(
      ".basket__button",
    ) as HTMLButtonElement;

    this.template = document.querySelector(
      "#card-basket",
    ) as HTMLTemplateElement;

    this.orderButton.addEventListener("click", () => {
      this.events.emit("basket:checkout");
    });
  }

  render(data: IBasket): HTMLElement {
    this.listElement.replaceChildren();

    data.items.forEach((product, index) => {
      const cardElement = this.template.content.firstElementChild?.cloneNode(
        true,
      ) as HTMLElement;

      const card = new BasketCard(cardElement, this.events);

      this.listElement.append(
        card.render({
          ...product,
          index: index + 1,
        }),
      );
    });

    this.priceElement.textContent = `${data.total} синапсов`;
    this.orderButton.disabled = data.items.length === 0;

    return this.container;
  }
}
