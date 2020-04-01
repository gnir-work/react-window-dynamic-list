import React, { useState, useEffect, forwardRef, useRef } from "react";
import { VariableSizeList } from "react-window";
import MeasurableList from "./MeasurableList";

const DynamicList = (
  { children, data, height, width, ...variableSizeListProps },
  ref
) => {
  const [measuring, setMeasuring] = useState(true);
  const [measurements, setMeasurements] = useState({});
  const localRef = ref || useRef();

  useEffect(() => {
    if (localRef.current) {
      localRef.current.resetAfterIndex(0);
    }
  }, [data.length]);

  const handleMeasurementFinish = newMeasurements => {
    setMeasurements(newMeasurements);
    setMeasuring(false);
  };

  const itemSize = index => {
    const height = measurements[data[index].id];
    return height;
  };

  return !measuring ? (
    <VariableSizeList
      ref={localRef}
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

export default forwardRef(DynamicList);
