import axios from 'axios';

// VITE_API_URL is set in Vercel's project settings once the backend is live
// on Render, e.g. https://tour-booking-backend.onrender.com/api.
// Falls back to localhost only so `npm run dev` still works without any setup.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
});

// --- Packages ---
export const getPackages = () => api.get('/packages');
export const getPackageById = (id) => api.get(`/packages/${id}`);
export const createPackage = (data) => api.post('/admin/packages', data);
export const updatePackage = (id, data) => api.put(`/admin/packages/${id}`, data);
export const deletePackage = (id) => api.delete(`/admin/packages/${id}`);

// --- Bookings ---
export const createBooking = (data) => api.post('/bookings', data);
export const getBooking = (id) => api.get(`/bookings/${id}`);
export const getBookingHistory = (email) => api.get(`/bookings/history/${encodeURIComponent(email)}`);
export const cancelBooking = (id) => api.put(`/bookings/${id}/cancel`);

// --- Payments ---
export const processPayment = (data) => api.post('/payments', data);

// --- Admin ---
export const getAllBookingsAdmin = () => api.get('/admin/bookings');
export const getDashboard = () => api.get('/admin/dashboard');

export default api;
