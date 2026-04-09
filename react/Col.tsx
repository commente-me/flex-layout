import React from "react";
import { defineMessages } from "react-intl";
import { useCssHandles } from "vtex.css-handles";
import { useResponsiveValues } from "vtex.responsive-values";

import { FlexLayoutContextProvider, FlexLayoutTypes, useFlexLayoutContext } from "./components/FlexLayoutContext";
import {
  TachyonsScaleInput,
  parseMargins,
  parsePaddings,
  parseTachyonsGroup,
  toSpacingValue
} from "./modules/valuesParser";

enum VerticalAlign {
  top = "top",
  middle = "middle",
  bottom = "bottom"
}

enum HorizontalAlign {
  left = "left",
  right = "right",
  center = "center"
}

interface Props extends Gap {
  blockClass?: string;
  height?: TachyonsScaleInput;
  marginLeft: TachyonsScaleInput;
  marginRight: TachyonsScaleInput;
  paddingLeft: TachyonsScaleInput;
  paddingRight: TachyonsScaleInput;
  preventVerticalStretch?: boolean;
  verticalAlign?: VerticalAlign;
  horizontalAlign?: HorizontalAlign;
}

const parseVerticalAlign = (input?: string) => {
  switch (input) {
    case VerticalAlign.middle:
      return "justify-center";
    case VerticalAlign.bottom:
      return "justify-end";
  }
  return "";
};

const parseHorizontalAlign = (input?: string) => {
  switch (input) {
    case HorizontalAlign.center:
      return "items-center";
    case HorizontalAlign.right:
      return "items-end";
  }
  return "";
};

const CSS_HANDLES = ["flexCol", "flexColChild"] as const;

const Col: StorefrontFunctionComponent<Props> = ({ children, ...props }) => {
  const {
    blockClass,
    colGap,
    rowGap,
    marginLeft,
    marginRight,
    paddingLeft,
    paddingRight,
    height,
    preventVerticalStretch,
    verticalAlign,
    horizontalAlign
  } = useResponsiveValues(props) as Props;

  const context = useFlexLayoutContext();
  const handles = useCssHandles(CSS_HANDLES, { blockClass });

  if (context.parent === FlexLayoutTypes.NONE) {
    return null;
  }

  const gaps = parseTachyonsGroup({
    colGap: colGap != null ? colGap : context.colGap,
    rowGap: rowGap != null ? rowGap : context.rowGap
  });

  const margins = parseMargins({ marginLeft, marginRight });
  const paddings = parsePaddings({ paddingLeft, paddingRight });

  const vertical = parseVerticalAlign(verticalAlign);
  const horizontal = parseHorizontalAlign(horizontalAlign);

  const parsedHeight = height !== undefined
    ? toSpacingValue(parseTachyonsGroup({ height }).height)
    : undefined;

  return (
    <FlexLayoutContextProvider parent={FlexLayoutTypes.COL} {...gaps}>
      <div
        className={`${handles.flexCol} ${handles.flexColChild} ${margins} ${paddings} ${vertical} ${horizontal} flex flex-column h-100 w-100`}
        style={{
          height: parsedHeight ?? (preventVerticalStretch || verticalAlign ? "auto" : "100%"),
          rowGap: gaps.rowGap > 0 ? toSpacingValue(gaps.rowGap) : undefined
        }}
      >
        {children}
      </div>
    </FlexLayoutContextProvider>
  );
};

const messages = defineMessages({
  title: {
    defaultMessage: "",
    id: "admin/editor.column.title"
  },
  description: {
    defaultMessage: "",
    id: "admin/editor.column.description"
  }
});

Col.schema = {
  title: messages.title.id,
  description: messages.description.id
};

export default Col;
