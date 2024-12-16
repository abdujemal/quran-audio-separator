import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import AudioPlayer from './player'
import './index.css';

function App() {
  const [count, setCount] = useState(0)

  return (<AudioPlayer/>
    // <>
    //   <div>
    //     <a href="https://vite.dev" target="_blank">
    //       <img src={viteLogo} className="logo" alt="Vite logo" />
    //     </a>
    //     <a href="https://react.dev" target="_blank">
    //       <img src={reactLogo} className="logo react" alt="React logo" />
    //     </a>
    //   </div>
    //   <h1>Vite + React</h1>
      
    //   <audio controls>
    //     <source src="https://b2.ilmfelagi.com/file/ilm-Felagi2/%E1%88%B1%E1%88%A8%E1%89%B1%E1%88%8D%20%E1%8A%A0%E1%8A%95%E1%8B%93%E1%88%9D%C2%A0%20%E1%89%A0%E1%88%B8%E1%8B%AD%E1%8A%BD%20%E1%8A%A0%E1%8B%88%E1%88%8D%20%E1%8A%A0%E1%88%95%E1%88%98%E1%8B%B5%20%E1%8A%A0%E1%88%8D%E1%8A%A8%E1%88%9A%E1%88%B2/%D8%B3%D9%88%D8%B1%D8%A9_%D8%A7%D9%84%D8%A3%D9%86%D8%B9%D8%A7%D9%85_1%281_11%29.mp3" type="audio/mp3" />
    //     Your browser does not support the audio element.
    //   </audio>
    //   <div className="card">
    //     <button onClick={() => setCount((count) => count + 1)}>
    //       count is {count}
    //     </button>
    //     <p>
    //       Edit <code>src/App.jsx</code> and save to test HMR
    //     </p>
    //   </div>
    //   <p className="read-the-docs">
    //     Click on the Vite and React logos to learn more
    //   </p>
    // </>
  )
}

export default App
