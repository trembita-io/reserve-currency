import { BIG_COUNTRY_THRESHOLD, SvgGeography } from "./model";

function calcPolygonArea(vertices: Array<[number, number]>) {
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

export const getBigCountries = (geographies: Array<SvgGeography>) =>
  geographies.filter((geo) => {
    const { geometry } = geo;
    if (geometry.type === "Polygon") {
      return calcPolygonArea(geometry.coordinates[0]) > BIG_COUNTRY_THRESHOLD;
    } else {
      // console.log(
      //   geo,
      //   geometry.coordinates,
      //   // geometry.coordinates
      //   //   .map((multiPol) =>
      //   //     (multiPol as any as Array<Array<[number, number]>>).map(
      //   //       (cor: Array<[number, number]>) => calcPolygonArea(cor)
      //   //     )
      //   //   )
      //   //   .flat(1)
      //   //   .reduce((acc, curr) => acc + curr, 0)
      // );
      return (
        geometry.coordinates
          .map((multiPol) =>
            (multiPol as any as Array<Array<[number, number]>>).map(
              (cor: Array<[number, number]>) => calcPolygonArea(cor)
            )
          )
          .flat(1)
          .reduce((acc, curr) => acc + curr, 0) > BIG_COUNTRY_THRESHOLD
      );
    }
  });

type xNumber = number;
type yNumber = number;

export const getPolygonCenter = (coordinates: Array<[xNumber, yNumber]>): [xNumber, yNumber] => {
  let minX = coordinates[0][0],
    maxX = coordinates[0][0],
    minY = coordinates[0][1],
    maxY = coordinates[0][1];

  coordinates.forEach(([x,y]) => {
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);

    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  });


  return [((maxX - minX) / 2) + minX, ((maxY - minY) / 2) + minY]
};

/**
 * multiple polygon only finds the one with the biggest number of vectors. it does not mean that it's mainland territory
 * @returns Polygon
 */
export const getMainlandPolygon = (name: string, arr: Array<Array<Array<[xNumber, yNumber]>>>): Array<Array<[xNumber, yNumber]>> => {
  let longest = arr[0][0].length,
    longestTerritory = arr[0][0]; // mainland

    arr.forEach((territory) => {
      // if(name === 'United States of America') {
      //   console.log('\n\n\n+===>>>BIGGEST', territory, longest, longestTerritory);
      // }

      if(territory[0].length > longest) {
        longest = territory[0].length;
        longestTerritory = territory[0] as any;
      }
    });

    // console.log(name, longestTerritory, arr);  
  
  return longestTerritory as any; // 
}