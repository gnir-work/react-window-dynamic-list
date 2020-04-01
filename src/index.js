import React, { useState, useEffect, useRef } from "react";
import { VariableSizeList } from "react-window";
import MeasurableList from "./MeasurableList";

const DynamicList = ({
  children,
  data,
  height,
  width,
  ...variableSizeListProps
}) => {
  const variableListRef = useRef();
  const [measuring, setMeasuring] = useState(true);
  const [measurements, setMeasurements] = useState({});

  useEffect(() => {
    if (variableListRef.current) {
      variableListRef.current.resetAfterIndex(0);
    }
  }, data);

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
      ref={variableListRef}
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
