import React from "react";
import { useDevice } from "vtex.device-detector";
import { parseWidth } from "../modules/valuesParser";

interface ColWithWidth {
  element: React.ReactNode;
  width: number | string;
  hasDefinedWidth: boolean;
  isResponsive: boolean;
}

/** Distributes the available width--width that remains after subtracting
 * the widths of the columns the user has set--between the columns that do
 * not have their widths set by the user.
 *
 * For example:
 * There are 3 columns. The user sets the width for the first one to 50%.
 * This function will set the widths of the second and third columns to 25%.
 */
const distributeAvailableWidth = (cols: ColWithWidth[]) => {
  const { availableWidth, remainingColsNum, hasAnyWidthGrow } = cols.reduce(
    (acc, col) => {
      const isGrow = col.width === "grow";
      const width = typeof col.width === "number" ? acc.availableWidth - col.width : 0;

      return {
        availableWidth: isGrow ? 0 : width,
        remainingColsNum: acc.remainingColsNum + (col.hasDefinedWidth ? 0 : 1),
        hasAnyWidthGrow: acc.hasAnyWidthGrow || isGrow
      };
    },
    {
      availableWidth: 100,
      remainingColsNum: 0,
      hasAnyWidthGrow: false
    }
  );

  if (availableWidth < 0 && !hasAnyWidthGrow) {
    const normalization = -(100 / availableWidth);
    cols = cols.map((col) => ({
      ...col,
      width: typeof col.width === "number" ? col.width * normalization : col.width
    }));
  }

  return cols.map((col) => {
    const definedWidth = typeof col.width === "number" ? `${col.width}%` : col.width;

    return {
      element: col.element,
      width: col.hasDefinedWidth
        ? definedWidth
        : `${Math.floor(Math.max(0, availableWidth) / remainingColsNum)}%`,
      hasDefinedWidth: col.hasDefinedWidth
    };
  });
};

function isReactElement(element: unknown): element is React.ReactElement {
  return React.isValidElement(element);
}

export const useResponsiveWidth = (children: React.ReactNode) => {
  const { device } = useDevice();

  const isPhone = device === "phone";

  const cols: ColWithWidth[] = React.Children.toArray(children).map((col) => {
    if (!isReactElement(col)) {
      return {
        element: col,
        width: 0,
        hasDefinedWidth: false,
        isResponsive: true
      };
    }

    const width = parseWidth(col.props.width || (col.props.blockProps && col.props.blockProps.width));

    if (width && typeof width === "object") {
      return {
        element: col,
        width: isPhone ? width.mobile || 0 : width.desktop || 0,
        hasDefinedWidth: true,
        isResponsive: true
      };
    }

    if (isPhone) {
      return {
        element: col,
        width: 0,
        hasDefinedWidth: false,
        isResponsive: false
      };
    }

    if (typeof width === "number" || typeof width === "string") {
      return {
        element: col,
        width,
        hasDefinedWidth: true,
        isResponsive: false
      };
    }

    return {
      element: col,
      width: 0,
      hasDefinedWidth: false,
      isResponsive: true
    };
  });

  const isAnyColResponsive = cols.some((col) => col.isResponsive);
  const breakOnMobile = isPhone && !isAnyColResponsive;

  return {
    cols: distributeAvailableWidth(cols),
    breakOnMobile
  };
};
