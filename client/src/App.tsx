import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Theme from './Theme';
import Footer from './components/Shared/Footer/Footer';
import Header from './components/Shared/Header/Header';
import GamePage from './pages/GamePage';
import StartPage from './pages/StartPage';

function App() {
  return (
    <Theme>
      <div className="App">
        <div className="no-select">
          <BrowserRouter>
            <Header />
            <Routes>
              <Route index element={<StartPage />} />
              <Route path="/game" element={<GamePage />} />
            </Routes>
            <Footer />
          </BrowserRouter>
        </div>
      </div>
    </Theme>
  );
}

export default App;
