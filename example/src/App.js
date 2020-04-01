import React from 'react'

import { ExampleComponent } from 'react-window-dynamic-list'
import 'react-window-dynamic-list/dist/index.css'
import { generateData } from "./utils";


const App = () => {
  return <ExampleComponent data={generateData()} />
}

export default App
