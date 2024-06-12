import { BrowserRouter, Route, Routes } from 'react-router-dom';

import './App.css';

import Theme from './Theme';

import Header from './components/Shared/Header/Header';
import Footer from './components/Shared/Footer/Footer';

import StartPage from './pages/StartPage';
import GamePage from './pages/GamePage';

function App() {
  return (
    <Theme>
      <div className="App">
        <BrowserRouter>
          <Header />
          <Routes>
            <Route index element={<StartPage />} />
            <Route path="/game" element={<GamePage />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </div>
    </Theme>
  );
}

export default App;
