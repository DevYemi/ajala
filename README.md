# Àjàlá.js

**Your soon to be favourite walkthrough partner.**

<p align="center">
  <b> A lightweight yet powerful vanilla JavaScript engine that guides user focus, providing a smooth transition experience across your webpage. </b></br>
  <sub>No external dependencies, fully customizable, mobile responsive, works in all major browsers, and easy to tweak for your needs. </sub><br>
</p>

<br />

- **Simple**: is simple to use and has no external dependency at all
- **Light-weight**: is just 7kb gzipped.
- **Highly customizable**: you can pass your own custom tooltip element, custom arrow, customize each step state value at different screen size etc, all this with a powerful API.
- **TypeScript**: Written in TypeScript
- **Consistent behavior**: usable across all browsers
- **MIT Licensed**: free for personal and commercial use

<br />

## Quick start

```ts
import { AjalaJourney } from "ajala.js";
import "ajala.js/dist/ajala.css";

const ajala_journey = new AjalaJourney([
  {
    target: ".step_1",
    id: "1",
  },
  {
    target: {
      default: ".step_2",
      "(min-width: 700px)": ".step_3",
      "(min-width: 1200px)": ".step_4",
    },
    id: "3",
  },
]);

ajala_journey.init();
```

**Please note:** That you only need `import "ajala.js/dist/ajala.css";` when you are using ajala default tooltip, you don't need it if you provide your own custom tooltip

`AjalaJourney` class accept two arguments, an array of steps object which is compulsory and the journey options that's used to customize the jounery experience globally.

## Ajala Step Shape

An array of the object with the following property.

> **Please note:** That majority of this property could also be customize globally in the [Ajala Options Shape](https://github.com/DevYemi/ajala?tab=readme-ov-file#ajala-options-shape) but property passed in ajala step takes precedence.

| Property                  | Type                                                                                                                                                                                 | Description                                                                                                                                                                                                                                                                                                                                          |
| :------------------------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id                        | string                                                                                                                                                                               | A unique id string, this is required property but if one is not passed then it's automatically generated for you internally.                                                                                                                                                                                                                         |
| target                    | string                                                                                                                                                                               | Any query selector string that could be passed to `document.queryselector` to access an element on the dom.                                                                                                                                                                                                                                          |
| title                     | string                                                                                                                                                                               | A string value that's used as the ajala journey title in the default tooltip.                                                                                                                                                                                                                                                                        |
| content                   | string                                                                                                                                                                               | A string value that's used as the ajala journey body in the default tooltip.                                                                                                                                                                                                                                                                         |
| data                      | any                                                                                                                                                                                  | This could be any custom value that you want each ajala step to have, this could come really handy when you are using a custom tooltip.                                                                                                                                                                                                              |
| order                     | number                                                                                                                                                                               | By default ajala displays the journey steps based on the arrangement of of the steps array, this property allows you customize the order in which the steps are display, please note that it starts from an index 0.                                                                                                                                 |
| skip                      | boolean                                                                                                                                                                              | By default ajala displays all step provided, this property allows you skip a particular step. Becomes very power when you combine it with [Responsive Step shape](https://github.com/DevYemi/ajala?tab=readme-ov-file#responsive-ajala-step).                                                                                                        |
| tooltip_gutter            | number                                                                                                                                                                               | This adds a gap or padding between the tooltip card and the target element.                                                                                                                                                                                                                                                                          |
| spotlight_border_radius   | number                                                                                                                                                                               | This helps add a border-radius around the highlighted target element on the viewport.                                                                                                                                                                                                                                                                |
| spotlight_padding         | number                                                                                                                                                                               | This helps add a padding on the highlighted target element on the viewport.                                                                                                                                                                                                                                                                          |
| scroll_duration           | number                                                                                                                                                                               | By default ajala hijack the viewport scroll while the journey is active, this property help customize the scrolling duration, value must be in milliseconds, default value is `1000`.                                                                                                                                                                |
| transition_duration       | number                                                                                                                                                                               | This helps customize ajala transitioning between steps duration, value must be in milliseconds, default value is `1000`.                                                                                                                                                                                                                             |
| enable_target_interaction | boolean                                                                                                                                                                              | By default highlighted spotlight target are not clickable                                                                                                                                                                                                                                                                                            |
| enable_overlay_close      | boolean                                                                                                                                                                              | By default ajala doesn't close the journey when the overlay is clicked, passing `true` to this property make sure ajala journey finishes when the overlay is clicked.                                                                                                                                                                                |
| tooltip_placement         | `top_left`, `top_center`, `top_right`, `bottom_left`, `bottom_center`, `bottom_right`, `left_top`, `left_bottom`, `left_center`, `right_top`, `right_bottom`, `right_center`, `auto` | This helps customize where the tooltip should be placed on the spotlight element. Default value is `auto` which means ajala calculate the best placement for the tooltip. Please note that if you pass a value aside `auto` and ajala discover that the tooltip will be out-of-user-view, ajala will fallback to `auto` for optimal user experience. |

## Responsive Ajala Step

Every property except `id` in [Ajala Step object](https://github.com/DevYemi/ajala?tab=readme-ov-file#ajala-step-shape) can also accept a reponsive object which accepts a default value which is compulsory and a query string property value that can be passed to [matchMedia](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia).

> **Please Note:** That the order of the `MatchMedia` queries matters, so if you have 2 `MatchMedia` queries that matches then the last query in the query arrangement takes precedence. This is almost similar to the same way CSS Specificity works.

#### Example

```ts
import { AjalaJourney } from "ajala.js";

const ajala_journey = new AjalaJourney([
  {
    id: "A unique Id",
    target: {
      default: ".step_2",
      "(min-width: 700px)": ".step_3",
      "(min-width: 1200px)": ".step_4",
    },
    skip: {
      default: false,
      "(min-width: 700px)": true,
    },
    enable_target_interaction: {
      default: true,
      "(max-width: 700px)": true,
      "(min-width: 1200px)": true,
    },
  },
]);
```

## Ajala Options Shape

An object with the following property

> **Please note:** That majority of this property could also be customize internally in the [Ajala Step Shape](https://github.com/DevYemi/ajala?tab=readme-ov-file#ajala-step-shape) and property passed in ajala step takes precedence.

| Property                  | Type                                                                                                                                                                                 | Description                                                                                                                                                                                                                                                                                                                                          |
| :------------------------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| start_immediately         | boolean                                                                                                                                                                              | This helps control if ajala should run automatically when `init()` method is called. Defauly value is `true`.                                                                                                                                                                                                                                        |
| custom_tooltip            | HTMLElement                                                                                                                                                                          | An html element that serves as the custom tooltip, ajala creates a default one for you when you don't pass this.                                                                                                                                                                                                                                     |
| custom_arrow              | SVGSVGElement                                                                                                                                                                        | An html svg element that will be used as the custom arrow for your tooltip.                                                                                                                                                                                                                                                                          |
| tooltip_gutter            | number                                                                                                                                                                               | This adds a gap or padding between the tooltip card and the target element.                                                                                                                                                                                                                                                                          |
| spotlight_border_radius   | number                                                                                                                                                                               | This helps add a border-radius around the highlighted target element on the viewport.                                                                                                                                                                                                                                                                |
| spotlight_padding         | number                                                                                                                                                                               | This helps add a padding on the highlighted target element on the viewport.                                                                                                                                                                                                                                                                          |
| scroll_duration           | number                                                                                                                                                                               | By default ajala hijack the viewport scroll while the journey is active, this property help customize the scrolling duration, value must be in milliseconds, default value is `1000`.                                                                                                                                                                |
| transition_duration       | number                                                                                                                                                                               | This helps customize ajala transitioning between steps duration, value must be in milliseconds, default value is `1000`.                                                                                                                                                                                                                             |
| enable_target_interaction | boolean                                                                                                                                                                              | By default highlighted spotlight target are not clickable                                                                                                                                                                                                                                                                                            |
| enable_overlay_close      | boolean                                                                                                                                                                              | By default ajala doesn't close the journey when the overlay is clicked, passing `true` to this property make sure ajala journey finishes when the overlay is clicked.                                                                                                                                                                                |
| tooltip_placement         | `top_left`, `top_center`, `top_right`, `bottom_left`, `bottom_center`, `bottom_right`, `left_top`, `left_bottom`, `left_center`, `right_top`, `right_bottom`, `right_center`, `auto` | This helps customize where the tooltip should be placed on the spotlight element. Default value is `auto` which means ajala calculate the best placement for the tooltip. Please note that if you pass a value aside `auto` and ajala discover that the tooltip will be out-of-user-view, ajala will fallback to `auto` for optimal user experienec. |
| transition_type           | `traveller`, `popout`                                                                                                                                                                | The type of transitioning ajala should use in it's journey.                                                                                                                                                                                                                                                                                          |
| default_tooltip_options   | object [Type shape here](https://github.com/DevYemi/ajala?tab=readme-ov-file#object-type-shape)                                                                                      | Helps customize the default tooltip                                                                                                                                                                                                                                                                                                                  |
| default_arrow_options     | object [Type shape here](https://github.com/DevYemi/ajala?tab=readme-ov-file#object-type-shape)                                                                                      | Helps customize the default arrow                                                                                                                                                                                                                                                                                                                    |
| overlay_options           | object [Type shape here](https://github.com/DevYemi/ajala?tab=readme-ov-file#object-type-shape)                                                                                      | Helps customize the default overlay                                                                                                                                                                                                                                                                                                                  |
| spotlight_options         | object [Type shape here](https://github.com/DevYemi/ajala?tab=readme-ov-file#object-type-shape)                                                                                      | Helps customize the spotlight                                                                                                                                                                                                                                                                                                                        |

#### Object Type Shape

```ts

 default_tooltip_options?: Partial<{
    class_name: string;
    hide_dot_nav: boolean;
    hide_close_btn: boolean;
    hide_title: boolean;
    hide_content: boolean;
  }>;
  default_arrow_options?: Partial<{
    class_name: string;
    hide: boolean;
    size: number;
    color: string;
  }>;
  overlay_options?: Partial<{
    class_name: string;
    color: string;
    opacity: number;
    hide: boolean;
  }>;
  spotlight_options?: Partial<{
    border_radius: number;
    padding: number;
  }>;

```

## Ajala Methods

Ajala exposed numerouse methods to help you control it's journey experience.

| Property                   | Description                                                                                                                                                                                              |
| :------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| init                       | Used to initialize ajala journey, journey starts automatically except if `start_immediately` is set to false                                                                                             |
| start                      | Used to manually start ajala journey, can also be used to restart ajala journey                                                                                                                          |
| next                       | Used to to move ajala to the next step.                                                                                                                                                                  |
| prev                       | Used to to move ajala to the previous step.                                                                                                                                                              |
| goToStep                   | Used to to move ajala to a particular step in the journey, accepts the step `id` as an argument.                                                                                                         |
| getActiveStep              | Used to to move ajala to get the current active step in ajala journey.                                                                                                                                   |
| updateSteps                | Used to to move ajala to update ajala steps, accepts an array [step](https://github.com/DevYemi/ajala?tab=readme-ov-file#ajala-step-shape) as an argument.                                               |
| getOriginalSteps           | Used to to get the original step array that was passed.                                                                                                                                                  |
| getFlattenSteps            | Used to to get the flatten step array. Flatten step array is original array after all matchmedia quries has been applied based on the viewport size .                                                    |
| getActiveStepOriginalIndex | Used to to get the index of the active step in the original array that was passed.                                                                                                                       |
| getActiveStepFlattenIndex  | Used to to get the index of the active step in the flatten array.                                                                                                                                        |
| refresh                    | Used to to manually trigger a recalculation of the position of all UI element. Content loaded asynchronously could make ajala position become invalid, this method can come in handy in such situations. |
| destroy                    | Used to manually close, stop or destroy ajala journey                                                                                                                                                    |
| addEventListener           | Used to add and listen to diffrent events during ajala journey. Accept 2 arguments `TAjalaEventTypes` and the callback `function`                                                                        |
| removeEventListener        | Used to remove the event listener that were added.                                                                                                                                                       |

### Event Type Shape

```ts
type TAjalaEventTypes =
  | "onStart"
  | "onNext"
  | "onPrev"
  | "onClose"
  | "onTransitionComplete"
  | "onFinish";
```

| Event                | Description                                                                                                                        | Callback Argument                         |
| :------------------- | :--------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| onStart              | Callback func is triggered immediately ajala starts his journey                                                                    | an object with `type` and `data` property |
| onNext               | Callback func is triggered when the next button is clicked or `next` method is called. This happens right before transition starts | an object with `type` and `data` property |
| onPrev               | Callback func is triggered when the prev button is clicked or `prev` method is called. This happens right before transition starts | an object with `type` and `data` property |
| onClose              | Callback func is triggered when the close button is clicked or `close` method is called.                                           | an object with `type` and `data` property |
| onTransitionComplete | Callback func is triggered after ajala has finish a transition sequence from one step to another                                   | an object with `type` and `data` property |
| onFinish             | Callback func is triggered when a ajala finishes his journey. User get's to the last step.                                         | an object with `type` and `data` property |

## Contributions

Feel free to submit pull requests, create issues or spread the word.

## License

MIT &copy; [Adeyanju Adeyemi](https://x.com/BlackTiyemi)
