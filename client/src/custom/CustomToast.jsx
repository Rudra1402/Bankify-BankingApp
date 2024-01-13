import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Toast = {
    success: (message, time = 3000) => {
        toast.success(message, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: time,
            hideProgressBar: true,
            closeButton: true,
        });
    },
    error: (message, time = 3000) => {
        toast.error(message, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: time,
            hideProgressBar: true,
            closeButton: true,
        });
    },
    warn: (message) => {
        toast.warn(message, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 3000,
            hideProgressBar: true,
            closeButton: true,
        });
    },
    info: (message) => {
        toast.info(message, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 3000,
            hideProgressBar: true,
            closeButton: true,
        });
    },
};

export default Toast;
