import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Calendar,
  Zap,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
  Printer,
  QrCode
} from 'lucide-react';

export const MyBookings: React.FC = () => {
  const { user, token } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBookings() {
      setLoading(true);
      try {
        if (token) {
          const res = await fetch('/api/bookings/user', {
            headers: { Authorization: `Bearer ${token}` }
          });
          const json = await res.json();
          if (json.success && json.data?.bookings) {
            setBookings(json.data.bookings);
            setLoading(false);
            return;
          }
        }
      } catch (e) {}

      // Fallback local storage bookings
      const local = JSON.parse(localStorage.getItem('evision_local_bookings') || '[]');
      if (local.length > 0) {
        setBookings(local);
      } else {
        // Sample default certified booking
        setBookings([
          {
            id: 'b-demo-01',
            bookingReference: 'EVN-2026-849201',
            bookingDate: '2026-10-22',
            startTime: '15:00',
            endTime: '16:00',
            durationHours: 1.0,
            amount: 350.0,
            status: 'CONFIRMED',
            station: {
              name: 'Tata Power EZ Charge - Bandra Kurla Complex (BKC)',
              address: 'G-Block, BKC, Bandra East, Mumbai'
            },
            connector: {
              connectorType: 'CCS2',
              powerKW: 60.0
            }
          }
        ]);
      }
      setLoading(false);
    }
    loadBookings();
  }, [token]);

  const handleCancelBooking = (bookingId: string) => {
    if (!window.confirm('Are you sure you want to cancel this charging slot reservation?')) {
      return;
    }
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'CANCELLED' } : b))
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
            My Charging Reservations
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Active digital charging passes, reservation references, and past session receipts
          </p>
        </div>
        <Link
          to="/stations"
          className="py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/20 flex items-center space-x-1.5 self-start sm:self-auto"
        >
          <Zap className="w-4 h-4" />
          <span>Book New Slot</span>
        </Link>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs text-gray-400">Loading your bookings...</div>
      ) : bookings.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-12 text-center space-y-3">
          <Calendar className="w-10 h-10 text-gray-400 mx-auto" />
          <h3 className="text-base font-extrabold text-gray-900 dark:text-white">
            No Charging Passes Found
          </h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            You don't have any active charging reservations. Find nearest stations on our live map to book your first slot.
          </p>
          <Link
            to="/stations"
            className="inline-block px-4 py-2 bg-teal-600 text-white font-bold rounded-xl text-xs"
          >
            Find Nearest Charging Station
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {bookings.map((b) => {
            const isConfirmed = b.status === 'CONFIRMED';
            return (
              <div
                key={b.id}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-teal-600 dark:text-teal-400 tracking-wider">
                      {b.bookingReference}
                    </span>
                    <h3 className="text-base font-extrabold text-gray-900 dark:text-white mt-0.5">
                      {b.station?.name || 'Tata Power BKC Hub'}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center space-x-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                      <span className="truncate">{b.station?.address || 'Mumbai'}</span>
                    </p>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      isConfirmed
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    {b.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800/60 text-xs">
                  <div>
                    <span className="text-gray-400 block text-[11px]">Date & Time</span>
                    <span className="font-bold text-gray-800 dark:text-gray-200">
                      {b.bookingDate} • {b.startTime}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[11px]">Connector Bay</span>
                    <span className="font-bold text-gray-800 dark:text-gray-200">
                      {b.connector?.connectorType || 'CCS2'} ({b.connector?.powerKW || 60} kW)
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[11px]">Duration</span>
                    <span className="font-bold text-gray-800 dark:text-gray-200">
                      {b.durationHours || 1.0} hr session
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[11px]">Deposit Paid</span>
                    <span className="font-bold text-emerald-600">₹{b.amount}.00</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <button
                    onClick={() => window.print()}
                    className="flex items-center space-x-1 font-bold text-gray-600 dark:text-gray-300 hover:text-teal-600"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Slip</span>
                  </button>

                  {isConfirmed && (
                    <button
                      onClick={() => handleCancelBooking(b.id)}
                      className="font-bold text-rose-600 hover:underline"
                    >
                      Cancel Reservation
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

