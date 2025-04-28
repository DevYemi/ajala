import { createDebounceFunc } from "../utils/chunks";
import { AjalaJourney } from "./main";
import Navigation from "./navigation";
import Placement from "./placement";
import { TTravelDistanceData } from "./types";

class UI {
  ajala: AjalaJourney;
  tooltip_element: HTMLElement;
  wrapper_element: HTMLElement;
  tooltip_container_element: HTMLElement;
  arrow_element: HTMLElement;
  overlay_element: SVGElement;
  overlay_path: SVGPathElement;
  next_btn: HTMLButtonElement | null;
  prev_btn: HTMLButtonElement | null;
  close_btn: HTMLButtonElement | null;
  is_default_tooltip_element: boolean;
  navigation?: Navigation;
  placement?: Placement;

  constructor(ajala: AjalaJourney) {
    this.ajala = ajala;
    this.wrapper_element = document.createElement("div");
    this.is_default_tooltip_element = false;
    this.tooltip_element =
      this.ajala.options.custom_tooltip || document.createElement("div");
    this.tooltip_container_element = document.createElement("div");
    this.overlay_element = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg",
    );
    this.overlay_path = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path",
    );
    this.arrow_element = document.createElement("div");
    this.next_btn = null;
    this.prev_btn = null;
    this.close_btn = null;

    this.closeOnOverlayClickHandler =
      this.closeOnOverlayClickHandler.bind(this);

    this.refresh = createDebounceFunc(this.refresh.bind(this), 200) as any;
  }

  init() {
    this.tooltip_element =
      this.ajala.options.custom_tooltip || document.createElement("div");
    this.tooltip_container_element = document.createElement("div");
    this.next_btn = null;
    this.prev_btn = null;
    this.close_btn = null;

    this.overlay_path.addEventListener(
      "click",
      this.closeOnOverlayClickHandler,
    );

    window.addEventListener("resize", this.refresh);

    this.overlay_path.addEventListener(
      "click",
      this.closeOnOverlayClickHandler,
    );

    if (!this.ajala.options.custom_tooltip) {
      this.#setUpDefaultTooltip();
    }

    if (this.ajala.options.custom_arrow) {
      this.arrow_element.appendChild(this.ajala.options.custom_arrow);
    } else {
      this.#setupDefaultArrow();
    }

    const arrow_size = this.ajala.options.default_arrow_options?.size
      ? `${this.ajala.options.default_arrow_options?.size}px`
      : "48px";
    this.arrow_element.style.position = "absolute";
    this.arrow_element.style.width = arrow_size;
    this.arrow_element.style.height = arrow_size;
    this.arrow_element.style.top = "0px";
    this.arrow_element.style.left = "0px";
    this.arrow_element.style.fill =
      this.ajala.options.default_arrow_options?.color || "#000000";
    this.arrow_element.style.zIndex = "2";
    this.arrow_element.style.pointerEvents = "none";
    this.arrow_element.classList.add("ajala_tooltip_arrow");

    if (!this.ajala.options.default_arrow_options?.hide) {
      this.tooltip_container_element.appendChild(this.arrow_element);
    }

    this.tooltip_container_element.style.position = "fixed";
    this.tooltip_container_element.style.top = "0px";
    this.tooltip_container_element.style.left = "0px";
    this.tooltip_container_element.style.zIndex = "20";
    this.tooltip_container_element.style.width = this.ajala.options
      ?.tooltip_width
      ? `${this.ajala.options?.tooltip_width}px`
      : "250px";
    this.tooltip_container_element.style.height = this.ajala.options
      ?.tooltip_height
      ? `${this.ajala.options?.tooltip_height}px`
      : "180px";
    this.tooltip_container_element.style.pointerEvents = "auto";
    this.tooltip_container_element.classList.add("ajala_tooltip_container");
    this.tooltip_container_element.appendChild(this.tooltip_element);
    this.tooltip_container_element.style.transform = `translate(0px, 0px)`;

    this.wrapper_element.style.position = "fixed";
    this.wrapper_element.style.top = "0px";
    this.wrapper_element.style.left = "0px";
    this.wrapper_element.style.zIndex = "9999999";
    this.wrapper_element.classList.add("ajala");
    this.wrapper_element.append(this.tooltip_container_element);

    const styleElement = document.createElement("style");
    styleElement.innerHTML = `
    .ajala_isOverlay.ajala_active  * {
     pointer-events: none;
     }
     .ajala_target_interactive, .ajala_target_interactive  * {
     pointer-events: auto !important;
     }
     
     .ajala_tooltip_container  * {
     pointer-events: auto !important;
     }

     .ajala_tooltip_arrow, .ajala_tooltip_arrow  * {
      pointer-events: none !important;
     }
    
     `;
    document.head.appendChild(styleElement);

    if (
      typeof this.ajala.options.overlay_options?.hide === "undefined" ||
      !this.ajala.options.overlay_options?.hide
    ) {
      this.#setupOverlay();
      this.wrapper_element.append(this.overlay_element);
      document.body.classList.add("ajala_isOverlay");
    }
  }

  #setUpDefaultTooltip() {
    this.is_default_tooltip_element = true;
    const default_options = this.ajala.options.default_tooltip_options;

    this.tooltip_element.classList.add("ajala_tooltip");

    let dot_navs_element = "";
    for (let i = 0; i < this.ajala.original_steps.length; i++) {
      dot_navs_element = `${dot_navs_element} <div class="ajala_dot_nav"></div>
      `;
    }
    this.tooltip_element.innerHTML = ` 
          <div class="ajala_header">
            <div class="ajala_dot_navs">
              ${dot_navs_element}
            </div>
            <button class="ajala_close_btn">
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
          <h3 class="ajala_title">${this.ajala.active_step?.title}</h3>
          <p class="ajala_content">
            ${this.ajala.active_step?.content}
          </p>
          <div class="ajala_footer">
            <button class="ajala_btn_prev">Prev</button>
            <button class="ajala_btn_next">Next</button>
          </div>`;

    this.next_btn =
      this.tooltip_element.querySelector<HTMLButtonElement>(".ajala_btn_next");
    this.prev_btn =
      this.tooltip_element.querySelector<HTMLButtonElement>(".ajala_btn_prev");
    this.close_btn =
      this.tooltip_element.querySelector<HTMLButtonElement>(".ajala_close_btn");
    if (default_options?.class_name) {
      this.tooltip_element.classList.add(default_options.class_name);
    }
    if (default_options?.hide_dot_nav) {
      this.tooltip_element.querySelector(".ajala_dot_navs")?.remove();
    }

    if (default_options?.hide_title) {
      this.tooltip_element.querySelector(".ajala_title")?.remove();
    }
    if (default_options?.hide_content) {
      this.tooltip_element.querySelector(".ajala_content")?.remove();
    }
    if (default_options?.hide_close_btn) {
      this.close_btn?.remove();
    }
  }

  #setupDefaultArrow() {
    const size = this.ajala.options.default_arrow_options?.size
      ? `${this.ajala.options.default_arrow_options?.size}px`
      : "48px";

    this.arrow_element.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" height="${size}" viewBox="0 -960 960 960" width="${size}" fill="inherit"><path d="M321.54-394.5q-10.19 0-16.53-6.96-6.34-6.95-6.34-15.91 0-2.48 6.96-15.91l150.5-150.5q5.48-5.48 11.32-7.72 5.83-2.24 12.55-2.24 6.72 0 12.55 2.24 5.84 2.24 11.32 7.72l150.5 150.5q3.48 3.48 5.22 7.45 1.74 3.98 1.74 8.46 0 8.96-6.34 15.91-6.34 6.96-16.53 6.96H321.54Z"/></svg>
    `;
  }

  #setupOverlay() {
    const opacity =
      this.ajala.options.overlay_options?.opacity?.toString() || " 0.7";
    const color = this.ajala.options.overlay_options?.color || " black";

    this.overlay_element.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    this.overlay_element.style.position = "fixed";
    this.overlay_element.style.zIndex = "10";
    this.overlay_element.style.top = "0px";
    this.overlay_element.style.left = "0px";
    this.overlay_element.style.width = "100vw";
    this.overlay_element.style.height = "100vh";
    this.overlay_element.style.pointerEvents = "none";
    this.overlay_element.classList.add("ajala_overlay");

    // Create path element
    this.overlay_path.style.pointerEvents = "auto";
    this.updateOverlayCutoutPathData({
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      border_radius: 0,
    });

    this.overlay_path.style.fill = color;
    this.overlay_path.style.opacity = opacity;

    // Assemble the SVG
    this.overlay_element.appendChild(this.overlay_path);
  }

  update(distance_option: TTravelDistanceData) {
    const { active_index, placement, taregt_el } = distance_option;
    const default_options = this.ajala.options.default_tooltip_options;

    if (this.is_default_tooltip_element) {
      // Update default ui display
      if (!default_options?.hide_dot_nav) {
        const ajala_dot_navs =
          document.querySelectorAll<HTMLElement>(".ajala_dot_nav");
        ajala_dot_navs.forEach((item) => {
          item.classList.remove("ajala_dot_nav_active");
        });
        ajala_dot_navs[this.ajala.getActiveStepFlattenIndex()].classList.add(
          "ajala_dot_nav_active",
        );
      }
      if (!default_options?.hide_title) {
        const ajala_title = document.querySelector<HTMLElement>(".ajala_title");
        if (ajala_title) {
          ajala_title.innerText = this.ajala.active_step?.title ?? "";
        }
      }
      if (!default_options?.hide_content) {
        const ajala_content =
          document.querySelector<HTMLElement>(".ajala_content");
        if (ajala_content) {
          ajala_content.innerText = this.ajala.active_step?.content ?? "";
        }
      }
    }

    // Update target interactivity
    const enable_target_interaction =
      this.ajala.active_step?.enable_target_interaction ??
      this.ajala.options?.enable_target_interaction;

    if (enable_target_interaction && taregt_el) {
      taregt_el.classList.add("ajala_target_interactive");
    }

    // Update Next btn label on last step
    if (
      this.ajala.flatten_steps.length - 1 ===
        this.ajala.getActiveStepFlattenIndex() &&
      this.next_btn
    ) {
      this.next_btn.innerText = "Finish";
    }

    // Update Arrow UI placement

    if (taregt_el) {
      const { x, y, rotate } = this.placement!.arrow.calculatePlacmentDelta({
        active_index,
        placement,
      });
      this.arrow_element.style.visibility = "visible";
      this.arrow_element.style.transform = `translate(${x}px, ${y}px) rotate(${rotate}deg)`;
    } else {
      this.arrow_element.style.visibility = "hidden";
    }
  }

  updateOverlayCutoutPathData({
    x,
    y,
    height,
    width,
    border_radius,
  }: {
    x: number;
    y: number;
    width: number;
    height: number;
    border_radius: number;
  }) {
    // Create rounded rectangle path data
    const roundedRectPath = `
  M${x + border_radius},${y}
  h${Math.max(width - 2 * border_radius, 0)}
  a${border_radius},${border_radius} 0 0 1 ${border_radius},${border_radius}
  v${Math.max(height - 2 * border_radius, 0)}
  a${border_radius},${border_radius} 0 0 1 -${border_radius},${border_radius}
  h-${Math.max(width - 2 * border_radius, 0)}
  a${border_radius},${border_radius} 0 0 1 -${border_radius},-${border_radius}
  v-${Math.max(height - 2 * border_radius, 0)}
  a${border_radius},${border_radius} 0 0 1 ${border_radius},-${border_radius}
  z
`;

    // Create the full path (overlay + cutout)
    const pathData = `
  M${window.innerWidth},0 L0,0 L0,${window.innerHeight} L${window.innerWidth},${window.innerHeight} L${window.innerWidth},0 Z
  ${roundedRectPath}
`;

    this.overlay_path.setAttribute("d", pathData);
  }

  resetOverlayCutoutSvgRect() {
    this.updateOverlayCutoutPathData({
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      border_radius: 0,
    });

    const target_el = this.getTargetElement(
      this.ajala.flatten_steps[this.ajala.getActiveStepFlattenIndex()].target,
    );

    if (target_el) {
      target_el.classList.remove("ajala_target_interactive");
    }
  }

  getTargetElement(target_string?: string) {
    const element = document.querySelector<HTMLElement>(target_string || "");
    if (!target_string) {
      console.warn(
        `Please provide a selectors for ajala step with id ${this.ajala.active_step?.id}`,
      );
    }
    if (!element && target_string) {
      console.warn(
        `ajala coundn't find element with selector ${target_string}`,
      );
    }

    return element;
  }

  start() {
    this.wrapper_element.remove();
    document.body.classList.remove("ajala_active");

    document.body.style.overflow = "hidden";
    document.body.appendChild(this.wrapper_element);

    this.ajala.dispatchEvent({
      type: "onDomInsert",
      data: {
        wrapper_element: this.wrapper_element,
        tooltip_container_element: this.tooltip_container_element,
        arrow_element: this.arrow_element,
        self: this.ajala,
      },
    });

    document.body.classList.add("ajala_active");
    const tooltip_rect = this.tooltip_container_element.getBoundingClientRect();
    this.tooltip_container_element.style.transform = `translate(-${tooltip_rect.width}px, 0px)`;
    this.resetOverlayCutoutSvgRect();
    if (this.next_btn) {
      this.next_btn.innerText = "Next";
    }

    if (this.navigation) {
      this.next_btn?.addEventListener("click", this.navigation.next);
      this.prev_btn?.addEventListener("click", this.navigation.prev);
      this.close_btn?.addEventListener("click", this.navigation.close);
    }
  }

  closeOnOverlayClickHandler() {
    const should_close =
      this.ajala.active_step?.enable_overlay_close ??
      this.ajala.options.enable_overlay_close;

    if (should_close) {
      this.ajala.destroy();
    }
  }

  async refresh() {
    const recalaculate = () => {
      const active_id = this.ajala.getActiveStep()?.id;
      if (active_id) {
        this.ajala.goToStep(active_id);
      }
    };
    recalaculate();

    /**
     * Incase the calculation is off or wrong due to refresh being called right before another resize happens.
     * leave a 1 sec timeout to self correct this.
     */
    setTimeout(recalaculate, 1000);
  }

  destroy() {
    document.body.style.overflow = "auto";
    document.body.classList.remove("ajala_active");

    if (this.ajala.is_active) {
      document.body.removeChild(this.wrapper_element);

      this.ajala.dispatchEvent({
        type: "onDomRemove",
        data: {
          wrapper_element: this.wrapper_element,
          tooltip_container_element: this.tooltip_container_element,
          arrow_element: this.arrow_element,
          self: this.ajala,
        },
      });
    }
  }

  cleanUp() {
    if (this.navigation) {
      this.next_btn?.removeEventListener("click", this.navigation.next);
      this.prev_btn?.removeEventListener("click", this.navigation.prev);
      this.close_btn?.removeEventListener("click", this.navigation.close);
    }
    this.overlay_path.removeEventListener(
      "click",
      this.closeOnOverlayClickHandler,
    );
    window.removeEventListener("resize", this.refresh);
  }
}

export default UI;
