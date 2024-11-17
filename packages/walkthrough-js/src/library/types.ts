export interface TWalkthroughSteps {
  target: string | HTMLElement;
  title?: string;
  body?: string;
  data?: string;
  order?: number;
  skip?: boolean;
}
export interface TWalkthroughOptions {
  steps: Array<TWalkthroughSteps>;
}
