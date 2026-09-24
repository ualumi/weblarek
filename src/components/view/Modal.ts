import { Component } from "../base/Component";

interface IModal {
  content: HTMLElement;
}

export class Modal extends Component<IModal> {
  private readonly closeButton: HTMLButtonElement;
  private readonly content: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    this.closeButton = container.querySelector(
      ".modal__close",
    ) as HTMLButtonElement;

    this.content = container.querySelector(".modal__content") as HTMLElement;

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
