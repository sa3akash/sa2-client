import ReactDOM from 'react-dom/client';
import App from '@root/App.tsx';
import '@root/index.scss';
import { store } from '@root/store';
import { Provider } from 'react-redux';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Provider store={store}>
    <App />
  </Provider>
);
