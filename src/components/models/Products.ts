import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class Products {
  private items: IProduct[] = [];
  private selectedProduct: IProduct | null = null;

  constructor(private readonly events: IEvents) {}

  setItems(items: IProduct[]): void {
    this.items = [...items];

    this.events.emit("products:changed");
  }

  getItems(): IProduct[] {
    return [...this.items];
  }

  getItem(id: string): IProduct | undefined {
    return this.items.find((item) => item.id === id);
  }

  setSelected(item: IProduct | null): void {
    this.selectedProduct = item;

    this.events.emit("product:selected");
  }

  getSelected(): IProduct | null {
    return this.selectedProduct;
  }
}
