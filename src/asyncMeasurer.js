import ReactDOM from "react-dom";

const containerStyle = {
  display: "inline-block",
  position: "absolute",
  visibility: "hidden",
  zIndex: -1
};

export const createMeasureLayer = () => {
  // Creates the hidden div appended to the document body
  const container = document.createElement("div");
  container.setAttribute("id", "measure-layer");
  container.style = containerStyle;
  document.body.appendChild(container);
  return container;
};

export const destroyMeasureLayer = () => {
  const container = document.querySelector("#measure-layer");
  container.parentNode.removeChild(container);
};

const measureElement = element => {
  const container =
    document.querySelector("#measure-layer") || createMeasureLayer();

  // Renders the React element into the hidden div
  ReactDOM.render(element, container);

  // Gets the element size
  const child = container.querySelector("div").querySelector("div");
  const height = child.offsetHeight;
  const width = child.clientWidth;

  // Removes the element and its wrapper from the document
  ReactDOM.unmountComponentAtNode(container);

  return { height, width };
};

export default measureElement;
