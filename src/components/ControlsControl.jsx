import React from "react";
import IconSlider from "./IconSlider.jsx";
import IconClose from "./IconClose.jsx";

const ControlsControl = ({ handleChange, isClosed }) => (
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
