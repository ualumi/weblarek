import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";
import { IHeader } from "../../types";

export class Header extends Component<IHeader> {
  private readonly basketButton: HTMLButtonElement;
  private readonly basketCounter: HTMLElement;

  constructor(
    container: HTMLElement,
    private readonly events: IEvents,
  ) {
    super(container);

    this.basketButton = ensureElement<HTMLButtonElement>(
      ".header__basket",
      container,
    );

    this.basketCounter = ensureElement<HTMLElement>(
      ".header__basket-counter",
      container,
    );

    this.basketButton.addEventListener("click", () => {
      this.events.emit("basket:open");
    });
  }

  set count(value: number) {
    this.basketCounter.textContent = String(value);
  }
}
