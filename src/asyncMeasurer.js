import { renderToString } from "react-dom/server";

const measureLayerStyle = {
  display: "inline-block",
  position: "absolute",
  top: "-9999px",
  left: "-9999px",
  visibility: "hidden",
  zIndex: -1,
};

/**
 * Creates the hidden div appended to the document body
 */
export const createMeasureLayer = () => {
  const measureLayer = document.createElement("div");
  Object.entries(measureLayerStyle).forEach(
    ([property, value]) => (measureLayer.style[property] = value)
  );
  document.body.appendChild(measureLayer);
  return measureLayer;
};

/**
 * Destroy the measuring layer.
 * Should be called when the dynamic list is unmounted.
 */
export const destroyMeasureLayer = (measureLayer) => {
  if (measureLayer) {
    document.body.removeChild(measureLayer);
  }
};

/**
 * Measure an element by temporary rendering it.
 */
const measureElement = (element, measureLayer, ranges, debug) => {
  // Breakpoints with corresponding heights calculated from measure ranges
  const breakpoints = [];

  // Measure height for width
  const measureHeightForWidth = (width) => {
    let breakpoint = breakpoints.find(
      (breakpoint) => breakpoint.width === width
    );
    if (breakpoint === undefined) {
      measureLayer.style.width = width + "px";
      breakpoint = {
        width: width,
        height: measureLayer.firstElementChild.offsetHeight,
      };
      breakpoints.push(breakpoint);
    }
    return breakpoint.height;
  };

  // Measure heights inside width range
  const measureHeightsForWidthRange = ([min, max]) => {
    const minHeight = measureHeightForWidth(min);
    if (min === max || max === undefined) {
      return; // If the range is a single value return
    }
    const maxHeight = measureHeightForWidth(max);
    if (minHeight === maxHeight) {
      return; // If the height difference is 0, assume all heights inside the range are the same and return
    }

    const middle = min + Math.round((max - min) / 2);
    if (middle > min + 1) measureHeightsForWidthRange([min, middle]);
    if (middle < max - 1) measureHeightsForWidthRange([middle, max]);
    if (middle === max - 1) measureHeightForWidth(middle);
  };

  // Get breakpoints for all width ranges/values
  ranges
    .map((value) => (Array.isArray(value) ? value : [value, value])) // Convert values into ranges
    .forEach(([min, max]) => {
      // Renders the React element into the hidden div
      measureLayer.innerHTML = renderToString(element(max));

      // Measures the above React element for given width range
      measureHeightsForWidthRange([min, max]);
    });

  // Removes the element from the document
  if (!debug) {
    measureLayer.innerHTML = "";
  }

  // Reduce breakpoints to only unique heights
  let currentHeight = 0;
  const reduced = [];
  breakpoints
    .sort(({ width: a }, { width: b }) => a - b)
    .forEach((breakpoint) => {
      if (breakpoint.height !== currentHeight) {
        reduced.push(breakpoint);
        currentHeight = breakpoint.height;
      }
    });

  return reduced;
};

export default measureElement;
