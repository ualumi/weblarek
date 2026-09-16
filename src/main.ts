import './scss/styles.scss';

import { Api } from './components/base/Api';
import { Basket } from './components/models/Basket';
import { Buyer } from './components/models/Buyer';
import { Products } from './components/models/Products';
import { ShopApi } from './components/ShopApi';
import { IProduct } from './types';
import { API_URL } from './utils/constants';
import { apiProducts } from './utils/data';

const productsModel = new Products();
const basketModel = new Basket();
const buyerModel = new Buyer();

const firstProduct = apiProducts.items[0] as IProduct;
const secondProduct = apiProducts.items[1] as IProduct;

productsModel.setItems(apiProducts.items);
console.log('Каталог товаров:', productsModel.getItems());
console.log('Товар по id:', productsModel.getItem(firstProduct.id));
productsModel.setSelected(firstProduct);
console.log('Выбранный товар:', productsModel.getSelected());

basketModel.add(firstProduct);
basketModel.add(secondProduct);
console.log('Товары в корзине:', basketModel.getItems());
console.log('Товар есть в корзине:', basketModel.has(firstProduct.id));
console.log('Количество товаров:', basketModel.getCount());
console.log('Стоимость корзины:', basketModel.getTotal());
basketModel.delete(firstProduct.id);
console.log('Корзина после удаления:', basketModel.getItems());
basketModel.clear();
console.log('Корзина после очистки:', basketModel.getItems());

console.log('Ошибки пустых данных покупателя:', buyerModel.validate());
buyerModel.setData({ payment: 'card', address: 'Москва' });
console.log('Данные покупателя после частичного сохранения:', buyerModel.getData());
console.log('Ошибки отдельных полей:', buyerModel.validate(['email', 'phone']));
buyerModel.clear();
console.log('Данные покупателя после очистки:', buyerModel.getData());

const shopApi = new ShopApi(new Api(API_URL));
shopApi.getProducts()
    .then((response) => {
        productsModel.setItems(response.items);
        console.log('Каталог, полученный с сервера и сохранённый в модели:', productsModel.getItems());
    })
    .catch((error) => {
        console.error('Не удалось получить каталог с сервера:', error);
    });
