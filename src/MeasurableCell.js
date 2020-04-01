import React, { useEffect } from "react";

import useDimensions from "react-use-dimensions";

const MeasurableCell = ({ children, onMeasure, index }) => {
  const [ref, { width, height }] = useDimensions();

  useEffect(() => {
    onMeasure({ height, width });
  }, []);

  return <div ref={ref}>{children({ index })}</div>;
};

export default MeasurableCell;
