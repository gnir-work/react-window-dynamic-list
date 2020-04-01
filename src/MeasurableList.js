import React from "react";

import MeasurableCell from "./MeasurableCell";

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
    <div style={{ height, width, overflowX: "auto" }}>
      {data.map((item, index) => (
        <MeasurableCell
          key={index}
          index={index}
          onMeasure={cellMeasurement => {
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
