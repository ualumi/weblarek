import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IModal } from "../../types";

export class Modal extends Component<IModal> {
  private readonly closeButton: HTMLButtonElement;
  private readonly content: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    this.closeButton = ensureElement<HTMLButtonElement>(
      ".modal__close",
      container,
    );

    this.content = ensureElement<HTMLElement>(".modal__content", container);

    this.closeButton.addEventListener("click", () => {
      this.close();
    });

    this.container.addEventListener("click", (event) => {
      if (event.target === this.container) {
        this.close();
      }
    });
  }

  open(content: HTMLElement): void {
    this.content.replaceChildren(content);
    this.container.classList.add("modal_active");
  }

  close(): void {
    this.container.classList.remove("modal_active");
    this.content.replaceChildren();
  }
}
