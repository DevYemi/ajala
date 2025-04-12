import Walkthrough from "./library/base";

const walkthrough = new Walkthrough(
  [
    {
      target: ".step_1",
      id: "1",
      title: "Step 1 Title",
      content: "step 1 content lorem ipson",
    },
    {
      target: ".step_2",
      id: "2",
      title: "Step 2 Title",
      content: "step 2 content lorem ipson",
    },
    {
      target: ".step_3",
      id: "3",
      title: "Step 3 Title",
      content: "step 3 content lorem ipson",
    },
    {
      target: ".step_4",
      id: "4",
      title: "Step 4 Title",
      content: "step 4 content lorem ipson",
    },
    {
      target: ".step_5",
      id: "5",
      title: "Step 5 Title",
      content: "step 5 content lorem ipson",
    },
    {
      target: ".step_6",
      id: "6",
      title: "Step 6 Title",
      content: "step 6 content lorem ipson",
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
      order: 1,
    },
    {
      target: ".step_9",
      id: "9",
      title: "Step 9 Title",
      content: "step 9 content lorem ipson",
    },
  ],
  { gutter: 0, tooltip_placement: "auto" },
);
walkthrough.init();

console.log("walkthrough", walkthrough);
