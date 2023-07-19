export interface BaseGeography {
  id: string;
  type: "Feature";
  properties: {
    "Alpha-2": string;
    name: string;
  };
  geometry: {
    type: "Polygon" | "MultiPolygon";
    coordinates: Array<Array<[number, number]>>;
  };
}

export interface SvgGeography extends BaseGeography {
  svgPath: string;
  rsmKey: string;
}

export interface TrembitaSvgGeography extends SvgGeography {
  polygonArea: number;
  polygonCoordinates: {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
  }
}

export const BIG_COUNTRY_THRESHOLD = 40;
