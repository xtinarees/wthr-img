import tinycolor from "tinycolor2";

/**
 * Manage background styles for controls panel
 * inside of div in order to control opacity independently
 */
const BackgroundControls = ({ color }: { color: string }) => {
  const colorStr = tinycolor(color).toString();
  const gradient = `linear-gradient(to right, rgba(255,0,0,0), ${colorStr}, ${colorStr})`;

  const styles = { backgroundImage: gradient };

  return (
    <div className="controls__background">
      <div className="controls__background-inner" style={styles}></div>
    </div>
  );
};

export default BackgroundControls;
