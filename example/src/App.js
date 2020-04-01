import React from 'react'

import { ExampleComponent } from 'react-window-dynamic-list'
import 'react-window-dynamic-list/dist/index.css'
import { generateCommands } from "./utils";


const App = () => {
  return <ExampleComponent data={generateCommands()} />
}

export default App
