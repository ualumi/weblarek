import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class Basket {
  private items: IProduct[] = [];

  constructor(private readonly events: IEvents) {}

  getItems(): IProduct[] {
    return [...this.items];
  }

  add(item: IProduct): void {
    if (this.has(item.id)) {
      return;
    }

    this.items.push(item);
    this.events.emit("basket:changed", {
      items: this.getItems(),
      total: this.getTotal(),
      count: this.getCount(),
    });
  }

  delete(id: string): void {
    const hadItem = this.has(id);

    this.items = this.items.filter((item) => item.id !== id);

    if (hadItem) {
      this.events.emit("basket:changed", {
        items: this.getItems(),
        total: this.getTotal(),
        count: this.getCount(),
      });
    }
  }

  clear(): void {
    if (this.items.length === 0) {
      return;
    }

    this.items = [];

    this.events.emit("basket:changed", {
      items: this.getItems(),
      total: this.getTotal(),
      count: this.getCount(),
    });
  }

  getTotal(): number {
    return this.items.reduce((total, item) => total + (item.price ?? 0), 0);
  }

  getCount(): number {
    return this.items.length;
  }

  has(id: string): boolean {
    return this.items.some((item) => item.id === id);
  }
}
