import "./style.css";
import { AjalaJourney } from "./library/main";

const ajala = new AjalaJourney(
  [
    {
      target: ".step_2",
      id: "1",
      title: "Step 2 Title",
      content: "step 2 content lorem ipson",
      skip: true,
      tooltip_placement: "left_top",
      // order: {
      //   default: 3,
      //   "(min-width: 600px)": 0,
      // },
    },
    {
      target: ".step_3",
      skip: true,
      id: "3",
      title: "Step 3 Title",
      content: "step 3 content lorem ipson",
      tooltip_placement: {
        default: `top_right`,
        "(min-width: 700px)": "top_center",
        "(min-width: 500px)": "top_left",
      },
    },
    {
      target: ".step_41",
      skip: true,
      id: "4",
      title: "Step 4 Title",
      content: "step 4 content lorem ipson",
      tooltip_placement: "bottom_right",
    },
    {
      target: ".step_5",
      skip: true,
      id: "5",
      title: "Step 5 Title",
      content: "step 5 content lorem ipson",
      tooltip_placement: "left_top",
    },
    {
      target: ".step_6",
      skip: true,
      id: "6",
      title: "Step 6 Title",
      content: "step 6 content lorem ipson",
      tooltip_placement: "left_bottom",
    },
    {
      target: ".step_7",
      skip: true,
      id: "7",
      title: "Step 7 Title",
      content: "step 7 content lorem ipson",
    },
    {
      target: ".step_8",
      skip: true,
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
    spotlight_options: {
      border_radius: 5,
      padding: 5,
    },
  },
);
ajala.init();

document.querySelector(".step_3")?.addEventListener("click", (e) => {
  e.preventDefault();
  ajala.start();
});

// console.log("ajala", ajala);
