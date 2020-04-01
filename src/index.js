import React, { useState, useEffect, forwardRef, useRef } from "react";
import { VariableSizeList } from "react-window";
import MeasurableList from "./MeasurableList";

/**
 * TL;DR
 * A virtualized list which handles item of varying sizes.
 *
 * This solution is a really naive one, basically we do the following actions:
 * 1. Render the whole list, without windowing!
 * 2. measure all of the cells and cache the size.
 * 3. Remove the list.
 * 4. Render the virtualized list using the cached sizes.
 *
 * Restrictions:
 * This solution will only work in the following cases
 * 1. It is feasible and possible (you have all of the data at hand) to load the data at the beginning for a brief time.
 * 2. Your data doesn't change size
 * 3. You don't add new items to the list (filtering works :))
 * 4. Currently this only supports vertical layout. (didn't have time to implement support for horizontal)
 *
 * Requirements:
 * In order for the cache to work each item in your data set must have an id which isn't based on
 * the items index (or else filtering will fail).
 */
const DynamicList = (
  {
    children,
    data,
    height,
    width,
    layout = "vertical",
    ...variableSizeListProps
  },
  ref
) => {
  const [measuring, setMeasuring] = useState(true);
  const [measurements, setMeasurements] = useState({});
  const localRef = ref || useRef();

  /**
   * In case the data length changed we need to reassign the current size to all of the indexes.
   */
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
      layout={layout}
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
