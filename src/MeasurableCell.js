import React, { useEffect, useRef } from "react";

const Test = ({ input, output, onMeasure, id }) => {
  const ref = useRef();

  useEffect(() => {
    console.log(ref);
    onMeasure({ height: ref.current.offsetHeight, id });
  }, [id, onMeasure]);

  return (
    <div ref={ref}>
      <pre style={{ color: "green" }}>{input}</pre>
      <pre style={{ whiteSpace: "inherit" }}>{output}</pre>
    </div>
  );
};

export default Test;
