import { Toast, ToastContainer } from "react-bootstrap";
import PropTypes from 'prop-types';

const ErrorToast = ({ show, handleClose, message }) => {
    return (
        <ToastContainer position="middle-center" className="toast-container p-3">
            <Toast show={show} onClose={handleClose} delay={5000} autohide  className="custom-toast">
                <Toast.Header closeButton className="toast-header-error">
                    <strong className="me-auto">Error</strong>
                    <span onClick={handleClose}></span>
                </Toast.Header>
                <Toast.Body className="toast-body-error">{message}</Toast.Body>
            </Toast>
        </ToastContainer>
    );
};
ErrorToast.propTypes = {
    show: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    message: PropTypes.string.isRequired,
};

export default ErrorToast;
