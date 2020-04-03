import React, { useEffect, forwardRef, useRef } from "react";
import { VariableSizeList } from "react-window";
import measureElement, { destroyMeasureLayer } from "./asyncMeasurer";

/**
 * Create the dynamic list's cache object.
 * @param {Object} knownSizes a mapping between an items id and its size.
 */
export const createCache = (knownSizes = {}) => ({
  ...knownSizes
});

/**
 * A virtualized list which handles item of varying sizes.
 * Read the implementation section in the README for additional information on the general algorithm.
 */
const DynamicList = (
  {
    children,
    data,
    height,
    width,
    cache,
    lazyMeasurement = true,
    onRefSet = () => {},
    layout = "vertical",
    ...variableSizeListProps
  },
  ref
) => {
  const localRef = useRef();
  const listRef = ref || localRef;

  /**
   * Measure a specific item.
   * @param {number} index The index of the item in the data array.
   */
  const measureIndex = index => {
    const WrappedItem = (
      <div style={{ width, height, overflowY: "auto" }}>
        <div style={{ overflow: "auto" }}>{children({ index })}</div>
      </div>
    );
    const { height: measuredHeight } = measureElement(WrappedItem);
    return measuredHeight;
  };

  /**
   * Measure all of the items in the background.
   * This could be a little tough in the site in the first seconds however it allows
   * fast jumping.
   */
  const lazyCacheFill = () => {
    data.forEach(({ id }, index) => {
      // We use set timeout here in order to execute the measuring in a background thread.
      setTimeout(() => {
        if (!cache[id]) {
          const height = measureIndex(index);

          // Double check in case the main thread already populated this id
          if (!cache[id]) {
            cache[id] = height;
          }
        }
      }, 0);
    });
  };

  /**
   * Initiate cache filling and handle cleanup of measurement layer.
   */
  useEffect(() => {
    if (lazyMeasurement) {
      lazyCacheFill();
    }
    return destroyMeasureLayer;
  }, []);

  /**
   * In case the data length changed we need to reassign the current size to all of the indexes.
   */
  useEffect(() => {
    if (listRef.current) {
      listRef.current.resetAfterIndex(0);
    }
  }, [data.length]);

  /**
   * Get the size of the item.
   * @param {number} index The index of the item in the data array.
   */
  const itemSize = index => {
    const { id } = data[index];
    if (cache[id]) {
      return cache[id];
    } else {
      const height = measureIndex(index);
      cache[id] = height;
      return height;
    }
  };

  return (
    <VariableSizeList
      layout={layout}
      ref={listRef}
      itemSize={itemSize}
      height={height}
      width={width}
      itemCount={data.length}
      {...variableSizeListProps}
    >
      {children}
    </VariableSizeList>
  );
};

export default forwardRef(DynamicList);
