import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup
} from "react-simple-maps";
import MapMarkers from "../map-markers/map-markers";
import { BaseGeography, SvgGeography } from "./model";
import {
  filterOutNonStates,
} from "./pure";

const geoUrl =
  "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json";

// manually measured text's dimensions - [~28.92, ~22.67]
// @TODO @FIXME - get text's sizes from scss / css variables
const adjustCenterToViewConditions = ([x, y]: [x: number, y: number]): [
  number,
  number
] => {
  return [x - 1.2, y - 0.5];
};

export default function MapChart() {
  return (
    <ComposableMap>
      <ZoomableGroup>
        <Geographies
          geography={geoUrl}
          parseGeographies={(geos) =>
            filterOutNonStates(geos as Array<BaseGeography>)
          }
        >
          {(geogs: { geographies: Array<SvgGeography> }) => {
            const { geographies } = geogs;

            return geographies
              .map((geo: SvgGeography) => {
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    style={{
                      default: { fill: "#071952" },
                      hover: { fill: "#97FEED" },
                      pressed: { fill: "#35A29F" },
                    }}
                  />
                );
              })
              .concat(
                <MapMarkers markers={geographies}></MapMarkers>
              );
          }}
        </Geographies>
      </ZoomableGroup>
    </ComposableMap>
  );
}
