import './App.css';
import Theme from './Theme';
import GamePage from './pages/GamePage';

function App() {
  return (
    <Theme>
      <div className="App">
        <header>Chesser</header> 
        <GamePage />
        <footer>Made by: ND-SR7, 2024</footer>
      </div>
    </Theme>
  );
}

export default App;
