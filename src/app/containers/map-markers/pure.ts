import { SvgGeography, TrembitaPolygonSvgGeography } from "../map/model";
import { BIG_COUNTRY_THRESHOLD } from "./model";

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
  coordinates: Array<[xNumber: number, yNumber: number]>
): TrembitaPolygonSvgGeography["polygonCoordinates"] {
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

export const isBigCountry = (polygonArea: number) =>
  polygonArea > BIG_COUNTRY_THRESHOLD;

export const generatePolygonMeta = (
  geographies: Array<SvgGeography>
): Array<TrembitaPolygonSvgGeography> => {
  const cached = countriesWeakMap.get(geographies);
  if (cached) {
    console.log("cached", cached);
    return cached;
  }

  const countries: Array<TrembitaPolygonSvgGeography> = geographies.map(
    (geography) => {
      const { geometry } = geography;

      const mainlandPolygonCoordinates: Array<
        [xNumber: number, yNumber: number]
      > =
        geometry.type === "Polygon"
          ? geometry.coordinates[0]
          : (getMainlandPolygon("", geometry.coordinates as any) as any);

      const polygonArea = _calcPolygonArea(mainlandPolygonCoordinates);

      return {
        ...geography,
        polygonArea,
        polygonCoordinates: _getMinMax(mainlandPolygonCoordinates),
      };
    }
  );

  countriesWeakMap.set(geographies, countries);
  countries.forEach((v) => {
    console.log(v.properties.name, v);
  });
  return countries;
};

// @TODO: GC check that will be collected over time (e.g. page switching)
const countriesWeakMap = new WeakMap<
  Array<SvgGeography>,
  Array<TrembitaPolygonSvgGeography>
>([]);

export const getPolygonCenter = (
  coordinates: Array<[xNumber: number, yNumber: number]>
): [xNumber: number, yNumber: number] => {
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
  arr: Array<Array<Array<[xNumber: number, yNumber: number]>>>
): Array<Array<[xNumber: number, yNumber: number]>> => {
  let longest = arr[0][0].length,
    longestTerritory = arr[0][0]; // mainland

  arr.forEach((territory) => {
    if (territory[0].length > longest) {
      longest = territory[0].length;
      longestTerritory = territory[0] as any;
    }
  });

  return longestTerritory as any;
};

export const getWidth = (maxX: number, minX: number) => {
  return (maxX - minX) * 2;
};

export const getHight = (maxY: number, minY: number) => {
  return (maxY - minY) * 2;
};
