import {clamp} from "./clamp";

export const calculateRiskFactorScore = ({
  score,
  weight,
}: {
  score: number;
  weight: number;
}) => {
  const withWeight = score * weight;
  const clamped = clamp(withWeight, 0, 1);
  return clamped;
};
