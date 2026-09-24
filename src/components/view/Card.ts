import { Component } from "../base/Component";
import { CDN_URL, categoryMap } from "../../utils/constants";

export abstract class Card<T> extends Component<T> {
  protected titleElement: HTMLElement;
  protected priceElement: HTMLElement;
  protected categoryElement?: HTMLElement;
  protected imageElement?: HTMLImageElement;

  constructor(container: HTMLElement) {
    super(container);

    this.titleElement = container.querySelector(".card__title") as HTMLElement;
    this.priceElement = container.querySelector(".card__price") as HTMLElement;
    this.categoryElement = container.querySelector(".card__category") as
      HTMLElement | undefined;
    this.imageElement = container.querySelector(".card__image") as
      HTMLImageElement | undefined;
  }

  protected setTitle(title: string): void {
    this.titleElement.textContent = title;
  }

  protected setPrice(price: number | null): void {
    this.priceElement.textContent =
      price !== null ? `${price} синапсов` : "Бесценно";
  }

  protected setCategory(category: string): void {
    const element = this.categoryElement;
    if (!element) {
      return;
    }

    element.textContent = category;

    Object.values(categoryMap).forEach((className) => {
      element.classList.remove(className);
    });

    const categoryClass = categoryMap[category as keyof typeof categoryMap];

    if (categoryClass) {
      element.classList.add(categoryClass);
    }
  }

  protected setCardImage(src: string, alt: string): void {
    if (this.imageElement) {
      super.setImage(this.imageElement, `${CDN_URL}${src}`, alt);
    }
  }
}
