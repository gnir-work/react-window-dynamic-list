import React, { useState } from "react";
import { VariableSizeList } from "react-window";
import MeasurableList from "./MeasurableList";

const DynamicList = ({
  children,
  data,
  height,
  width,
  ...variableSizeListProps
}) => {
  const [measuring, setMeasuring] = useState(true);
  const [measurements, setMeasurements] = useState({});

  const handleMeasurementFinish = newMeasurements => {
    setMeasurements(newMeasurements);
    setMeasuring(false);
  };

  const itemSize = index => {
    const height = measurements[data[index].id];
    console.log(height);
    return height;
  };

  return !measuring ? (
    <VariableSizeList
      itemSize={itemSize}
      height={height}
      width={width}
      itemCount={data.length}
      {...variableSizeListProps}
    >
      {children}
    </VariableSizeList>
  ) : (
    <MeasurableList
      height={height}
      width={width}
      data={data}
      onMeasurementFinish={handleMeasurementFinish}
    >
      {children}
    </MeasurableList>
  );
};

export default DynamicList;
