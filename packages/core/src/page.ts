import "./style.css";
import { AjalaJourney } from "./library/main";

const ajala = new AjalaJourney(
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
      id: "1",
      title: "Step 2 Title",
      content: "step 2 content lorem ipson",
      tooltip_placement: "left_top",
      order: {
        default: 1,
        "(min-width: 450px)": 3,
        "(min-width: 600px)": 0,
      },
    },
    {
      target: ".step_3",
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
    transition_type: "traveller",
    enable_target_interaction: true,
    transition_duration: 500,
    scroll_duration: 400,
    spotlight_options: {
      border_radius: 5,
      padding: 5,
    },
    // custom_tooltip: document.querySelector<HTMLElement>(".custom_tooltip"),
    default_arrow_options: {
      size: 60,
    },
    overlay_options: {
      opacity: 0.7,
      color: "white",
    },
  },
);
ajala.init();

ajala.addEventListener("onStart", (e: any) => {
  console.log("onStart", e);
});
ajala.addEventListener("onNext", (e: any) => {});

ajala.addEventListener("onPrev", (e: any) => {
  console.log(e);
});
ajala.addEventListener("onTransitionComplete", (e: any) => {
  console.log(e);
});
ajala.addEventListener("onClose", (e: any) => {
  ajala.goToStep("8");
});
ajala.addEventListener("onFinish", (e: any) => {
  console.log(e);
});

document.querySelector(".step_3")?.addEventListener("click", (e) => {
  e.preventDefault();
  ajala.goToStep("8");
});

// console.log("ajala", ajala);
