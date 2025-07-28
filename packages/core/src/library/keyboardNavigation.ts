import { AjalaJourney } from "./main";
import { TKeyboardNavigationOptions } from "./types";

export class KeyboardNavigation {
  private ajala: AjalaJourney;
  private options: TKeyboardNavigationOptions;
  private isEnabled: boolean = false;

  constructor(ajala: AjalaJourney, options: TKeyboardNavigationOptions = {}) {
    this.ajala = ajala;
    this.options = {
      enabled: true,
      nextKeys: ["ArrowRight", "Enter", " ", "Spacebar"],
      prevKeys: ["ArrowLeft"],
      closeKeys: ["Escape"],
      ...options,
    };
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  start() {
    if (!this.options.enabled || this.isEnabled) return;
    window.addEventListener("keydown", this.handleKeyDown, true);
    this.isEnabled = true;
  }

  destroy() {
    if (!this.isEnabled) return;
    window.removeEventListener("keydown", this.handleKeyDown, true);
    this.isEnabled = false;
  }

  private handleKeyDown(event: KeyboardEvent) {
    // Ignore if focus is on an input, textarea, or contenteditable
    const active = document.activeElement;
    if (
      active &&
      (active.tagName === "INPUT" ||
        active.tagName === "TEXTAREA" ||
        (active as HTMLElement).isContentEditable)
    ) {
      return;
    }
    if (!this.ajala.is_active) return;
    if (this.options.nextKeys?.includes(event.key)) {
      event.preventDefault();
      this.ajala.next();
    } else if (this.options.prevKeys?.includes(event.key)) {
      event.preventDefault();
      this.ajala.prev();
    } else if (this.options.closeKeys?.includes(event.key)) {
      event.preventDefault();
      this.ajala.destroy();
    }
  }
}
