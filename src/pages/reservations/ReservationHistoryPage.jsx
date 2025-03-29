// pages/reservations/ReservationHistoryPage.jsx
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import ReservationHistory from '../../components/reservations/ReservationHistory';

export const ReservationHistoryPage = () => {
    return (
        <>
            <Header />
            <main className="min-h-screen bg-gradient-to-b from-[#F9F7F4] to-white pt-20 pb-10">
                <ReservationHistory />
            </main>
            <Footer />
        </>
    );
};

export default ReservationHistoryPage;