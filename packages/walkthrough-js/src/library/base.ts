import { TWalkthroughOptions, TWalkthroughSteps } from "./types";

class Walkthrough {
  options: TWalkthroughOptions;
  executedSteps: Array<TWalkthroughSteps>;
  constructor(options: TWalkthroughOptions) {
    this.options = options;
    this.executedSteps = [];
  }

  init() {
    this.#start();
  }

  #start() {}
}

export default Walkthrough;
