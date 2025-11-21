import tinycolor from "tinycolor2";

const Background = ({ color }: { color: string }) => {
  const styles = { backgroundColor: tinycolor(color).toString() };
  return <div className="background" style={styles}></div>;
};

export default Background;
