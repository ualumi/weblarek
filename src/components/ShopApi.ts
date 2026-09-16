import { IApi, IOrderRequest, IOrderResponse, IProductsResponse } from '../types';

export class ShopApi {
    constructor(private readonly api: IApi) {}

    getProducts(): Promise<IProductsResponse> {
        return this.api.get<IProductsResponse>('/product/');
    }

    postOrder(order: IOrderRequest): Promise<IOrderResponse> {
        return this.api.post<IOrderResponse>('/order/', order);
    }
}
