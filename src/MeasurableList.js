import React from "react";
import MeasurableCell from "./MeasurableCell";

const MeasurableList = ({
  children,
  data,
  onMeasurementFinish,
  width,
  height
}) => {
  const mapping = {};

  const handleMeasure = ({ id, height }) => {
    mapping[id] = height;
    if (Object.values(mapping).length === data.length) {
      onMeasurementFinish(mapping);
    }
  };

  return (
    <div style={{ width, height, overflowY: "auto" }}>
      {data.map((command, index) => (
        <MeasurableCell
          key={command.id}
          onMeasure={handleMeasure}
          id={command.id}
          index={index}
        >
          {children}
        </MeasurableCell>
      ))}
    </div>
  );
};

export default MeasurableList;
