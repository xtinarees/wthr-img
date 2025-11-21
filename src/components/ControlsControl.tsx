import IconSlider from "./IconSlider.jsx";
import IconClose from "./IconClose.jsx";

interface ControlsControlProps {
  handleChange: (isClosed: boolean) => void;
  isClosed: boolean;
}

const ControlsControl = ({ handleChange, isClosed }: ControlsControlProps) => (
  <button className="controls__header" onClick={() => handleChange(!isClosed)}>
    {isClosed ? (
      <IconSlider className="controls__icon" />
    ) : (
      <IconClose className="controls__icon" />
    )}

    <h2 className="controls__title">Settings</h2>
  </button>
);

export default ControlsControl;
