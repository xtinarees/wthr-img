import React from "react";
import IconSlider from "./IconSlider.jsx";

const ControlsControl = ({ handleChange, isClosed }) => (
  <button className="controls__header" onClick={() => handleChange(!isClosed)}>
    <IconSlider className="controls__icon" />
    <h2 className="controls__title">Settings</h2>
  </button>
);

export default ControlsControl;
