import './App.css';
import Theme from './Theme';
import Footer from './components/Shared/Footer/Footer';
import Header from './components/Shared/Header/Header';
import GamePage from './pages/GamePage';

function App() {
  return (
    <Theme>
      <div className="App">
        <Header />
        <GamePage />
        <Footer />
      </div>
    </Theme>
  );
}

export default App;
