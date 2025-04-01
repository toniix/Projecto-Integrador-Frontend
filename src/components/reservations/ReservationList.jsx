// components/reservations/ReservationList.jsx
import PropTypes from "prop-types";
import ReservationListItem from "./ReservationListItem";

const ReservationList = ({ reservations }) => {
    if (!reservations || reservations.length === 0) {
        return null;
    }
    
    return (
        <div className="space-y-2">
            {reservations.map((reservation) => (
                <ReservationListItem
                    key={reservation.id}
                    reservation={reservation}
                />
            ))}
        </div>
    );
};

ReservationList.propTypes = {
    reservations: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            productName: PropTypes.string.isRequired,
            productImage: PropTypes.string,
            productImageURL: PropTypes.string,
            startDate: PropTypes.string.isRequired,
            endDate: PropTypes.string.isRequired,
            status: PropTypes.string.isRequired,
        })
    ).isRequired,
};

export default ReservationList;