import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import { BookProvider } from './context/BookContext';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Stats from './pages/Stats';

function App() {
  return (
    <BookProvider>
      <div className="app-shell">
        <Navbar />
        <main className="app-main">
          <div className="container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/stats" element={<Stats />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </main>
        <footer className="app-footer">
          <div className="container">
            <p>Muhammad Arfa Raditya</p>
          </div>
        </footer>
        <Toast />
      </div>
    </BookProvider>
  );
}

export default App;
