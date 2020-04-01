import React, { useEffect } from "react";

import useDimensions from "react-use-dimensions";

const MeasurableCell = ({ children, onMeasure, index }) => {
  const [ref, { width, height }] = useDimensions();

  useEffect(() => {
    if (!isNaN(height) && !isNaN(width)) {
      onMeasure({ height, width });
    }
  }, [width, height]);

  return <div ref={ref}>{children({ index })}</div>;
};

export default MeasurableCell;
