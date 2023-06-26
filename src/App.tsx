import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from '@root/router';
import 'react-loading-skeleton/dist/skeleton.css';

function App() {
  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
}

export default App;
