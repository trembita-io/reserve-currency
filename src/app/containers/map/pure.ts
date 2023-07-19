import {
  BIG_COUNTRY_THRESHOLD,
  BaseGeography,
  TrembitaSvgGeography,
  SvgGeography,
} from "./model";

// @internal export for testing only
export function _calcPolygonArea(vertices: Array<[number, number]>) {
  var total = 0;

  for (var i = 0, l = vertices.length; i < l; i++) {
    var addX = vertices[i][0];
    var addY = vertices[i == vertices.length - 1 ? 0 : i + 1][1];
    var subX = vertices[i == vertices.length - 1 ? 0 : i + 1][0];
    var subY = vertices[i][1];

    total += addX * addY * 0.5;
    total -= subX * subY * 0.5;
  }

  return Math.abs(total);
}

// @internal export for testing only
export function _getMinMax(
  coordinates: Array<[xNumber, yNumber]>
): TrembitaSvgGeography["polygonCoordinates"] {
  // export function _getMinMax(coordinates: Array<[xNumber, yNumber]>):Pick<TrembitaSvgGeography, "polygonCoordinates"> {
  let minX = coordinates[0][0],
    maxX = coordinates[0][0],
    minY = coordinates[0][1],
    maxY = coordinates[0][1];

  coordinates.forEach(([x, y]) => {
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);

    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  });

  return {
    minX,
    maxX,
    minY,
    maxY,
  };
}

export const filterOutNonStates = (
  data: Array<BaseGeography>
): Array<BaseGeography> => data.filter((g) => g.id !== "RUS" && g.id !== "ATA");

export const getBigCountries = (
  geographies: Array<SvgGeography>
): Array<TrembitaSvgGeography> => {
  const bigCountries: Array<TrembitaSvgGeography> = [];

  geographies.forEach((geography) => {
    const { geometry } = geography;

    const mainlandPolygonCoordinates: Array<[xNumber, yNumber]> =
      geometry.type === "Polygon"
        ? geometry.coordinates[0]
        : (getMainlandPolygon("", geometry.coordinates as any) as any);

    const polygonArea = _calcPolygonArea(mainlandPolygonCoordinates);

    if (polygonArea > BIG_COUNTRY_THRESHOLD) {
      bigCountries.push({
        ...geography,
        polygonArea,
        polygonCoordinates: _getMinMax(mainlandPolygonCoordinates),
      });
    }
  });

  return bigCountries;
};

type xNumber = number;
type yNumber = number;

export const getPolygonCenter = (
  coordinates: Array<[xNumber, yNumber]>
): [xNumber, yNumber] => {
  let minX = coordinates[0][0],
    maxX = coordinates[0][0],
    minY = coordinates[0][1],
    maxY = coordinates[0][1];

  coordinates.forEach(([x, y]) => {
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);

    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  });

  return [(maxX - minX) / 2 + minX, (maxY - minY) / 2 + minY];
};

/**
 * multiple polygon only finds the one with the biggest number of vectors. it does not mean that it's mainland territory
 * @returns Polygon
 */
export const getMainlandPolygon = (
  name: string,
  arr: Array<Array<Array<[xNumber, yNumber]>>>
): Array<Array<[xNumber, yNumber]>> => {
  let longest = arr[0][0].length,
    longestTerritory = arr[0][0]; // mainland

  arr.forEach((territory) => {
    // if(name === 'United States of America') {
    //   console.log('\n\n\n+===>>>BIGGEST', territory, longest, longestTerritory);
    // }

    if (territory[0].length > longest) {
      longest = territory[0].length;
      longestTerritory = territory[0] as any;
    }
  });

  // console.log(name, longestTerritory, arr);

  return longestTerritory as any; //
};
