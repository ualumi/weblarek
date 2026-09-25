export type ApiPostMethods = "POST" | "PUT" | "DELETE";

export type TPayment = "card" | "cash";

export interface IProduct {
  id: string;
  description: string;
  image: IImage;
  title: string;
  category: string;
  price: number | null;
}

export interface IBuyer {
  payment: TPayment | null;
  email: string;
  phone: string;
  address: string;
}

export interface IProductsResponse {
  total: number;
  items: IProduct[];
}

export interface IOrderRequest extends IBuyer {
  items: string[];
  total: number;
}

export interface IOrderResponse {
  id: string;
  total: number;
}

export type TBuyerErrors = Partial<Record<keyof IBuyer, string>>;

export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(
    uri: string,
    data: object,
    method?: ApiPostMethods,
  ): Promise<T>;
}

export interface IImage {
  src: string;
  alt: string;
}

export interface ICard {
  title: string;
  price: number | null;
}

export interface ISuccess {
  total: number;
}

export interface IPreviewCard extends ICard {
  category: string;
  image: IImage;
  description: string;
  buttonText: string;
  buttonDisabled: boolean;
}

export interface IOrderForm {
  payment: TPayment | null;
  address: string;
  errors: string[];
  valid: boolean;
}

export interface IModal {
  content: HTMLElement;
}

export interface IHeader {
  count: number;
}

export interface IContactsForm {
  email: string;
  phone: string;
  errors: string[];
  valid: boolean;
}

export interface IBasketCard extends ICard {
  index: number;
}

export interface IBasket {
  items: HTMLElement[];
  total: number;
  buttonDisabled: boolean;
}

export interface ICatalogCard extends ICard {
  category: string;
  image: IImage;
}

export interface IGallery {
  catalog: HTMLElement[];
}
