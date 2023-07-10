import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from '@root/router';
import 'react-loading-skeleton/dist/skeleton.css';
import { useEffect } from 'react';
import { socketService } from '@services/sockets/socket.services';
import Toast from '@components/toast/Toast';
import { useSelector } from 'react-redux';
import { RootState } from '@store/index';

function App() {
  const notifications = useSelector((state: RootState) => state.notification);

  useEffect(() => {
    socketService.setupSocketConnection();
  }, []);

  return (
    <>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>

      {notifications && notifications.length > 0 && (
        <Toast position="bottom-left" toastList={notifications} autoDelete={true} />
      )}
    </>
  );
}

export default App;
