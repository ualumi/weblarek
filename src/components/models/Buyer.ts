import { IBuyer, TBuyerErrors } from '../../types';

export class Buyer {
    private data: Partial<IBuyer> = {};

    setData(data: Partial<IBuyer>): void {
        this.data = { ...this.data, ...data };
    }

    getData(): Partial<IBuyer> {
        return { ...this.data };
    }

    clear(): void {
        this.data = {};
    }

    validate(fields?: (keyof IBuyer)[]): TBuyerErrors {
        const fieldsToValidate = fields ?? ['payment', 'email', 'phone', 'address'];
        const errors: TBuyerErrors = {};
        const messages: Record<keyof IBuyer, string> = {
            payment: 'Не выбран вид оплаты',
            email: 'Укажите email',
            phone: 'Укажите телефон',
            address: 'Укажите адрес доставки',
        };

        fieldsToValidate.forEach((field) => {
            const value = this.data[field];
            if (value === undefined || (typeof value === 'string' && value.trim() === '')) {
                errors[field] = messages[field];
            }
        });

        return errors;
    }
}
