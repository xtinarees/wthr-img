import Precipitation from "./Precipitation.jsx";
/**
 * Could be extended to support other "conditions" such as
 * Cloudy, Lightning, etc.
 */
const Condition = ({ types, color }: { types: string[]; color: string }) => {
  const precips = types.filter((n: string) => ["snowy", "rainy"].includes(n));
  return (
    <div>
      <Precipitation types={precips} color={color} />
    </div>
  );
};

export default Condition;
