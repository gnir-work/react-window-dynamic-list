import React, {
  forwardRef,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from "react";
import { VariableSizeList } from "react-window";

import useShareForwardedRef from "./utils/useShareForwardRef";
import Cache from "./cache";
import measureElement, {
  createMeasureLayer,
  destroyMeasureLayer
} from "./asyncMeasurer";
import { defaultMeasurementContainer } from "./defaultMeasurementContainer";
import createBackgroundTaskProcessor from "./utils/backgroundTasks";
import useLazyInstance from "./utils/useLazyInstance";

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
  ref
) => {
  const listRef = useShareForwardedRef(ref);
  const [listWidth, setListWidth] = useState(width);

  /**
   * Lazy measure layer instance
   */
  const getMeasureLayer = useLazyInstance(createMeasureLayer, layer =>
    destroyMeasureLayer(layer)
  );

  /**
   * Lazy background task processor instance
   */
  const getBackgroundTaskProcessor = useLazyInstance(
    createBackgroundTaskProcessor,
    processor => processor.pause()
  );

  /**
   * Only resize window if all items have actually been measured in the background else delay the resize
   * until this is done, double check if the resize hasn't already happened in the callback
   */
  useLayoutEffect(() => {
    getBackgroundTaskProcessor().setCallback(() => {
      if (listWidth !== width) {
        setListWidth(width);
      }
    });
    getBackgroundTaskProcessor().resume();
  }, [listWidth, width]);

  /**
   * Measure a specific item.
   * @param {number} index The index of the item in the data array.
   */
  const measureIndex = index => {
    const { id } = data[index];

    const MeasurementContainer = itemWidth =>
      measurementContainerElement({
        style: { overflowY: "scroll" },
        children: (
          <div style={{ overflow: "auto" }}>
            {children({ index, itemWidth })}
          </div>
        )
      });

    // Get measure method for id
    const ranges = measurementMethod(index);

    // Calculate height for current width
    cache.values[id] = measureElement(
      MeasurementContainer,
      getMeasureLayer(),
      [width],
      debug
    );

    // If there are no more ranges to calculate, stop here and return
    if (ranges.length === 1 && ranges[0] === width) {
      return;
    }

    // Calculate height for all width ranges
    getBackgroundTaskProcessor().add({
      id,
      task: () => {
        cache.values[id] = measureElement(
          MeasurementContainer,
          getMeasureLayer(),
          ranges,
          debug
        );
      }
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
        getBackgroundTaskProcessor().add({ id, task: () => itemSize(index) });
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
    if (listRef.current) {
      listRef.current.resetAfterIndex(0);
    }
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

    const method = measurementMethod(index, width);
    // If measure method returns a height value, return this value instead
    if (typeof method === "number") {
      return method;
    }

    // If the item hasn't been measured before, measure it
    if (!cache.getSize(id, width)) {
      measureIndex(index);
    }

    // Get size of item from breakpoints
    return cache.getSize(id, width);
  };

  const scrollIdleTimeout = useRef(null);
  const handleScroll = e => {
    // Call scroll prop if available
    if (onScroll) {
      onScroll(e);
    }

    // Stop the background tasks to guarantee smooth scroll and start
    // the background tasks again 100ms after the user stop scrolling
    getBackgroundTaskProcessor().pause();
    clearTimeout(scrollIdleTimeout.current);
    scrollIdleTimeout.current = setTimeout(() => {
      getBackgroundTaskProcessor().resume();
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
      {({ index, ...childrenProps }) =>
        children({ ...childrenProps, index, itemWidth: listWidth })
      }
    </VariableSizeList>
  );
};

export default forwardRef(DynamicList);
