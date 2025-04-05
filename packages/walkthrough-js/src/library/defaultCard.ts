import Walkthrough from "@/library/base";
import UI from "./ui";

class DefaultCard {
  #walkthrough: Walkthrough;
  ui: UI;
  is_default_card_element: boolean;
  element: HTMLElement;
  constructor(walkthrough: Walkthrough, ui: UI) {
    this.#walkthrough = walkthrough;
    this.ui = ui;
    this.is_default_card_element = false;
    this.element = document.createElement("div");
  }

  init() {
    this.is_default_card_element = true;
    const default_options =
      this.#walkthrough.options.default_card_element_options;

    this.element.classList.add("walkthrough_card");

    let dot_navs_element = "";
    for (let i = 0; i < this.#walkthrough.options.steps.length; i++) {
      dot_navs_element = `${dot_navs_element} <div class="walkthrough_dot_nav"></div>
      `;
    }
    this.element.innerHTML = ` 
          <div class="walkthrough_header">
            <div class="walkthrough_dot_navs">
              <div class="walkthrough_dot_nav walkthrough_dot_nav-active"></div>
              ${dot_navs_element}
            </div>
            <button class="walkthrough_close_btn">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style="mask-type: alpha"
              >
                <g mask="url(#mask0_1118_8374)">
                  <path
                    d="M12.3 13.3465L7.26226 18.3842C7.12478 18.5217 6.95196 18.592 6.7438 18.5952C6.53566 18.5984 6.35967 18.5281 6.21581 18.3842C6.07194 18.2403 6 18.0659 6 17.861C6 17.656 6.07194 17.4816 6.21581 17.3377L11.2535 12.3L6.21581 7.26226C6.07831 7.12478 6.00797 6.95196 6.00479 6.7438C6.0016 6.53566 6.07194 6.35967 6.21581 6.21581C6.35967 6.07194 6.53408 6 6.73904 6C6.944 6 7.11841 6.07194 7.26226 6.21581L12.3 11.2535L17.3377 6.21581C17.4752 6.07831 17.648 6.00797 17.8562 6.00479C18.0643 6.0016 18.2403 6.07194 18.3842 6.21581C18.5281 6.35967 18.6 6.53408 18.6 6.73904C18.6 6.944 18.5281 7.11841 18.3842 7.26226L13.3465 12.3L18.3842 17.3377C18.5217 17.4752 18.592 17.648 18.5952 17.8562C18.5984 18.0643 18.5281 18.2403 18.3842 18.3842C18.2403 18.5281 18.0659 18.6 17.861 18.6C17.656 18.6 17.4816 18.5281 17.3377 18.3842L12.3 13.3465Z"
                    fill="currentColor"
                  />
                </g>
              </svg>
            </button>
          </div>
          <h3 class="walkthrough_title">Hello World, my people</h3>
          <p class="walkthrough_content">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores,
            labore ullam fugit odio a dolor ab aperiam error! Incidunt eveniet
            quasi voluptates, sint porro eligendi ducimus nostrum culpa
            excepturi accusamus.
          </p>
          <div class="walkthrough_footer">
            <button class="walkthrough_btn_prev">Prev</button>
            <button class="walkthrough_btn_next">Next</button>
          </div>`;

    if (default_options?.class_name) {
      this.element.classList.add(default_options.class_name);
    }
    if (default_options?.hide_header) {
      this.element.querySelector(".walkthrough_header")?.remove();
    }
    if (default_options?.hide_close_btn) {
      this.element.querySelector(".walkthrough_close_btn")?.remove();
    }
    if (default_options?.hide_dot_nav) {
      this.element.querySelector(".walkthrough_dot_navs")?.remove();
    }
    if (default_options?.hide_footer) {
      this.element.querySelector(".walkthrough_footer")?.remove();
    }
    if (default_options?.hide_prev_btn) {
      this.element.querySelector(".walkthrough_btn_prev")?.remove();
    }
    if (default_options?.hide_next_btn) {
      this.element.querySelector(".walkthrough_btn_next")?.remove();
    }
    if (default_options?.hide_title) {
      this.element.querySelector(".walkthrough_title")?.remove();
    }
    if (default_options?.hide_content) {
      this.element.querySelector(".walkthrough_content")?.remove();
    }
  }
}

export default DefaultCard;
