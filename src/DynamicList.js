import React, { useState } from "react";
import { VariableSizeList, VariableSizeListProps } from "react-window";


const DynamicList = ({
  children,
  ...variableSizeListProps
}) => {
  const [measuring, setMeasuring] = useState(false);

  

  return measuring ? (
    <VariableSizeList {...variableSizeListProps}>
      {children}
    </VariableSizeList>
  ) : (
  );
};

export default DynamicList;
