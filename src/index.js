import React from "react";
import MeasurableList from "./MeasurableList";
import DynamicList from "./DynamicList";

export const ExampleComponent = ({ data }) => {
  return (
    <DynamicList data={data} width={300} height={600}>
      {({ index, style }) => (
        <div style={style}>
          <pre style={{ whiteSpace: "inherit" }}>{data[index].output}</pre>{" "}
        </div>
      )}
    </DynamicList>
  );
};
