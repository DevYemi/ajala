# React-Àjàlá.js

### A lightweight React wrapper built around ajala.js

<br/>

> **checkout ajala.js [here](https://www.npmjs.com/package/ajala.js)**

<br/>

## Quick start

```bash
npm i react-ajala
```

```ts
import { AjalaJourneyProvider } from "react-ajala";
import YourComponent from "./where-ever-it-kept";
import "ajala.js/dist/ajala.css";

function App() {
  return (
    <AjalaJourneyProvider
      steps={[
        {
          target: ".random",
          id: "1",
          title: "Step 2 Title",
          content: "step 2 content lorem ipson",
          tooltip_placement: "left_top",
          enable_target_interaction: true,
        },
      ]}
    >
      <YourComponent />
    </AjalaJourneyProvider>
  );
}
```

**Please note:** That you only need `import "ajala.js/dist/ajala.css";` when you are using ajala default tooltip, you don't need it if you provide your own `CustomTooltip` component.

## AjalaJourneyProvider Props

| Property      | Type                                                                                     | Description                                                                                                                                                                                                                                                                                    |
| :------------ | :--------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| steps         | [TStep](https://github.com/DevYemi/ajala?tab=readme-ov-file#ajala-step-shape)            | An array of object that's passed down as ajala.js steps, for a full description of this props please check ajala.js doc [here](https://github.com/DevYemi/ajala?tab=readme-ov-file#ajala-step-shape)                                                                                           |
| options       | [TAjalaOptions](https://github.com/DevYemi/ajala?tab=readme-ov-file#ajala-options-shape) | An object that's passed down to to customize ajala.js, for a full description of this props please check ajala.js doc [here](https://github.com/DevYemi/ajala?tab=readme-ov-file#ajala-options-shape)                                                                                          |
| CustomTooltip | JSX.Element or ReactNode                                                                 | A React component that get's render as ajala.js `custom_tooltip`, this component will accept a prop of [TReactAjalaCustomTooltipProps](https://github.com/DevYemi/ajala/blob/main/packages/react/README.md#treactajalacustomtooltipprops-shape) which is the active step and an ajala instance |
| CustomArrow   | JSX.Element or ReactNode                                                                 | A React component that get's render as ajala.js `custom_arrow`.                                                                                                                                                                                                                                |
| getInstance   | Function                                                                                 | A callback function that gets called with ajala.js instance, can be used to get ajala instance at the parent file where `AjalaJourneyProvider` is being used.                                                                                                                                  |

## useAjalaJourneyContext

react-ajala also export a `useAjalaJourneyContext` hook that can be used to get ajala instance down your component tree. Please note that your component must be wrapped with `AjalaJourneyProvider` to use `useAjalaJourneyContext`

#### Example using `useAjalaJourneyContext`

```ts
import { useAjalaJourneyContext } from "react-ajala";

function YourComponentWrappedWithAjalaJourneyProvider() {
  const ajalaInstance = useAjalaJourneyContext();
  return <div> ...Some content </div>;
}
```

#### Example using `CustomTooltip` and `CustomArrow`

```ts
import { AjalaJourneyProvider } from "react-ajala";
import YourComponent from "./where-ever-it-kept";
import YourCustomTooltipComponent from "./where-ever-it-kept";
import YourCustomArrowComponent from "./where-ever-it-kept";

function App() {
  return (
    <AjalaJourneyProvider
      steps={[
        {
          target: ".random",
          id: "1",
          title: "Step 2 Title",
          content: "step 2 content lorem ipson",
        },
      ]}
      CustomTooltip={YourCustomTooltipComponent}
      CustomArrow={YourCustomArrowComponent}
    >
      <YourComponent />
    </AjalaJourneyProvider>
  );
}
```

#### TReactAjalaCustomTooltipProps Shape

```ts
export interface TReactAjalaCustomTooltipProps {
  active_step: TSteps | undefined | null;
  ajala: AjalaJourney | null;
}
```

## Contributions

Feel free to submit pull requests, create issues or spread the word.

## License

MIT &copy; [Adeyanju Adeyemi](https://x.com/BlackTiyemi)
