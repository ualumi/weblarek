import { IProduct } from '../../types';

export class Basket {
    private items: IProduct[] = [];

    getItems(): IProduct[] {
        return [...this.items];
    }

    add(item: IProduct): void {
        if (!this.has(item.id)) {
            this.items.push(item);
        }
    }

    delete(id: string): void {
        this.items = this.items.filter((item) => item.id !== id);
    }

    clear(): void {
        this.items = [];
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
