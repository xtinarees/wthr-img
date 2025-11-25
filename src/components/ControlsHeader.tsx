import IconSlider from "./IconSlider.js";
import IconClose from "./IconClose.js";
import styles from "./ControlsHeader.module.css";

interface ControlsControlProps {
  handleChange: (isClosed: boolean) => void;
  isClosed: boolean;
}

const ControlsControl = ({ handleChange, isClosed }: ControlsControlProps) => (
  <button className={styles.header} onClick={() => handleChange(!isClosed)}>
    {isClosed ? (
      <IconSlider className={styles.icon} />
    ) : (
      <IconClose className={styles.icon} />
    )}

    <h2 className={styles.title}>Settings</h2>
  </button>
);

export default ControlsControl;
