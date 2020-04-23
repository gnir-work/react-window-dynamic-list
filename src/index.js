import React, { forwardRef, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { VariableSizeList } from 'react-window';

import useShareForwardedRef from './utils/useShareForwardRef';
import Cache from './cache';
import measureElement, { createMeasureLayer, destroyMeasureLayer } from './asyncMeasurer';
import { defaultMeasurementContainer } from './defaultMeasurementContainer';
import createBackgroundTaskProcessor from './utils/backgroundTasks';

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
    onScroll,
    lazyMeasurement = true,
    measurementContainerElement = defaultMeasurementContainer,
    measurementMethod = () => [width],
    debug = false,
    ...variableSizeListProps
  },
  ref,
) => {
  const listRef = useShareForwardedRef(ref);
  const [listWidth, setListWidth] = useState(width);

  /**
   * Create measure layer on mount and destroy on unmount
   */
  const { current: measureLayer } = useRef(createMeasureLayer());
  useEffect(() => {
    return () => destroyMeasureLayer(measureLayer);
  }, []);

  /**
   * Background task processor instance
   */
  const { current: backgroundTaskProcessor } = useRef(createBackgroundTaskProcessor());

  /**
   * Only resize window if all items have actually been measured in the background else delay the resize
   * until this is done, double check if the resize hasn't already happened in the callback
   */
  useLayoutEffect(() => {
    backgroundTaskProcessor.setCallback(() => {
      if (listWidth !== width) {
        setListWidth(width);
      }
    });
    backgroundTaskProcessor.resume();
  }, [listWidth, width]);

  /**
   * Measure a specific item.
   * @param {number} index The index of the item in the data array.
   */
  const measureIndex = index => {
    const { id } = data[index];

    const MeasurementContainer = itemWidth => measurementContainerElement({
      style: { overflowY: 'scroll' },
      children: (
        <div style={{ overflow: 'auto' }}>
          {children({ index: data.findIndex(item => item.id === id), itemWidth })}
        </div>
      ),
    });

    // Get measure method for id
    const ranges = measurementMethod(id);

    // Calculate height for current width
    cache.values[id] = measureElement(
      MeasurementContainer,
      measureLayer,
      [listWidth],
      debug,
    );

    // If there are no more ranges to calculate, stop here and return
    if (ranges.length === 1 && ranges[0] === listWidth) {
      return;
    }

    // Calculate height for all width ranges
    backgroundTaskProcessor.add({
      id,
      task: () => {
        cache.values[id] = measureElement(
          MeasurementContainer,
          measureLayer,
          ranges,
          debug,
        );
      },
    });
  };

  /**
   * Measure all of the items in the background.
   * This could be a little tough in the site in the first seconds however it allows
   * fast jumping.
   */
  const lazyCacheFill = () => {
    data.forEach(({ id }, index) => {
      if (!cache.values[id]) {
        backgroundTaskProcessor.add({ id, task: () => itemSize(index) });
      }
    });
  };

  /**
   * Initiate cache filling and handle cleanup of measurement layer.
   */
  useEffect(() => {
    if (lazyMeasurement) {
      lazyCacheFill();
    }
  }, [lazyMeasurement]);

  /**
   * Recalculate items sizes when the list size has changed.
   */
  useLayoutEffect(() => {
    listRef.current.resetAfterIndex(0);
  }, [width, height]);

  /**
   * In case the data changed we need to reassign the current size to all of the indexes.
   */
  useEffect(() => {
    if (listRef.current) {
      listRef.current.resetAfterIndex(0);
    }
  }, [data.map(({ id }) => id).join()]);

  /**
   * Get the size of the item.
   * @param {number} index The index of the item in the data array.
   */
  const itemSize = index => {
    const { id } = data[index];

    // If measure method is a function, return value of function instead
    const method = measurementMethod(id);
    if (typeof method === 'function') {
      return method();
    }
    // If measure method is a value, return value instead
    if (typeof method === 'number') {
      return method;
    }

    // If the item hasn't been measured before, measure it
    if (!cache.values[id]) {
      measureIndex(index);
    }

    // Get size of item from breakpoints
    return cache.values[id].reduce((value, breakpoint) =>
      breakpoint.width <= width ? breakpoint.height : value, cache.values[id].slice(-1)[0].height);
  };

  const scrollIdleTimeout = useRef(null);
  const handleScroll = e => {
    // Call scroll prop if available
    if (onScroll) {
      onScroll(e);
    }

    // Stop the background tasks to guarantee smooth scroll and start
    // the background tasks again 100ms after the user stop scrolling
    backgroundTaskProcessor.pause();
    clearTimeout(scrollIdleTimeout.current);
    scrollIdleTimeout.current = setTimeout(() => {
      backgroundTaskProcessor.resume();
    }, 100);
  };

  return (
    <VariableSizeList
      onScroll={handleScroll}
      layout="vertical"
      ref={listRef}
      itemSize={itemSize}
      height={height}
      width={listWidth}
      itemCount={data.length}
      {...variableSizeListProps}
    >
      {childrenProp => children({ ...childrenProp, itemWidth: listWidth })}
    </VariableSizeList>
  );
};

export default forwardRef(DynamicList);
