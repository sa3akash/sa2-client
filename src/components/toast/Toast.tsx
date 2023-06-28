import { useEffect, useCallback, useRef, useState } from 'react';
import { cloneDeep } from 'lodash';
import errorIcon from '@assets/images/error.svg';
import successIcon from '@assets/images/check.svg';
import infoIcon from '@assets/images/info.svg';
import warningIcon from '@assets/images/warning.svg';

import '@components/toast/toast.scss';
import { useDispatch } from 'react-redux';
import { Utils } from '@services/utils/Utils.services';

interface ToastProps {
  toastList: ToastDoc[];
  position: string;
  autoDelete: boolean;
  autoDeleteTime?: number;
}

const Toast = ({ toastList, position, autoDelete, autoDeleteTime = 2000 }: ToastProps) => {
  const [list, setList] = useState(toastList);
  const listData = useRef<ToastDoc[]>([]);
  const dispatch = useDispatch();

  const deleteToast = useCallback(() => {
    listData.current = cloneDeep(list);
    listData.current.splice(0, 1);
    setList([...listData.current]);
    if (!listData.current.length) {
      list.length = 0;
      Utils.clearAllNotification(dispatch);
    }
  }, [dispatch, list]);

  // set toastList
  useEffect(() => {
    setList([...toastList]);
  }, [toastList]);

  // auto delete
  useEffect(() => {
    const tick = () => {
      deleteToast();
    };
    if (autoDelete && toastList.length && list.length) {
      const interval = setInterval(tick, autoDeleteTime);
      return () => clearInterval(interval);
    }
  }, [toastList, autoDelete, autoDeleteTime, list, deleteToast]);

  return (
    <div className={`toast-notification-container ${position}`}>
      {list.map((toast: ToastDoc, i) => (
        <div
          data-testid="toast-notification"
          key={i}
          className={`toast-notification toast ${position}`}
          style={
            toast.type === 'success'
              ? { backgroundColor: '#28a745' }
              : toast.type === 'error'
              ? { backgroundColor: '#dc3545' }
              : toast.type === 'info'
              ? { backgroundColor: '#17a2b8' }
              : { backgroundColor: '#ffc107' }
          }
        >
          <button className="cancel-button" onClick={() => deleteToast()}>
            X
          </button>
          <div className={`toast-notification-image ${toast.description.length <= 73 ? 'toast-icon' : ''}`}>
            <img
              src={
                toast.type === 'success'
                  ? successIcon
                  : toast.type === 'error'
                  ? errorIcon
                  : toast.type === 'info'
                  ? infoIcon
                  : warningIcon
              }
              alt="icon"
            />
          </div>
          <div className={`toast-notification-message ${toast.description.length <= 73 ? 'toast-message' : ''}`}>
            {toast.description}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Toast;

export interface ToastDoc {
  type: 'info' | 'success' | 'warning' | 'error';
  description: string;
}
