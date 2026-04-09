interface ResponsiveInput<T> {
  mobile: T;
  desktop: T;
}

//eslint-disable-next-line @typescript-eslint/no-explicit-any
const isResponsiveInput = <T>(value: any): value is ResponsiveInput<T> =>
  value && value.mobile != null && value.desktop != null;

const parseResponsive =
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

const parseDimension = (input: string): null | number | string => {
  if (typeof input !== "string") {
    return null;
  }

  if (input === "grow") {
    return "grow";
  }

  const match = input.match(/(\d+)(%)/);

  if (!match || match[1] == null) {
    return null;
  }

  return parseInt(match[1], 10);
};

export const parseWidth = parseResponsive(parseDimension);
