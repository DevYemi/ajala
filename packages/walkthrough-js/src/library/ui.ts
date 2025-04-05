import Walkthrough from "./base";
import DefaultCard from "./defaultCard";

class UI {
  walkthrough: Walkthrough;
  card_element: HTMLElement;
  wrapper_element: HTMLElement;
  card_container_element: HTMLElement;
  overlay_element: HTMLElement;
  #default_card: DefaultCard;
  constructor(walkthrough: Walkthrough) {
    this.walkthrough = walkthrough;
    this.#default_card = new DefaultCard(walkthrough, this);
    this.wrapper_element = document.createElement("div");

    this.card_element =
      this.walkthrough.options.custom_card_element ||
      this.#default_card.element;
    this.card_container_element = document.createElement("div");
    this.overlay_element = document.createElement("div");
  }

  init() {
    if (!this.walkthrough.options.custom_card_element) {
      this.#default_card.init();
    }

    this.card_container_element.style.position = "absolute";
    this.card_container_element.style.zIndex = "10";
    this.card_container_element.style.width = "fit-content";
    this.card_container_element.style.height = "fit-content";
    this.card_container_element.classList.add("walkthrough_card_container");
    this.card_container_element.appendChild(this.card_element);

    this.overlay_element.style.position = "absolute";
    this.overlay_element.style.zIndex = "2";
    this.overlay_element.style.width = "100%";
    this.overlay_element.style.height = "100%";
    this.overlay_element.style.top = "0px";
    this.overlay_element.style.left = "0px";
    this.overlay_element.style.backgroundColor = "#000000ba";
    this.overlay_element.classList.add("walkthrough_overlay");

    this.wrapper_element.style.position = "fixed";
    this.wrapper_element.style.top = "0px";
    this.wrapper_element.style.left = "0px";
    this.wrapper_element.style.zIndex = "9999";
    this.wrapper_element.style.width = "100%";
    this.wrapper_element.style.height = "100%";
    this.wrapper_element.classList.add("walkthrough");
    this.wrapper_element.append(
      this.card_container_element,
      this.overlay_element,
    );
    document.body.appendChild(this.wrapper_element);
  }
}

export default UI;
