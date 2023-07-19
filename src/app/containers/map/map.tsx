import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";
import "./map.module.scss";
import styles from "./map.module.scss";
import { BaseGeography, SvgGeography } from "./model";
import { getBigCountries, getMainlandPolygon, getPolygonCenter } from "./pure";

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
          parseGeographies={(geos) => {
            const filteredGeos = geos.filter(
              (g) => g.id !== "RUS" && g.id !== "ATA"
            ) as Array<BaseGeography>;

            return filteredGeos;
          }}
        >
          {(geogs: { geographies: Array<SvgGeography> }) => {
            const { geographies } = geogs;

            console.log(geographies);

            const bigCountries = getBigCountries(geographies);
            console.log(bigCountries);

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
                bigCountries.map(
                  ({
                    id,
                    geometry,
                    properties: { name, ["Alpha-2"]: code },
                  }) => (
                    <Marker
                      key={`marker-${id}`}
                      coordinates={adjustCenterToViewConditions(
                        getPolygonCenter(
                          geometry.type === "Polygon"
                            ? geometry.coordinates[0]
                            : (getMainlandPolygon(
                                name,
                                geometry.coordinates as any
                              ) as any)
                        )
                      )}
                      fill="#97FEED"
                    >
                      <text
                        className={`${styles.text} ${styles["country-code"]}`}
                      >
                        {" "}
                        {code}
                      </text>
                      <foreignObject x="-15" y="-18" width="30" height="36">
                        <div className="group relative flex justify-center h-full">
                          <span
                            className={`absolute top-10 scale-0 transition-all rounded bg-gray-800 p-0.5 ${styles["text-md"]} text-white group-hover:scale-100 top-0`}
                          >
                            {name}
                          </span>
                        </div>
                      </foreignObject>
                    </Marker>
                  )
                )
              );
          }}
        </Geographies>
      </ZoomableGroup>
    </ComposableMap>
  );
}
