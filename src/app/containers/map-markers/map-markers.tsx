import { Marker } from "react-simple-maps";
import styles from "./map-markers.module.scss";

import {
  BaseGeography,
  SvgGeography,
  TrembitaPolygonSvgGeography,
} from "../map/model";
import {
  generatePolygonMeta,
  getHight,
  getMainlandPolygon,
  getPolygonCenter,
  getWidth,
  isBigCountry,
} from "./pure";

// manually measured text's dimensions - [~28.92, ~22.67]
// @TODO @FIXME - get text's sizes from scss / css variables
const adjustCenterToViewConditions = ([x, y]: [x: number, y: number]): [
  number,
  number
] => {
  return [x - 1.2, y - 0.5];
};

const nameBasedOnSpace = (
  polygonArea: number,
  width: number,
  height: number,
  properties: BaseGeography["properties"],
  id: BaseGeography['id']
): string => {
  console.log(
    properties.name,
    properties["Alpha-2"],
    polygonArea,
    width * height / (properties.name.length * 1.7),
  );

  return width > 10 && (polygonArea >= width * height / (properties.name.length * 1.5)) ? properties.name : (properties["Alpha-2"] ?? id);
}
  

export default function MapMarkers({
  markers,
}: {
  markers: Array<SvgGeography>;
}) {
  return generatePolygonMeta(markers).map(
    ({
      id,
      geometry,
      properties: { name, ["Alpha-2"]: code },
      polygonArea,
      polygonCoordinates: { maxX, minX, maxY, minY },
    }: TrembitaPolygonSvgGeography) => (
      <Marker
        key={`marker-${id}-${name}`}
        coordinates={adjustCenterToViewConditions(
          getPolygonCenter(
            geometry.type === "Polygon"
              ? geometry.coordinates[0]
              : (getMainlandPolygon(name, geometry.coordinates as any) as any)
          )
        )}
        fill="#97FEED"
      >
        {isBigCountry(polygonArea) && (
          <text className={`${styles.text} tr-text-sm`}>{code}</text>
        )}
        <foreignObject
          x={(-1 * getWidth(maxX, minX)) / 2}
          y={(-1 * getHight(maxY, minY)) / 2}
          width={getWidth(maxX, minX)}
          height={getHight(maxY, minY)}
        >
          <div className="group relative flex justify-center items-center h-full">
            <span
              className={`scale-0 transition-all rounded bg-gray-800 p-0.5 tr-text-sm text-white group-hover:scale-100`}
            >
              {nameBasedOnSpace(polygonArea, getWidth(maxX, minX), getHight(maxY, minY), {name, ["Alpha-2"]: code}, id)}
            </span>
          </div>
        </foreignObject>
      </Marker>
    )
  );
}
