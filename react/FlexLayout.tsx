import React from "react";
import { defineMessages, useIntl } from "react-intl";
import { useCssHandles } from "vtex.css-handles";
import { useResponsiveValues } from "vtex.responsive-values";
import Container from "vtex.store-components/Container";

import { FlexLayoutContextProvider, FlexLayoutTypes, useFlexLayoutContext } from "./components/FlexLayoutContext";
import { useResponsiveWidth } from "./hooks/responsiveWidth";
import {
  parseBorders,
  parseMargins,
  parsePaddings,
  parseTachyonsGroup,
  TachyonsScaleInput,
  toSpacingValue
} from "./modules/valuesParser";

import styles from "./styles/Row.css";

enum ColSizing {
  equal = "equal",
  auto = "auto"
}

enum ColJustify {
  between = "between",
  around = "around",
  left = "left",
  right = "right",
  center = "center"
}

const HorizontalAlignments = {
  [ColJustify.between]: "justify-between",
  [ColJustify.around]: "justify-around",
  [ColJustify.left]: "justify-start",
  [ColJustify.center]: "justify-center",
  [ColJustify.right]: "justify-end"
};

export interface Props extends Flex, Gap, Border {
  children?: React.ReactNode;
  blockClass?: string;
  fullWidth?: boolean;
  arialabel?: string;
  htmlId?: string;
  marginTop: TachyonsScaleInput;
  marginBottom: TachyonsScaleInput;
  paddingTop: TachyonsScaleInput;
  paddingBottom: TachyonsScaleInput;
  preserveLayoutOnMobile?: boolean;
  preventHorizontalStretch?: boolean;
  preventVerticalStretch?: boolean;
  colSizing?: ColSizing;
  horizontalAlign?: ColJustify;
  colJustify?: ColJustify;
  experimentalHideEmptyCols?: boolean;
}

const CSS_HANDLES = ["flexRow", "flexRowContent"] as const;

const FlexLayout: StorefrontFunctionComponent<Props> = (props) => {
  const responsiveProps = useResponsiveValues(props) as Props;
  const context = useFlexLayoutContext();
  const handles = useCssHandles(CSS_HANDLES);
  const intl = useIntl();

  const {
    children,
    fullWidth,
    arialabel,
    htmlId,
    colGap,
    rowGap,
    marginTop,
    marginBottom,
    paddingTop,
    paddingBottom,
    border,
    borderWidth,
    borderColor,
    preserveLayoutOnMobile,
    preventHorizontalStretch,
    preventVerticalStretch,
    horizontalAlign,
    colSizing,
    colJustify = ColJustify.between,
    experimentalHideEmptyCols = false
  } = responsiveProps;

  const gaps = parseTachyonsGroup({
    colGap: colGap != null ? colGap : context.colGap,
    rowGap: rowGap != null ? rowGap : context.rowGap
  });

  const margins = parseMargins({ marginTop, marginBottom });
  const paddings = parsePaddings({ paddingTop, paddingBottom });
  const borders = parseBorders({ border, borderWidth, borderColor });

  const { cols, breakOnMobile } = useResponsiveWidth(children, {
    preserveLayoutOnMobile,
    hideEmptyCols: experimentalHideEmptyCols
  });

  const isSizingAuto = colSizing === ColSizing.auto;

  let horizontalAlignClass = isSizingAuto ? HorizontalAlignments[colJustify] : HorizontalAlignments.left;

  if (horizontalAlign != null) {
    horizontalAlignClass = HorizontalAlignments[horizontalAlign];
  }

  const isTopLevel = context.parent === FlexLayoutTypes.NONE;
  const shouldUseContainer = !fullWidth && isTopLevel;

  const ariaLabel = arialabel
    ? arialabel
    : intl.formatMessage({ id: "store/flex-layout.flexLayout-row.aria-label" }, { sectionId: htmlId ?? "row" });

  const content = (
    <FlexLayoutContextProvider parent={FlexLayoutTypes.ROW} {...gaps}>
      <div
        id={htmlId}
        aria-label={ariaLabel}
        className={`${handles.flexRow} ${handles.flexRowContent} ${
          breakOnMobile ? "flex-none flex-ns" : "flex"
        } ${margins} ${paddings} ${borders} ${horizontalAlignClass} items-stretch w-100`}
        style={gaps.colGap > 0 ? { columnGap: toSpacingValue(gaps.colGap) } : undefined}
      >
        {cols.map((col, i) => (
          <div
            key={i}
            className={`${
              breakOnMobile ? `pb${gaps.rowGap} pb0-ns` : ""
            } ${preventVerticalStretch ? "" : "items-stretch"} ${
              preventHorizontalStretch ? "" : styles.stretchChildrenWidth
            } ${col.width === "grow" ? "flex-grow-1" : ""} ${experimentalHideEmptyCols ? styles.col : ""} flex`}
            style={{
              width:
                preventHorizontalStretch || (isSizingAuto && !col.hasDefinedWidth)
                  ? "auto"
                  : breakOnMobile
                    ? "100%"
                    : col.width
            }}
          >
            {col.element}
          </div>
        ))}
      </div>
    </FlexLayoutContextProvider>
  );

  return shouldUseContainer ? <Container>{content}</Container> : content;
};

const messages = defineMessages({
  title: {
    defaultMessage: "",
    id: "admin/editor.row.title"
  },
  description: {
    defaultMessage: "",
    id: "admin/editor.row.description"
  }
});

FlexLayout.schema = {
  title: messages.title.id,
  description: messages.description.id
};

export default FlexLayout;
