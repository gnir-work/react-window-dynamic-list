import React, { useEffect, forwardRef, useRef, useLayoutEffect } from "react";
import { VariableSizeList } from "react-window";
import Cache from "./cache";
import debounce from "lodash.debounce";
import measureElement, { destroyMeasureLayer } from "./asyncMeasurer";

/**
 * Share forwarded ref.
 * https://gist.github.com/pie6k/b4717f392d773a71f67e110b42927fea
 */
const useShareForwardedRef = forwardedRef => {
  const innerRef = useRef(null);

  useEffect(() => {
    if (!forwardedRef) {
      return;
    }
    if (typeof forwardedRef === 'function') {
      forwardedRef(innerRef.current);
      return;
    } else {
      forwardedRef.current = innerRef.current;
    }
  });

  return innerRef;
};

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
    onRefSet = () => {},
    layout = "vertical",
    recalculateItemsOnResize = { width: true, height: true },
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
    const WrappedItem = (
      <div style={{ width, height, overflowY: "auto" }}>
        <div
          id="item-container"
          style={{ overflow: "auto", overflowY: "scroll" }}
        >
          {children({ index })}
        </div>
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
