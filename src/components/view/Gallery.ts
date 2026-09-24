import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { IProduct } from "../../types";
import { CatalogCard } from "./CatalogCard";

export class Gallery extends Component<IProduct[]> {
  private readonly template: HTMLTemplateElement;

  constructor(
    container: HTMLElement,
    private readonly events: IEvents,
  ) {
    super(container);

    this.template = document.querySelector(
      "#card-catalog",
    ) as HTMLTemplateElement;
  }

  render(data: IProduct[]): HTMLElement {
    this.container.innerHTML = "";

    data.forEach((product) => {
      const cardElement = this.template.content.firstElementChild?.cloneNode(
        true,
      ) as HTMLElement;

      const card = new CatalogCard(cardElement, this.events);

      this.container.append(card.render(product));
    });

    return this.container;
  }
}
