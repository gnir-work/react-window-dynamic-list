import React from "react";
import MeasurableList from "./MeasurableList";

export const ExampleComponent = ({ data }) => {
  return (
    <MeasurableList
      data={data}
      width={300}
      height={600}
      onMeasurementFinish={console.log}
    >
      {({ index }) => <div> {data[index].text} </div>}
    </MeasurableList>
  );
};
