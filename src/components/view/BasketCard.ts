import { IProduct } from "../../types";
import { IEvents } from "../base/Events";
import { Card } from "./Card";

interface IBasketCard extends IProduct {
  index: number;
}

export class BasketCard extends Card<IBasketCard> {
  private readonly indexElement: HTMLElement;
  private readonly deleteButton: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    private readonly events: IEvents,
  ) {
    super(container);

    this.indexElement = container.querySelector(
      ".basket__item-index",
    ) as HTMLElement;

    this.deleteButton = container.querySelector(
      ".basket__item-delete",
    ) as HTMLButtonElement;
  }

  render(data: IBasketCard): HTMLElement {
    this.indexElement.textContent = String(data.index);

    this.setTitle(data.title);
    this.setPrice(data.price);

    this.deleteButton.onclick = () => {
      this.events.emit("basket:remove", {
        id: data.id,
      });
    };

    return this.container;
  }
}
