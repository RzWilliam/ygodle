import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import GamePage from './pages/GamePage';
import StatsModal from './components/StatsModal';

function App() {
  return (
    <Router>
      <div className="min-h-screen ">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/monsters" element={<GamePage mode="monsters" />} />
          <Route path="/spells" element={<GamePage mode="spells" />} />
          <Route path="/traps" element={<GamePage mode="traps" />} />
        </Routes>
        <StatsModal />
      </div>
    </Router>
  );
}

export default App;
