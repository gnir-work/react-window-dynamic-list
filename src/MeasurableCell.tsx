import React, { useEffect, useRef } from "react";

import { ListChildComponentProps } from "react-window";

const MeasurableCell = ({
  children,
  onMeasure
}) => {
  const ref = useRef();

  useEffect(() => {
      onMeasure({height: 10, width: 10})
  }, []);

  return <div ref={ref}>
      {children}
  </div>
};

export default MeasurableCell