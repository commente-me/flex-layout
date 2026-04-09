import React from "react";
import { defineMessages, useIntl } from "react-intl";
import { useCssHandles } from "vtex.css-handles";
import { useResponsiveValues } from "vtex.responsive-values";
import Container from "vtex.store-components/Container";

import { FlexLayoutContextProvider, FlexLayoutTypes, useFlexLayoutContext } from "./components/FlexLayoutContext";
import { useResponsiveWidth } from "./hooks/responsiveWidth";

import styles from "./styles/Row.css";

enum ColSizing {
  equal = "equal",
  auto = "auto"
}

export interface Props {
  children?: React.ReactNode;
  blockClass?: string;
  fullWidth?: boolean;
  ariaLabel?: string;
  htmlId?: string;
  preventHorizontalStretch?: boolean;
  colSizing?: ColSizing;
}

const CSS_HANDLES = ["flexRow", "flexRowContent"] as const;

const FlexLayout: StorefrontFunctionComponent<Props> = (props) => {
  const responsiveProps = useResponsiveValues(props) as Props;
  const context = useFlexLayoutContext();
  const { blockClass } = responsiveProps;
  const handles = useCssHandles(CSS_HANDLES, { blockClass });
  const intl = useIntl();

  const {
    children,
    fullWidth,
    ariaLabel: ariaLabelProp,
    htmlId,
    preventHorizontalStretch,
    colSizing,
  } = responsiveProps;

  const { cols, breakOnMobile } = useResponsiveWidth(children);

  const isSizingAuto = colSizing === ColSizing.auto;

  const isTopLevel = context.parent === FlexLayoutTypes.NONE;
  const shouldUseContainer = !fullWidth && isTopLevel;

  const ariaLabel = ariaLabelProp
    ? ariaLabelProp
    : intl.formatMessage({ id: "store/flex-layout.flexLayout-row.aria-label" }, { sectionId: htmlId ?? "row" });

  const content = (
    <FlexLayoutContextProvider parent={FlexLayoutTypes.ROW}>
      <div
        id={htmlId}
        aria-label={ariaLabel}
        className={`${handles.flexRow} ${handles.flexRowContent} ${
          breakOnMobile ? "flex-none flex-ns" : "flex"
        } items-stretch w-100`}
      >
        {cols.map((col, i) => (
          <div
            key={i}
            className={`${
              preventHorizontalStretch ? "" : styles.stretchChildrenWidth
            } ${col.width === "grow" ? "flex-grow-1" : ""} flex`}
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
