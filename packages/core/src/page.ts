import "@/style.css";
import Walkthrough from "./library/main";

const walkthrough = new Walkthrough(
  [
    {
      target: ".step_1",
      id: "1",
      title: "Step 1 Title",
      content: "step 1 content lorem ipson",
      tooltip_placement: "right_top",
      data: { name: "yemi" },
    },
    {
      target: ".step_2",
      id: "2",
      title: "Step 2 Title",
      content: "step 2 content lorem ipson",
      tooltip_placement: "left_top",
      order: 1,
    },
    {
      target: ".step_3",
      id: "3",
      title: "Step 3 Title",
      content: "step 3 content lorem ipson",
      tooltip_placement: "right_bottom",
    },
    {
      target: ".step_4",
      id: "4",
      title: "Step 4 Title",
      content: "step 4 content lorem ipson",
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
      content: "step 6 content lorem ipson",
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
  ],
  {
    // start_immediately: false,
    tooltip_placement: "auto",
    transition_type: "travel",
    spotlight_options: {
      border_radius: 5,
      padding: 5,
    },
    // custom_tooltip: document.querySelector<HTMLElement>(".custom_tooltip"),
    default_arrow_options: {
      color: "red",
      size: 60,
    },
    overlay_options: {
      opacity: 0.9,
      color: "yellow",
    },
  },
);
walkthrough.init();

walkthrough.addEventListener("onStart", (e: any) => {
  console.log(e);
});
walkthrough.addEventListener("onNext", (e: any) => {
  console.log("This onNext1", e);
});

walkthrough.addEventListener("onPrev", (e: any) => {
  console.log(e);
});
walkthrough.addEventListener("onTransitionComplete", (e: any) => {
  console.log(e);
});
walkthrough.addEventListener("onClose", (e: any) => {
  console.log(e);
});
walkthrough.addEventListener("onFinish", (e: any) => {
  console.log(e);
});
// walkthrough.start();

// console.log("walkthrough", walkthrough);
