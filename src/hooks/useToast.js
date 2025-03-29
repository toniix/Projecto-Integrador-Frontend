import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function useToast() {
  const showToast = ({ type = "default", message, duration = 3000 }) => {
    switch (type) {
      case "success":
        toast.success(message, {
          autoClose: duration,
          position: "bottom-right",
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        break;
      case "error":
        toast.error(message, {
          autoClose: duration,
          position: "bottom-right",
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        break;
      case "warning":
        toast.warning(message, {
          autoClose: duration,
          position: "bottom-right",
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        break;
      default:
        toast.info(message, {
          autoClose: duration,
          position: "bottom-right",
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
    }
  };

  return { toast: showToast };
}
