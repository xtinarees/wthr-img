import tinycolor from "tinycolor2";
import PrecipitationItem from "./PrecipitationItem";
import { ConditionValues } from "../types";

interface PrecipitationProps {
  types: string[];
  color: string;
}

function Precipitation({ types, color }: PrecipitationProps) {
  const backgroundColor = tinycolor(color).lighten(10).spin(5).toString();
  return (
    <>
      {types.map((precipType) => (
        <div className="precipitation" key={precipType}>
          <PrecipitationItem
            types={types}
            precipType={precipType as ConditionValues}
            color={backgroundColor}
          />
        </div>
      ))}
    </>
  );
}

export default Precipitation;
