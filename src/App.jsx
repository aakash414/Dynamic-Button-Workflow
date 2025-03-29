import './App.css'
import {BrowserRouter as Router,Routes,Route} from "react-router-dom";
import {Config} from './pages/Config.jsx';
import  {Output} from './pages/Output.jsx';
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Config />} />
          <Route path="/output" element={<Output />} />
        </Routes>
      </Router>

    </>
  )
}

export default App
