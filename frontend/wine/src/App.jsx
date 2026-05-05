import { useState } from 'react'
import './App.css'

function App() {
  const [wineName, setWineName] = useState("")

  return (
    <div>
      <h1> Wine Passport </h1>
      <input
        type="text"
        placeholder="Wine Name"
        value={wineName}
        onChange={(e) => setWineName(e.target.value)}
      />
    </div>
    )
}

export default App
