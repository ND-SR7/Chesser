import { BrowserRouter, Route, Routes } from 'react-router-dom';

import './App.css';

import Theme from './Theme';

import Header from './components/Shared/Header/Header';
import Footer from './components/Shared/Footer/Footer';

import StartPage from './pages/StartPage';
import GamePage from './pages/GamePage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Theme>
      <div className="App">
        <BrowserRouter>
          <Header />
          <Routes>
            <Route index element={<StartPage />} />
            <Route path="/game/solo" element={<GamePage gameType="SOLO" />} />
            <Route path="/game/cpu" element={<GamePage gameType="CPU" />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </div>
    </Theme>
  );
}

export default App;
