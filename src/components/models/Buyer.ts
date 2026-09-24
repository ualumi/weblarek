import { IBuyer, TBuyerErrors } from "../../types";

export class Buyer {
  private data: IBuyer = {
    payment: null,
    email: "",
    phone: "",
    address: "",
  };

  setData(data: Partial<IBuyer>): void {
    this.data = {
      ...this.data,
      ...data,
    };
  }

  getData(): IBuyer {
    return { ...this.data };
  }

  clear(): void {
    this.data = {
      payment: null,
      email: "",
      phone: "",
      address: "",
    };
  }

  validate(fields?: (keyof IBuyer)[]): TBuyerErrors {
    const errors: TBuyerErrors = {};

    if ((!fields || fields.includes("payment")) && this.data.payment === null) {
      errors.payment = "Не выбран вид оплаты";
    }

    if (
      (!fields || fields.includes("email")) &&
      this.data.email.trim() === ""
    ) {
      errors.email = "Укажите email";
    }

    if (
      (!fields || fields.includes("phone")) &&
      this.data.phone.trim() === ""
    ) {
      errors.phone = "Укажите телефон";
    }

    if (
      (!fields || fields.includes("address")) &&
      this.data.address.trim() === ""
    ) {
      errors.address = "Укажите адрес доставки";
    }

    return errors;
  }
}
