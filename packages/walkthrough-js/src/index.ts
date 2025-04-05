import Walkthrough from "./library/base";

const walkthrough = new Walkthrough({
  steps: [
    { target: ".god abeg", id: "1" },
    {
      target: ".mybro",
      id: "2",
      order: {
        default: 4,
        "900px": 5,
      },
    },
    {
      target: ".how your side",
      id: "3",
      order: {
        default: 3,
        "700px": 2,
      },
    },
    {
      target: ".my side dey okay",
      id: "4",
      order: {
        default: 2,
        "800px": 3,
      },
    },
    {
      target: ".my side dey okay",
      id: "5",
      order: {
        default: 1,
        "800px": 4,
      },
      skip: {
        default: false,
        "800px": true,
      },
    },
  ],
});
walkthrough.init();

console.log("walkthrough", walkthrough);
