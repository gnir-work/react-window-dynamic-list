import React, { useEffect, useRef } from "react";

/**
 * A small wrapper which calculate the height of its children.
 */
const MeasurableCell = ({ children, index, onMeasure, id }) => {
  const ref = useRef();

  useEffect(() => {
    onMeasure({ height: ref.current.offsetHeight, id });
  }, []);

  return (
    // overflow auto is used here in order to catch the margin and padding as part of the height.
    <div style={{ overflow: "auto" }} ref={ref}>
      {children({ index })}
    </div>
  );
};

export default MeasurableCell;
