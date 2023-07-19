import { AFGHANISTAN, ANGOLA } from "./__mock__/big-countries";
import { USA } from "./__mock__/multi-polygon-countries";
import { ALBANIA } from "./__mock__/small-countries";
import { SvgGeography } from "./model";
import { getBigCountries } from "./pure";

function prepareBigCountries() {
    return [AFGHANISTAN, ANGOLA];
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

    it('should return 0 big countries', () => {
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

    it(`should return ${prepareBigCountries().concat(USA).length} big countries (with one big mainland (MultiPolygon) country (USA))`, () => {
      const result = getBigCountries([
        ...bigCountries.concat(USA),
        ...smallCountries,
      ] as any);

      expect(result.length).toBe(bigCountries.concat(USA).length);
      expect(result).toEqual(bigCountries.concat(USA));
    });

    it(`should return ${prepareBigCountries().length} big countries`, () => {
        const result = getBigCountries(bigCountries);
  
        expect(result.length).toBe(bigCountries.length);
        expect(result).toEqual(bigCountries);
      });
  });
});
