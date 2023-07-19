import { AFGHANISTAN, ANGOLA } from "./__mock__/big-countries";
import { USA as _USA } from "./__mock__/multi-polygon-countries";
import { ALBANIA } from "./__mock__/small-countries";
import { TrembitaSvgGeography, SvgGeography } from "./model";
import {
  _calcPolygonArea,
  _getMinMax,
  getBigCountries,
  getMainlandPolygon,
} from "./pure";

const MULTI_POLYGON_USA = preparePolygonArea(_USA);

function preparePolygonArea(
  geography: any & SvgGeography
): TrembitaSvgGeography {
  const coordinates =
    geography.geometry.type === "Polygon"
      ? geography.geometry.coordinates[0]
      : (getMainlandPolygon("", geography.geometry.coordinates as any) as any);

  return {
    ...geography,
    polygonArea: _calcPolygonArea(coordinates),
    polygonCoordinates: _getMinMax(coordinates),
  };
}

function prepareBigCountries() {
  return [preparePolygonArea(AFGHANISTAN), preparePolygonArea(ANGOLA)];
}

function prepareSmallCountries() {
  return [ALBANIA];
}

describe("[map.]pure.ts", () => {
  let bigCountries: Array<any & SvgGeography> = prepareBigCountries(),
    smallCountries: Array<any & SvgGeography> = prepareSmallCountries();

  beforeEach(() => {
    bigCountries = prepareBigCountries();
    smallCountries = prepareSmallCountries();
  });

  describe("getBigCountries", () => {
    it("should return 0 big countries", () => {
      const result = getBigCountries([]);

      expect(result.length).toBe(0);
      expect(result).toEqual([]);
    });

    it("should return 0 big countries", () => {
      const result = getBigCountries(smallCountries);

      expect(result.length).toBe(0);
      expect(result).toEqual([]);
    });

    it(`should return ${prepareBigCountries().length} big countries`, () => {
      const result = getBigCountries([
        ...bigCountries,
        ...smallCountries,
      ] as any);

      expect(result.length).toBe(2);
      expect(result).toEqual(bigCountries);
    });

    it(`should return ${
      prepareBigCountries().concat(MULTI_POLYGON_USA).length
    } big countries (with one big mainland (MultiPolygon) country (USA))`, () => {
      const result = getBigCountries([
        ...bigCountries.concat(MULTI_POLYGON_USA),
        ...smallCountries,
      ] as any);

      expect(result.length).toBe(
        bigCountries.concat(MULTI_POLYGON_USA).length
      );
      expect(result).toEqual(bigCountries.concat(MULTI_POLYGON_USA));
    });

    it(`should return ${prepareBigCountries().length} big countries`, () => {
      const result = getBigCountries(bigCountries);

      expect(result.length).toBe(bigCountries.length);
      expect(result).toEqual(bigCountries);
    });
  });
});
