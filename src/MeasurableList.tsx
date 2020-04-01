import React from "react";

import MeasurableCell from "./MeasurableCell";
import { ListChildComponentProps } from "react-window";

const MeasurableList = ({
  children,
  width,
  height,
  onMeasurementFinish,
  data
}) => {
  const measurements = {};

  const handleMeasure = (id, cellMeasurement) => {
    measurements[id] = cellMeasurement;
    if (Object.values(measurements).length === data.length) {
      onMeasurementFinish(measurements);
    }
  };

  return (
    <div style={{ height, width }}>
      {data.map(item => (
        <MeasurableCell
          onMeasure={(cellMeasurement) => {
            handleMeasure(item.id, cellMeasurement);
          }}
        >
          {children}
        </MeasurableCell>
      ))}
    </div>
  );
};

export default MeasurableList;
