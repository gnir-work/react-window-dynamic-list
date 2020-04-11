import React, { useState, useRef, useEffect, useCallback } from "react";

import DynamicList, { createCache } from "react-window-dynamic-list";
import AutoSizer from "react-virtualized-auto-sizer";
import { ResizableBox } from "react-resizable";

import { generateCommands, generateCommand } from "./utils";
import { Input, InputNumber, Button } from "antd";

import "react-resizable/css/styles.css";
import "antd/dist/antd.compact.min.css";
import "./App.css";

const cache = createCache();

const App = () => {
  const [commands, setCommands] = useState(generateCommands());
  const [filter, setFilter] = useState("");
  const [row, setRow] = useState(200);
  const [shouldShowList, setShouldShowList] = useState(true);
  const dynamicListRef = useRef();

  const filteredCommands = commands.filter(command =>
    JSON.stringify(command).includes(filter)
  );

  const addCommand = () => {
    setCommands([...commands, generateCommand(commands.length)]);
  };

  const handleFilterChange = event => {
    setFilter(event.target.value);
  };

  const jumpToRow = useCallback(() => {
    if (dynamicListRef.current) {
      dynamicListRef.current.scrollToItem(row, "start");
    }
  }, [row]);

  useEffect(jumpToRow, []);

  useEffect(() => {
    if (shouldShowList) {
      jumpToRow();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldShowList]);

  return (
    <div>
      <header>
        <h2>Dynamic list Example</h2>
      </header>
      <content>
        <div className="filter-container">
          <div className="row">
          <label> Text Filter: </label>
            <Input
              value={filter}
              onChange={handleFilterChange}
              placeholder="Try filtering..."
            />
          </div>
          <div className="row">
            <label> Actions: </label>
            <div>
              <InputNumber
                min={0}
                max={filteredCommands.length - 1}
                step={20}
                onChange={setRow}
                value={row}
              />
              <Button onClick={jumpToRow}> Jump! </Button>
            </div>
            <Button onClick={addCommand}> Add Item </Button>
            <Button onClick={() => setShouldShowList(!shouldShowList)}>
              {" "}
              Toggle list{" "}
            </Button>
          </div>
          
        </div>
        <div></div>
        <ResizableBox width={600} height={500} className="resizable-container">
          <div className="dynamic-list-container">
            <AutoSizer>
              {({ height, width }) =>
                shouldShowList && (
                  <DynamicList
                    cache={cache}
                    ref={dynamicListRef}
                    data={filteredCommands}
                    width={width}
                    height={height}
                  >
                    {({ index, style }) => (
                      <div style={style}>
                        <h3> Row - {index} </h3>
                        <pre
                          style={{
                            whiteSpace: "inherit",
                            marginBottom: "2em"
                          }}
                        >
                          {filteredCommands[index].output}
                        </pre>{" "}
                      </div>
                    )}
                  </DynamicList>
                )
              }
            </AutoSizer>
          </div>
        </ResizableBox>
      </content>
    </div>
  );
};

export default App;
