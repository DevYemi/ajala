import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { AjalaJourneyProvider } from "./components/AjalaJourneyProvider.tsx";
import DummyCustomTooltip from "./components/DummyCustomTooltip.tsx";
import DummyCustomArrow from "./components/DummyCustomArrow.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AjalaJourneyProvider
      steps={[
        {
          target: ".step_2",
          id: "1",
          title: "Step 2 Title",
          content: "step 2 content lorem ipson",
          tooltip_placement: "left_top",
          enable_target_interaction: true,
        },
        {
          target: ".step_3",
          id: "3",
          title: "Step 3 Title",
          content: "step 3 content loremjgj jgjgjgj hjhjh jhjgj ipson",
          tooltip_placement: {
            default: `top_right`,
            "(min-width: 700px)": "top_center",
            "(min-width: 500px)": "top_left",
          },
        },
        {
          target: ".step_41",
          id: "4",
          title: "Step 4 Title",
          content: "step 4 content",
          tooltip_placement: "bottom_right",
        },
        {
          target: ".step_5",
          id: "5",
          title: "Step 5 Title",
          content: "step 5 content lorem ipson",
          tooltip_placement: "left_top",
        },
        {
          target: ".step_6",
          id: "6",
          title: "Step 6 Title",
          content:
            "step 6 content jgdajdgaj sjdhsjdhgsjd kshksdhskdhsdk kjshjshdsjshs kjshjshd lorem ipson",
          tooltip_placement: "left_bottom",
        },
        {
          target: ".step_7",
          id: "7",
          title: "Step 7 Title",
          content: "step 7 content lorem ipson",
        },
        {
          target: ".step_8",
          id: "8",
          title: "Step 8 Title",
          content: "step 8 content lorem ipson",
        },
        {
          target: ".step_9",
          id: "9",
          title: "Step 9 Title",
          content: "step 9 content lorem ipson",
          tooltip_placement: "left_bottom",
        },
      ]}
      CustomTooltip={DummyCustomTooltip}
      CustomArrow={DummyCustomArrow}
      options={{
        start_immediately: true,
        tooltip_gutter: 30,
        overlay_options: {
          color: "white",
          opacity: 0.6,
        },
        spotlight_options: {
          border_radius: 5,
          padding: 5,
        },
      }}
    >
      <App />
    </AjalaJourneyProvider>
  </StrictMode>
);
