# Проектная работа «Веб-ларёк»

Интернет-магазин товаров для веб-разработчиков.

**Стек:** HTML, SCSS, TypeScript, Vite.

## Установка и запуск

```bash
npm install
npm run dev
```

Для сборки:

```bash
npm run build
```

## Структура проекта

```text
src/
├── components/
│   ├── base/          # базовые классы
│   ├── models/        # модели данных
│   ├── view/          # представления
│   └── ShopApi.ts     # работа с API
├── scss/              # стили
├── types/             # типы и интерфейсы
├── utils/             # константы и утилиты
├── pages/index.html   # HTML-шаблоны
└── main.ts            # точка входа
```

Основные файлы:

- `main.ts` - создание и связывание компонентов, роль презентера.
- `types/index.ts` - типы предметной области.
- `components/ShopApi.ts` - взаимодействие с API.
- `components/base/` - базовые классы.
- `components/models/` - модели данных.
- `components/view/` - представления.
- `utils/constants.ts` - URL API, CDN и категории.
- `utils/utils.ts` - вспомогательные функции.
- `scss/styles.scss` - основные стили.

# Описание приложения

«Web-Larёk» - интернет-магазин с каталогом товаров для веб-разработчиков.

Пользователь может:

- просматривать каталог;
- открывать подробную карточку товара;
- добавлять и удалять товары из корзины;
- выбирать способ оплаты;
- указывать адрес доставки;
- вводить контактные данные;
- оформлять заказ.

# Архитектура

Приложение построено по паттерну **MVP (Model - View - Presenter)**.

### Model

Хранит и изменяет данные приложения и уведомляет об изменениях через брокер событий:

- `Products` - каталог и выбранный товар;
- `Basket` - содержимое корзины;
- `Buyer` - данные покупателя и валидация.

### View

Отвечает за отображение данных и пользовательские действия. DOM-элементы сохраняются в свойствах классов, действия пользователя передаются через события.

### Presenter

Реализован в `main.ts`. Связывает Model, View и API. Обрабатывает события, управляет отображением, оформлением заказа и взаимодействием с сервером.

Для обмена событиями используется `EventEmitter`.

# Базовые классы

## Component

Базовый абстрактный класс для View.

**Конструктор:**

```ts
protected constructor(container: HTMLElement)
```

Сохраняет корневой DOM-элемент.

**Поле:**

- `container: HTMLElement` - корневой элемент.

**Методы:**

- `render(data?: Partial<T>): HTMLElement` - через `Object.assign` вызывает сеттеры и возвращает `container`.
- `setImage(element, src, alt?)` - устанавливает изображение.

## Api

Базовый HTTP-клиент.

**Конструктор:**

```ts
constructor(baseUrl: string, options?: RequestInit)
```

**Поля:**

- `baseUrl: string` - базовый URL.
- `options: RequestInit` - настройки запросов.

**Методы:**

- `get<T>(uri)` - GET-запрос.
- `post<T>(uri, data, method?)` - POST-запрос.
- `handleResponse<T>(response)` - обработка ответа сервера.

## EventEmitter

Брокер событий, реализующий паттерн «Наблюдатель».

**Поле:**

- `_events: Map<string | RegExp, Set<Function>>` - коллекция подписок.

**Методы:**

- `on()` - подписка на событие.
- `off()` - удаление подписки.
- `emit()` - генерация события.
- `onAll()` - подписка на все события.
- `offAll()` - удаление всех подписок.
- `trigger()` - создание функции-генератора события.

# Модели данных

## Products

Хранит каталог и выбранный товар.

**Конструктор:**

```ts
constructor(events: IEvents)
```

**Поля:**

- `items: IProduct[]` - каталог.
- `selectedProduct: IProduct | null` - выбранный товар.

**Методы:**

- `setItems(items)` - сохраняет каталог и генерирует `products:changed`.
- `getItems()` - возвращает каталог.
- `getItem(id)` - ищет товар.
- `setSelected(item)` - сохраняет выбранный товар и генерирует `product:selected`.
- `getSelected()` - возвращает выбранный товар.

## Basket

Класс `Basket` хранит товары, выбранные покупателем. Один товар не может быть добавлен дважды.

**Конструктор:**

```ts
constructor(events: IEvents)
```

**Поле:**

- `items: IProduct[]` - хранит товары, добавленные в корзину.

**Методы:**

- `getItems(): IProduct[]` - возвращает товары корзины.
- `add(item: IProduct): void` - добавляет товар и генерирует `basket:changed`.
- `delete(id: string): void` - удаляет товар и генерирует `basket:changed`.
- `clear(): void` - очищает корзину и генерирует `basket:changed`.
- `getTotal(): number` - общая стоимость; товары без цены дают `0`.
- `getCount(): number` - количество товаров.
- `has(id: string): boolean` - проверяет наличие товара.

## Buyer

Хранит и валидирует данные покупателя. Поддерживает частичное обновление.

**Конструктор:**

```ts
constructor(events: IEvents)
```

**Поле:**

- `data: IBuyer` - данные покупателя.

**Методы:**

- `setData(data: Partial<IBuyer>): void` - сохраняет поля и генерирует `buyer:changed`.
- `getData(): IBuyer` - возвращает копию данных.
- `clear(): void` - сбрасывает данные и генерирует `buyer:changed`.
- `validate(fields?: (keyof IBuyer)[]): TBuyerErrors` - возвращает ошибки по полям.

# Представления

## Card

Базовый класс карточки товара, наследуется от `Component`.

**Поля:**

- `titleElement: HTMLElement` - название;
- `priceElement: HTMLElement` - цена.

**Сеттеры:**

- `set title(value: string)` - устанавливает название;
- `set price(value: number | null)` - устанавливает цену (`"Бесценно"` при `null`).

## CatalogCard

Карточка товара каталога. Наследуется от `Card<IProduct>`.

**Конструктор:**

```ts
constructor(container: HTMLElement, onClick: () => void)
```

При клике вызывает переданный колбэк (презентер захватывает `id` товара в замыкании).

**Сеттеры:** `category`, `image`.

## PreviewCard

Карточка подробного просмотра товара. Наследуется от `Card`.

**Конструктор:**

```ts
constructor(container: HTMLElement, events: IEvents)
```

При клике на кнопку генерирует `card:action`.

**Сеттеры:** `category`, `image`, `description`, `buttonText`, `buttonDisabled`.

## BasketCard

Карточка товара в корзине. Наследуется от `Card`.

**Конструктор:**

```ts
constructor(container: HTMLElement, onDelete: () => void)
```

При клике на кнопку удаления вызывает переданный колбэк.

**Сеттеры:** `index`.

## Gallery

Отображает каталог товаров.

**Сеттер:**

- `set catalog(items: HTMLElement[])` - принимает готовый массив карточек и устанавливает его через `replaceChildren(...items)`.

Карточки создаёт презентер.

## Basket (View)

Отображает товары корзины, итоговую стоимость и кнопку оформления заказа.

**Конструктор:**

```ts
constructor(container: HTMLElement, events: IEvents)
```

**Сеттеры:**

- `set items(value: HTMLElement[])` - массив карточек корзины;
- `set total(value: number)` - итоговая стоимость;
- `set buttonDisabled(value: boolean)` - состояние кнопки оформления.

При клике на кнопку генерирует `basket:checkout`.

## Header

Отображает количество товаров в корзине.

**Сеттер:** `set count(value: number)`.

При нажатии на кнопку корзины генерирует `basket:open`.

## Form

Базовый класс форм, наследуется от `Component`.

**Поля:**

- `errorsElement: HTMLElement` - блок ошибок;
- `submitButton: HTMLButtonElement` - кнопка отправки.

**Конструктор:**

```ts
constructor(container: HTMLFormElement, events: IEvents)
```

При отправке формы генерирует `<name>:submit`, где `name` - значение атрибута `name` формы.

**Сеттеры:**

- `set errors(value: string[])` - отображает ошибки;
- `set valid(value: boolean)` - управляет доступностью кнопки.

## OrderForm

Первая форма заказа. `OrderForm extends Form<IOrderForm>`.

Позволяет выбрать способ оплаты и указать адрес.

Генерирует:

- `order:payment` (с типизированным `payload: { payment: TPayment }`);
- `order:address`;
- `order:submit` (через родительский `Form`, при `name="order"`).

**Сеттеры:** `address`, `payment`.

## ContactsForm

Вторая форма заказа. `ContactsForm extends Form<IContactsForm>`.

Позволяет указать email и телефон.

Генерирует:

- `contacts:email`;
- `contacts:phone`;
- `contacts:submit` (через родительский `Form`, при `name="contacts"`).

**Сеттеры:** `email`, `phone`.

## Modal

Управляет модальным окном.

**Методы:**

- `open(content: HTMLElement)` - открывает окно и устанавливает содержимое через `replaceChildren`;
- `close()` - закрывает окно и очищает содержимое.

Закрывается кнопкой или кликом вне содержимого.

## Success

Отображает результат успешного заказа и списанную сумму.

**Сеттер:** `set total(value: number)`.

При закрытии генерирует `success:close`.

# ShopApi

Специализированный клиент API магазина. Получает `IApi` через конструктор.

**Конструктор:**

```ts
constructor(api: IApi)
```

**Методы:**

- `getProducts()` - получает каталог через `/product/`.
- `postOrder(order)` - отправляет заказ через `/order/`.

# Типы

Все основные типы находятся в `src/types/index.ts`.

- `IProduct` — данные товара (id, title, price, category, image, description).
- `IImage` — изображение товара: `{ src: string; alt: string }`.
- `ICard` — общее состояние карточки: `{ title: string; price: number | null }`.
- `ICatalogCard` — состояние карточки каталога. Расширяет `ICard`, добавляет `category` и `image`.
- `IPreviewCard` — состояние карточки превью. Расширяет `ICard`, добавляет `category`, `image`, `description`, `buttonText`, `buttonDisabled`.
- `IBasketCard` — состояние карточки корзины. Расширяет `ICard`, добавляет `index`.
- `TPayment` — способы оплаты: `"card"` или `"cash"`.
- `IBuyer` — данные покупателя: `{ payment, email, phone, address }`.
- `TBuyerErrors` — ошибки валидации покупателя (`Partial<Record<keyof IBuyer, string>>`).
- `IProductsResponse` — ответ с каталогом: `{ total, items }`.
- `IOrderRequest` — данные заказа. Расширяет `IBuyer`, добавляет `items: string[]` и `total: number`.
- `IOrderResponse` — ответ после оформления заказа: `{ id, total }`.
- `IApi` — интерфейс HTTP-клиента (`get`, `post`).
- `ApiPostMethods` — методы запросов: `"POST" | "PUT" | "DELETE"`.
- `IOrderForm` — состояние формы заказа: `{ payment, address, errors: string[], valid: boolean }`.
- `IContactsForm` — состояние формы контактов: `{ email, phone, errors: string[], valid: boolean }`.
- `IModal` — состояние модального окна: `{ content: HTMLElement }`.
- `IHeader` — состояние шапки: `{ count: number }`.
- `IBasket` — состояние корзины: `{ items: HTMLElement[], total: number, buttonDisabled: boolean }`.
- `IGallery` — состояние галереи: `{ catalog: HTMLElement[] }`.
- `ISuccess` — состояние окна успеха: `{ total: number }`.

`IProduct.price` может иметь значение `null`, если товар недоступен.

# События приложения

### Модели

| Событие            | Назначение                   |
| ------------------ | ---------------------------- |
| `products:changed` | каталог изменился            |
| `product:selected` | выбран другой товар          |
| `basket:changed`   | изменилась корзина           |
| `buyer:changed`    | изменились данные покупателя |

### Представления

| Событие           | Назначение                               |
| ----------------- | ---------------------------------------- |
| `card:select`     | выбор товара (payload `{ id }`)          |
| `card:action`     | клик по кнопке в превью товара           |
| `basket:open`     | открытие корзины                         |
| `basket:remove`   | удаление товара (payload `{ id }`)       |
| `basket:checkout` | переход к оформлению                     |
| `order:payment`   | выбор оплаты (payload `{ payment }`)     |
| `order:address`   | изменение адреса (payload `{ address }`) |
| `order:submit`    | отправка формы заказа                    |
| `contacts:email`  | изменение email (payload `{ email }`)    |
| `contacts:phone`  | изменение телефона (payload `{ phone }`) |
| `contacts:submit` | отправка формы контактов                 |
| `success:close`   | закрытие окна успеха                     |

# Оформление заказа

1. Пользователь открывает корзину.
2. Нажимает кнопку оформления.
3. Заполняет способ оплаты и адрес.
4. После успешной валидации переходит к контактным данным.
5. Заполняет email и телефон.
6. Презентер собирает данные заказа.
7. `ShopApi` отправляет заказ на сервер.
8. После успешного ответа корзина и данные покупателя очищаются.
9. Открывается окно успешного оформления заказа.
