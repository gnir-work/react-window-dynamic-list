import React, { useEffect, forwardRef, useLayoutEffect } from "react";
import { VariableSizeList } from "react-window";
import debounce from "lodash.debounce";

import useShareForwardedRef from "./utils/useShareForwardRef";
import Cache from "./cache";
import measureElement, { destroyMeasureLayer } from "./asyncMeasurer";
import { defaultMeasurementContainer } from "./defaultMeasurementContainer";

/**
 * Create the dynamic list's cache object.
 * @param {Object} knownSizes a mapping between an items id and its size.
 */
export const createCache = (knownSizes = {}) => new Cache(knownSizes);

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
    recalculateItemsOnResize = { width: true, height: true },
    measurementContainerElement = defaultMeasurementContainer,
    debug = false,
    ...variableSizeListProps
  },
  ref
) => {
  const listRef = useShareForwardedRef(ref);
  const containerResizeDeps = [];

  if (recalculateItemsOnResize.width) {
    containerResizeDeps.push(width);
  }
  if (recalculateItemsOnResize.height) {
    containerResizeDeps.push(height);
  }

  /**
   * Measure a specific item.
   * @param {number} index The index of the item in the data array.
   */
  const measureIndex = index => {
    const ItemContainer = (
      <div id="item-container" style={{ overflow: "auto" }}>
        {children({ index })}
      </div>
    );

    const MeasurementContainer = measurementContainerElement({
      style: { width, height, overflowY: "scroll" },
      children: ItemContainer
    });

    const { height: measuredHeight } = measureElement(
      MeasurementContainer,
      debug
    );
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
        if (!cache.values[id]) {
          const height = measureIndex(index);

          // Double check in case the main thread already populated this id
          if (!cache.values[id]) {
            cache.values[id] = height;
          }
        }
      }, 0);
    });
  };

  const handleListResize = debounce(() => {
    cache.clearCache();
    listRef.current.resetAfterIndex(0);
    lazyCacheFill();
  }, 50);

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
   * Recalculate items size of the list size has changed.
   */
  useLayoutEffect(() => {
    handleListResize();
  }, containerResizeDeps);

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
    if (cache.values[id]) {
      return cache.values[id];
    } else {
      const height = measureIndex(index);
      cache.values[id] = height;
      return height;
    }
  };

  return (
    <VariableSizeList
      layout="vertical"
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
