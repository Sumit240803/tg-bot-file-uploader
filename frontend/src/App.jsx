import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';  // Use BrowserRouter instead
import './App.css';
import Home from './pages/Home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/user/:id' element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
