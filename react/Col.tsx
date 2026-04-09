import React from "react";
import { defineMessages } from "react-intl";
import { useCssHandles } from "vtex.css-handles";

import { FlexLayoutContextProvider, FlexLayoutTypes, useFlexLayoutContext } from "./components/FlexLayoutContext";

interface Props {
  blockClass?: string;
}

const CSS_HANDLES = ["flexCol", "flexColChild"] as const;

const Col: StorefrontFunctionComponent<Props> = ({ children, blockClass }) => {
  const context = useFlexLayoutContext();
  const handles = useCssHandles(CSS_HANDLES, { blockClass });

  if (context.parent === FlexLayoutTypes.NONE) {
    console.warn("A `flex-layout.col` block is being used outside of a `flex-layout.row`. It will not be rendered.");
    return null;
  }

  return (
    <FlexLayoutContextProvider parent={FlexLayoutTypes.COL}>
      <div className={`${handles.flexCol} ${handles.flexColChild} flex flex-column w-100`}>
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
