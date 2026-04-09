import React, { FunctionComponent, useContext, useMemo } from "react";

export enum FlexLayoutTypes {
  NONE = "none",
  ROW = "row",
  COL = "col"
}

export interface FlexLayoutContextProps {
  parent: FlexLayoutTypes;
}

const FlexLayoutContext = React.createContext<FlexLayoutContextProps>({
  parent: FlexLayoutTypes.NONE
});

export const FlexLayoutContextProvider: FunctionComponent<FlexLayoutContextProps> = ({
  parent,
  children
}) => {
  const value = useMemo(() => ({ parent }), [parent]);

  return <FlexLayoutContext.Provider value={value}>{children}</FlexLayoutContext.Provider>;
};

export const useFlexLayoutContext = () => useContext(FlexLayoutContext);
