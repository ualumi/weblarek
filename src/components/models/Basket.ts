import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class Basket {
  private items: IProduct[] = [];

  constructor(private readonly events: IEvents) {}

  getItems(): IProduct[] {
    return [...this.items];
  }

  add(item: IProduct): void {
    this.items.push(item);
    this.events.emit("basket:changed");
  }

  delete(id: string): void {
    this.items = this.items.filter((item) => item.id !== id);
    this.events.emit("basket:changed");
  }

  clear(): void {
    this.items = [];
    this.events.emit("basket:changed");
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
