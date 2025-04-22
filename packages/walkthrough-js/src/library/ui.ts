import Walkthrough from "./base";
import Navigation from "./navigation";

class UI {
  walkthrough: Walkthrough;
  tooltip_element: HTMLElement;
  wrapper_element: HTMLElement;
  tooltip_container_element: HTMLElement;
  arrow_element: HTMLElement;
  overlay_element: SVGElement;
  overlay_cutout_el: SVGRectElement;
  next_btn: HTMLButtonElement | null;
  prev_btn: HTMLButtonElement | null;
  close_btn: HTMLButtonElement | null;
  is_default_card_element: boolean;
  navigation: Navigation;

  constructor(walkthrough: Walkthrough) {
    this.walkthrough = walkthrough;
    this.navigation = walkthrough.navigation;
    this.wrapper_element = document.createElement("div");
    this.is_default_card_element = false;
    this.tooltip_element =
      this.walkthrough.options.custom_tooltip || document.createElement("div");
    this.tooltip_container_element = document.createElement("div");
    this.overlay_element = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg",
    );
    this.overlay_cutout_el = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect",
    );
    this.arrow_element = document.createElement("div");
    this.next_btn = null;
    this.prev_btn = null;
    this.close_btn = null;
  }

  init() {
    if (!this.walkthrough.options.custom_tooltip) {
      this.#setUpDefaultTooltip();
    }

    if (this.walkthrough.options.custom_arrow) {
      this.arrow_element.appendChild(this.walkthrough.options.custom_arrow);
    } else {
      this.#setupDefaultArrow();
    }

    const arrow_size = this.walkthrough.options.default_arrow_options?.size
      ? `${this.walkthrough.options.default_arrow_options?.size}px`
      : "48px";
    this.arrow_element.style.position = "absolute";
    this.arrow_element.style.width = arrow_size;
    this.arrow_element.style.height = arrow_size;
    this.arrow_element.style.top = "0px";
    this.arrow_element.style.left = "0px";
    this.arrow_element.style.fill =
      this.walkthrough.options.default_arrow_options?.color || "#ffffff";
    this.arrow_element.style.zIndex = "2";
    this.arrow_element.style.pointerEvents = "none";
    this.arrow_element.classList.add("walkthrough_tooltip_arrow");

    if (!this.walkthrough.options.default_arrow_options?.hide) {
      this.tooltip_container_element.appendChild(this.arrow_element);
    }

    this.tooltip_container_element.style.position = "fixed";
    this.tooltip_container_element.style.top = "0px";
    this.tooltip_container_element.style.left = "0px";
    this.tooltip_container_element.style.zIndex = "20";
    this.tooltip_container_element.style.width = "fit-content";
    this.tooltip_container_element.style.height = "fit-content";
    this.tooltip_container_element.style.pointerEvents = "auto";
    this.tooltip_container_element.classList.add(
      "walkthrough_tooltip_container",
    );
    this.tooltip_container_element.appendChild(this.tooltip_element);
    this.tooltip_container_element.style.transform = `translate(0px, 0px)`;

    this.overlay_element.style.position = "fixed";
    this.overlay_element.style.zIndex = "10";
    this.overlay_element.style.top = "0px";
    this.overlay_element.style.left = "0px";
    this.overlay_element.style.width = "100vw";
    this.overlay_element.style.height = "100vh";
    this.overlay_element.style.pointerEvents = "none";
    this.overlay_element.classList.add("walkthrough_overlay");

    this.wrapper_element.style.position = "fixed";
    this.wrapper_element.style.top = "0px";
    this.wrapper_element.style.left = "0px";
    this.wrapper_element.style.zIndex = "9999999";
    this.wrapper_element.classList.add("walkthrough");
    this.wrapper_element.append(this.tooltip_container_element);

    const styleElement = document.createElement("style");
    styleElement.innerHTML = `
    .walkthrough_isOverlay.walkthrough_active  * {
     pointer-events: none;
     }
     .walkthrough_target, .walkthrough_target  * {
     pointer-events: auto !important;
     }
     
     .walkthrough_tooltip_container  * {
     pointer-events: auto !important;
     }

     .walkthrough_tooltip_arrow, .walkthrough_tooltip_arrow  * {
      pointer-events: none !important;
     }
    
     `;
    document.head.appendChild(styleElement);

    if (
      typeof this.walkthrough.options.overlay_options?.hide === "undefined" ||
      !this.walkthrough.options.overlay_options?.hide
    ) {
      this.#setupOverlay();
      this.wrapper_element.append(this.overlay_element);
      document.body.classList.add("walkthrough_isOverlay");
    }
  }

  #setUpDefaultTooltip() {
    this.is_default_card_element = true;
    const default_options = this.walkthrough.options.default_tooltip_options;

    this.tooltip_element.classList.add("walkthrough_tooltip");

    let dot_navs_element = "";
    for (let i = 0; i < this.walkthrough.original_steps.length; i++) {
      dot_navs_element = `${dot_navs_element} <div class="walkthrough_dot_nav"></div>
      `;
    }
    this.tooltip_element.innerHTML = ` 
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
          <h3 class="walkthrough_title">${this.walkthrough.active_step?.title}</h3>
          <p class="walkthrough_content">
            ${this.walkthrough.active_step?.content}
          </p>
          <div class="walkthrough_footer">
            <button class="walkthrough_btn_prev">Prev</button>
            <button class="walkthrough_btn_next">Next</button>
          </div>`;

    this.next_btn = this.tooltip_element.querySelector<HTMLButtonElement>(
      ".walkthrough_btn_next",
    );
    this.prev_btn = this.tooltip_element.querySelector<HTMLButtonElement>(
      ".walkthrough_btn_prev",
    );
    this.close_btn = this.tooltip_element.querySelector<HTMLButtonElement>(
      ".walkthrough_close_btn",
    );
    if (default_options?.class_name) {
      this.tooltip_element.classList.add(default_options.class_name);
    }
    if (default_options?.hide_header) {
      this.tooltip_element.querySelector(".walkthrough_header")?.remove();
    }
    if (default_options?.hide_dot_nav) {
      this.tooltip_element.querySelector(".walkthrough_dot_navs")?.remove();
    }
    if (default_options?.hide_footer) {
      this.tooltip_element.querySelector(".walkthrough_footer")?.remove();
    }

    if (default_options?.hide_title) {
      this.tooltip_element.querySelector(".walkthrough_title")?.remove();
    }
    if (default_options?.hide_content) {
      this.tooltip_element.querySelector(".walkthrough_content")?.remove();
    }
    if (default_options?.hide_close_btn) {
      this.close_btn?.remove();
    }
    if (default_options?.hide_prev_btn) {
      this.prev_btn?.remove();
    }
    if (default_options?.hide_next_btn) {
      this.next_btn?.remove();
    }

    this.next_btn?.addEventListener("click", this.navigation.next);
    this.prev_btn?.addEventListener("click", this.navigation.prev);
    this.close_btn?.addEventListener("click", this.navigation.close);
  }

  #setupDefaultArrow() {
    const size = this.walkthrough.options.default_arrow_options?.size
      ? `${this.walkthrough.options.default_arrow_options?.size}px`
      : "48px";

    this.arrow_element.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" height="${size}" viewBox="0 -960 960 960" width="${size}" fill="inherit"><path d="M321.54-394.5q-10.19 0-16.53-6.96-6.34-6.95-6.34-15.91 0-2.48 6.96-15.91l150.5-150.5q5.48-5.48 11.32-7.72 5.83-2.24 12.55-2.24 6.72 0 12.55 2.24 5.84 2.24 11.32 7.72l150.5 150.5q3.48 3.48 5.22 7.45 1.74 3.98 1.74 8.46 0 8.96-6.34 15.91-6.34 6.96-16.53 6.96H321.54Z"/></svg>
    `;
  }

  #setupOverlay() {
    const opacity =
      this.walkthrough.options.overlay_options?.opacity?.toString() || " 0.7";
    const color = this.walkthrough.options.overlay_options?.color || " black";

    this.overlay_element.setAttribute("xmlns", "http://www.w3.org/2000/svg");

    // Create mask element
    const mask_element = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "mask",
    );
    mask_element.setAttribute("id", "walkthrough_cutout_mask");

    // Create white background for mask
    const mask_background = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect",
    );
    mask_background.setAttribute("width", "100%");
    mask_background.setAttribute("height", "100%");
    mask_background.setAttribute("fill", "white");

    // Create cutout rectangle
    this.overlay_cutout_el.setAttribute("x", "0");
    this.overlay_cutout_el.setAttribute("y", "0");
    this.overlay_cutout_el.setAttribute("width", "0");
    this.overlay_cutout_el.setAttribute("height", "0");
    this.overlay_cutout_el.setAttribute("rx", "0");
    this.overlay_cutout_el.setAttribute("ry", "0");
    this.overlay_cutout_el.setAttribute("fill", "black");

    // Add elements to mask
    mask_element.appendChild(mask_background);
    mask_element.appendChild(this.overlay_cutout_el);

    // Create overlay rectangle that will use the mask
    const overlay_rect = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect",
    );
    overlay_rect.setAttribute("width", "100%");
    overlay_rect.setAttribute("height", "100%");
    overlay_rect.setAttribute("fill", color);
    overlay_rect.setAttribute("opacity", opacity);
    overlay_rect.setAttribute("mask", "url(#walkthrough_cutout_mask)");
    overlay_rect.style.pointerEvents = "none";

    // Assemble the SVG
    this.overlay_element.appendChild(mask_element);
    this.overlay_element.appendChild(overlay_rect);
  }

  resetOverlayCutoutSvgRect() {
    this.overlay_cutout_el.setAttribute("x", "0");
    this.overlay_cutout_el.setAttribute("y", "0");
    this.overlay_cutout_el.setAttribute("width", "0");
    this.overlay_cutout_el.setAttribute("height", "0");
    this.overlay_cutout_el.setAttribute("rx", "0");
    this.overlay_cutout_el.setAttribute("ry", "0");

    const target_el = this.getTargetElement(
      this.walkthrough.flatten_steps[this.walkthrough.active_step_index].target,
    );

    if (target_el) {
      target_el.classList.remove("walkthrough_target");
    }
  }

  getTargetElement(target_string?: string) {
    const element = document.querySelector<HTMLElement>(target_string || "");
    if (!target_string) {
      console.warn(
        `Please provide a selectors for walkthrough step with id ${this.walkthrough.active_step?.id}`,
      );
    }
    if (!element && target_string) {
      console.warn(
        `walkthrough coundn't find element with selector ${target_string}`,
      );
    }

    return element;
  }

  start() {
    document.body.style.overflow = "hidden";
    document.body.appendChild(this.wrapper_element);
    document.body.classList.add("walkthrough_active");
    const tooltip_rect = this.tooltip_container_element.getBoundingClientRect();
    this.tooltip_container_element.style.transform = `translate(-${tooltip_rect.width}px, 0px)`;
  }

  destroy() {
    document.body.style.overflow = "auto";
    document.body.removeChild(this.wrapper_element);
    document.body.classList.remove("walkthrough_active");
  }

  cleanUp() {
    this.next_btn?.removeEventListener("click", this.navigation.next);
    this.prev_btn?.removeEventListener("click", this.navigation.prev);
    this.close_btn?.removeEventListener("click", this.navigation.close);
  }
}

export default UI;
