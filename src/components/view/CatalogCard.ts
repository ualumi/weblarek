import { IProduct } from "../../types";
import { IEvents } from "../base/Events";
import { Card } from "./Card";

export class CatalogCard extends Card<IProduct> {
  constructor(
    container: HTMLElement,
    private readonly events: IEvents,
  ) {
    super(container);
  }

  render(data: IProduct): HTMLElement {
    this.setTitle(data.title);
    this.setPrice(data.price);
    this.setCategory(data.category);
    this.setCardImage(data.image, data.title);

    this.container.onclick = () => {
      this.events.emit("card:select", {
        id: data.id,
      });
    };

    return this.container;
  }
}
