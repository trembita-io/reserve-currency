import {
  BaseGeography
} from "./model";

export const filterOutNonStates = (
  data: Array<BaseGeography>
): Array<BaseGeography> => data.filter((g) => g.id !== "RUS" && g.id !== "ATA");
