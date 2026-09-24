import { IProduct } from "../../types";
import { IEvents } from "../base/Events";
import { Card } from "./Card";

interface IPreviewCard extends IProduct {
  inBasket: boolean;
}

export class PreviewCard extends Card<IPreviewCard> {
  private readonly descriptionElement: HTMLElement;
  private readonly actionButton: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    private readonly events: IEvents,
  ) {
    super(container);

    this.descriptionElement = container.querySelector(
      ".card__text",
    ) as HTMLElement;

    this.actionButton = container.querySelector(
      ".card__button",
    ) as HTMLButtonElement;

    this.actionButton.addEventListener("click", () => {
      this.events.emit("basket:toggle");
    });
  }

  render(data: IPreviewCard): HTMLElement {
    this.setTitle(data.title);
    this.setPrice(data.price);
    this.setCategory(data.category);
    this.setCardImage(data.image, data.title);

    this.descriptionElement.textContent = data.description;

    if (data.price === null) {
      this.actionButton.disabled = true;
      this.actionButton.textContent = "Недоступно";
    } else {
      this.actionButton.disabled = false;
      this.actionButton.textContent = data.inBasket
        ? "Удалить из корзины"
        : "В корзину";
    }

    return this.container;
  }
}
