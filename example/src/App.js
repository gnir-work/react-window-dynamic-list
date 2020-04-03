import React, { useState, useRef, useEffect, useCallback } from 'react'

import DynamicList from 'react-window-dynamic-list'
import 'react-window-dynamic-list/dist/index.css'
import { generateCommands } from "./utils";
import { Input, InputNumber, Button } from "antd";

import "antd/dist/antd.compact.min.css"
import "./App.css"

const commands = generateCommands();


const App = () => {
  const [filter, setFilter] = useState("");
  const [row, setRow] = useState(200);
  const dynamicListRef = useRef();
  const [shouldShowList, setShouldShowList] = useState(true);
  const filteredCommands = commands.filter(command => JSON.stringify(command).includes(filter));


  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  }

  const jumpToRow = () => {
    debugger;
    if (dynamicListRef.current) {
      dynamicListRef.current.scrollToItem(row, "start")
    }
  }

  useEffect(jumpToRow, []);

  useEffect(() => {
    if (shouldShowList) {
      jumpToRow()
    }
  }, [shouldShowList])

  return <div>
    <header>
      <h2>Dynamic list Example</h2>
    </header>
    <content>
      <div className="filter-container">
        <Input value={filter} onChange={handleFilterChange} placeholder="Try filtering..." />
        <InputNumber min={0} max={filteredCommands.length - 1} step={20} onChange={setRow} value={row} />
        <Button onClick={jumpToRow}> Jump! </Button>
        <Button onClick={() => setShouldShowList(!shouldShowList)}> Toggle list </Button>
      </div>
      <div>
      </div>
      <div className="dynamic-list-container">
        {shouldShowList && <DynamicList ref={dynamicListRef} data={filteredCommands} width={600} height={600}>
          {({ index, style }) => (
            <div style={style}>
              <h3> Row - {index} </h3>
              <pre style={{ whiteSpace: "inherit", marginBottom: "2em" }}>{filteredCommands[index].output}</pre>{" "}
            </div>
          )}
        </DynamicList>
        }
      </div>
    </content>
  </div>
}

export default App
