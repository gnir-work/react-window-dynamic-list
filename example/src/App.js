import React, { useState } from 'react'

import DynamicList from 'react-window-dynamic-list'
import 'react-window-dynamic-list/dist/index.css'
import { generateCommands } from "./utils";
import { Input } from "antd";

import "antd/dist/antd.compact.min.css"
import "./App.css"

const commands = generateCommands();


const App = () => {
  const [filter, setFilter] = useState("");
  const filteredCommands = commands.filter(command => JSON.stringify(command).includes(filter));

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  }


  return <div>
    <header>
      <h2>Dynamic list Example</h2>
    </header>
    <content>
      <div className="filter-container">
        <Input value={filter} onChange={handleFilterChange} placeholder="Try filtering..." />
      </div>
      <div className="dynamic-list-container">
        <DynamicList data={filteredCommands} width={600} height={600}>
          {({ index, style }) => (
            <div style={style}>
              <pre style={{ whiteSpace: "inherit" }}>{filteredCommands[index].output}</pre>{" "}
            </div>
          )}
        </DynamicList>
      </div>
    </content>
  </div>
}

export default App
