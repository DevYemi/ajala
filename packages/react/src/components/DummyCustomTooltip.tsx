import { TReactAjalaCustomTooltipProps } from "./types";

function DummyCustomTooltip({
  active_step,
  ajala,
}: TReactAjalaCustomTooltipProps) {
  return (
    <div style={{ backgroundColor: "red", width: "100%", height: "100%" }}>
      <h1>{active_step?.title || "Hello Adeyemi"}</h1>
      <p onClick={() => {}}> {active_step?.content || "How are you doing ?"}</p>

      <button
        onClick={() => {
          ajala?.prev();
        }}
      >
        Prev
      </button>
      <button
        className="God_abeg_na_me_o"
        onClick={() => {
          ajala?.next();
        }}
      >
        Next
      </button>
      <button
        onClick={() => {
          ajala?.destroy();
        }}
      >
        Close
      </button>
      <button
        onClick={() => {
          ajala?.restart();
        }}
      >
        Restart
      </button>
    </div>
  );
}

export default DummyCustomTooltip;
