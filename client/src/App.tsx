import { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import './App.css';

import Theme from './Theme';

import Header from './components/Shared/Header/Header';
import Footer from './components/Shared/Footer/Footer';
import ContentStyled from './components/Shared/Content/Content.styled';
import Button from './components/Shared/Button/Button';

import StartPage from './pages/StartPage';
import GamePage from './pages/GamePage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  const [darkTheme, setDarkTheme] = useState(() => {
    const themeItem = localStorage.getItem('darkTheme');
    return themeItem === 'true';
  });
  
  const switchTheme = (): void => {
    setDarkTheme(!darkTheme);
    localStorage.setItem('darkTheme', String(!darkTheme));
  };

  return (
    <Theme darkTheme={darkTheme}>
      <div className="App">
        <BrowserRouter>
          <Header />
          <ContentStyled>
            <Button
              key="btnTheme"
              buttonType="button"
              label={darkTheme ? "☀️" : "🌙"}
              float='right'
              onClick={() => switchTheme()} />
            <Routes>
              <Route index element={<StartPage />} />
              <Route path="/game/solo" element={<GamePage gameType="SOLO" />} />
              <Route path="/game/cpu" element={<GamePage gameType="CPU" />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </ContentStyled>
          <Footer />
        </BrowserRouter>
      </div>
    </Theme>
  );
}

export default App;
