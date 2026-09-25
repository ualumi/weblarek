import { IImage, IPreviewCard } from "../../types";
import { categoryMap } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { Card } from "./Card";

export class PreviewCard extends Card<IPreviewCard> {
  private readonly categoryElement: HTMLElement;
  private readonly imageElement: HTMLImageElement;
  private readonly descriptionElement: HTMLElement;
  private readonly actionButton: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    private readonly events: IEvents,
  ) {
    super(container);

    this.categoryElement = ensureElement<HTMLElement>(
      ".card__category",
      container,
    );

    this.imageElement = ensureElement<HTMLImageElement>(
      ".card__image",
      container,
    );

    this.descriptionElement = ensureElement<HTMLElement>(
      ".card__text",
      container,
    );

    this.actionButton = ensureElement<HTMLButtonElement>(
      ".card__button",
      container,
    );

    this.actionButton.addEventListener("click", () => {
      this.events.emit("card:action");
    });
  }

  set category(value: string) {
    this.categoryElement.textContent = value;

    Object.values(categoryMap).forEach((className) => {
      this.categoryElement.classList.remove(className);
    });

    const categoryClass = categoryMap[value as keyof typeof categoryMap];

    if (categoryClass) {
      this.categoryElement.classList.add(categoryClass);
    }
  }

  set image(value: IImage) {
    this.setImage(this.imageElement, value.src, value.alt);
  }

  set description(value: string) {
    this.descriptionElement.textContent = value;
  }

  set buttonText(value: string) {
    this.actionButton.textContent = value;
  }

  set buttonDisabled(value: boolean) {
    this.actionButton.disabled = value;
  }
}
