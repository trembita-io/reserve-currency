import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";
import "./map.module.scss";
import { useState } from "react";
import { BaseGeography, SvgGeography } from "./model";
import { getBigCountries, getMainlandPolygon as multipleToSinglePolygon, getPolygonCenter } from "./pure";
import styles from './map.module.scss';

const geoUrl =
  "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json";

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
                bigCountries.map(({ id, geometry, properties: { name } }) => (
                  <Marker
                    key={`marker-${id}`}
                    coordinates={geometry.type === 'Polygon' ? getPolygonCenter(geometry.coordinates[0]) : getPolygonCenter(multipleToSinglePolygon(name, (geometry.coordinates as any)) as any)}
                    fill="#97FEED"
                  >
                    <text className={`${styles.text} ${styles['text-sm']}`}> {name}</text>
                  </Marker>
                ))
              );
          }}
        </Geographies>
      </ZoomableGroup>
    </ComposableMap>
  );
}
