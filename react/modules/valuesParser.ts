export type TachyonsScaleInput = string | number | undefined;
type Group<T, U> = { [key in keyof T]: U };
type TachyonsInputGroup<T> = Group<T, TachyonsScaleInput>;
interface ResponsiveInput<T> {
  mobile: T;
  desktop: T;
}

const MAX_TACHYONS_SCALE = 11;

// Maps Tachyons scale (0–11) to CSS rem spacing values
const TACHYONS_SPACING = [
  "0",
  "0.25rem",
  "0.5rem",
  "1rem",
  "2rem",
  "4rem",
  "8rem",
  "16rem",
  "32rem",
  "64rem",
  "128rem",
  "256rem"
];

export const toSpacingValue = (scale: number): string => TACHYONS_SPACING[scale] ?? "0";

//eslint-disable-next-line @typescript-eslint/no-explicit-any
const isResponsiveInput = <T>(value: any): value is ResponsiveInput<T> =>
  value && value.mobile != null && value.desktop != null;

/** Takes a parser of units, and returns a parser that accepts either a
 * value or a responsive input of that same type of value
 * (i.e. {mobile: ..., desktop: ...}), and returns an object of the same
 * format of the input.
 */
export const parseResponsive =
  <T, U>(parse: (value: T) => U) =>
  (value: T | ResponsiveInput<T>): null | U | { mobile: U; desktop: U } => {
    if (isResponsiveInput(value)) {
      return {
        mobile: parse(value.mobile),
        desktop: parse(value.desktop)
      };
    }

    return parse(value);
  };

/** Verifies if the input is a valid Tachyons scale value (i.e. a number
 * between 0 to 11) and converts to number if necessary
 */
const parseTachyonsValue = (value: TachyonsScaleInput, name?: string) => {
  if (!value) {
    return 0;
  }

  const supportedValues = Array.from({ length: MAX_TACHYONS_SCALE + 1 }, (_, i) => String(i));

  if (!supportedValues.includes(String(value))) {
    if (name) {
      console.warn(`Invalid ${name} value ("${value}"). It should be an integer between 0 and ${MAX_TACHYONS_SCALE}.`);
    }

    return 0;
  }

  return typeof value === "string" ? parseInt(value, 10) : value;
};

export const parseTachyonsGroup = <T>(group: TachyonsInputGroup<T>) => {
  const parsed = Object.entries(group).map<[string, number]>(([key, value]) => [
    key,
    parseTachyonsValue(value as TachyonsScaleInput, key)
  ]);

  return Object.fromEntries(parsed) as Group<T, number>;
};

const parseDimension = (input: string): null | number | string => {
  if (typeof input !== "string") {
    return null;
  }

  if (input === "grow") {
    return "grow";
  }

  const supportedUnits = ["%"];
  const match = input.match(new RegExp(`(\\d*)(${supportedUnits.join("|")})`));

  if (!match) {
    return null;
  }

  const value = match[1];

  if (value == null) {
    return null;
  }

  return parseInt(value, 10);
};

export const parseWidth = parseResponsive(parseDimension);

export const parseHeight = parseDimension;

/** Maps objects keys to Tachyons classes, and returns a function
 * that parses Tachyons scale values to the mapped classes,
 * which in turn returns a string of classNames.
 **/
const mapToClasses =
  <T>(map: { [key in keyof T]: string }) =>
  (props: { [key in keyof T]?: TachyonsScaleInput }) => {
    const pickedEntries = Object.keys(map)
      .filter((k) => k in props)
      .map((k) => [k, (props as Record<string, TachyonsScaleInput>)[k]] as [string, TachyonsScaleInput]);

    const parsedProps = parseTachyonsGroup(Object.fromEntries(pickedEntries));

    return Object.entries(parsedProps)
      .map(([key, value]) => `${(map as Record<string, string>)[key]}${value}`)
      .join(" ");
  };

export const parsePaddings = mapToClasses({
  paddingTop: "pt",
  paddingBottom: "pb",
  paddingLeft: "pl",
  paddingRight: "pr"
});

export const parseMargins = mapToClasses({
  marginTop: "mt",
  marginBottom: "mb",
  marginLeft: "ml",
  marginRight: "mr"
});

