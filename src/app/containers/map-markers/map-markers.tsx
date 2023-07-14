import { Marker } from "react-simple-maps";
import { SvgGeography } from "../map/model";

export default function MapMarkers({
  markers,
}: {
  markers: Array<SvgGeography>;
}) {
  return markers.map(({ properties, id }: SvgGeography) => (
    <Marker key={id} coordinates={[-101, 53]} fill="#777">
      {properties.name}
    </Marker>
  ));
}
