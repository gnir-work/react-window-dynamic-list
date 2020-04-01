import React, { useEffect, useRef } from "react";

const MeasurableCell = ({ children, index, onMeasure, id }) => {
  const ref = useRef();

  useEffect(() => {
    onMeasure({ height: ref.current.offsetHeight, id });
  }, []);

  return (
    <div style={{ overflow: "auto" }} ref={ref}>
      {children({ index })}
    </div>
  );
};

export default MeasurableCell;
