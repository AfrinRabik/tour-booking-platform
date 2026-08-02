import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import PackageList from './pages/PackageList';
import PackageDetails from './pages/PackageDetails';
import BookingForm from './pages/BookingForm';
import PaymentPage from './pages/PaymentPage';
import Confirmation from './pages/Confirmation';
import MyBookings from './pages/MyBookings';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';

export default function App() {
  return (
    <>
      <Navbar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/packages" element={<PackageList />} />
          <Route path="/packages/:id" element={<PackageDetails />} />
          <Route path="/book/:packageId" element={<BookingForm />} />
          <Route path="/payment/:bookingId" element={<PaymentPage />} />
          <Route path="/confirmation/:bookingId" element={<Confirmation />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
