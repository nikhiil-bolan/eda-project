import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';
import { fetchStations, createBookingApi } from '../services/api';
import { ChargingStation, Connector } from '../types';
import {
  Zap,
  MapPin,
  Calendar,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  QrCode,
  ArrowRight,
  Phone,
  Car,
  FileText,
  Printer
} from 'lucide-react';

export const StationDetailsBooking: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const { calculateDistance } = useLocation();

  const [station, setStation] = useState<ChargingStation | null>(null);
  const [selectedConnector, setSelectedConnector] = useState<Connector | null>(null);
  const [bookingDate, setBookingDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [startTime, setStartTime] = useState<string>('14:00');
  const [durationHours, setDurationHours] = useState<number>(1.0);
  const [vehicleModel, setVehicleModel] = useState<string>(
    user?.evModel || 'Tata Nexon EV Max'
  );

  // Booking Flow Steps: 1: configure -> 2: pay -> 3: confirmed
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedUpiApp, setSelectedUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'bhim'>('gpay');
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const [confirmedBooking, setConfirmedBooking] = useState<any | null>(null);

  useEffect(() => {
    async function loadStation() {
      const all = await fetchStations();
      const found = all.find((s) => s.id === id) || all[0];
      if (found) {
        setStation(found);
        setSelectedConnector(found.connectors[0] || null);
      }
    }
    loadStation();
  }, [id]);

  if (!station) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-xs text-gray-500">
        Loading station details...
      </div>
    );
  }

  // Calculate pricing
  const pricePerKwh = selectedConnector?.pricePerKWh || 18.0;
  const estimatedKwh = Math.round(durationHours * (selectedConnector?.powerKW || 50) * 0.5);
  const totalAmount = Math.max(150, Math.round(estimatedKwh * pricePerKwh));

  const handleInitiatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleConfirmMockUpiPayment = async () => {
    setIsProcessingPayment(true);

    // Simulate ML fraud scoring verification
    setTimeout(async () => {
      const endMins = (parseInt(startTime.split(':')[0]) + durationHours) * 60;
      const endHour = Math.floor(endMins / 60);
      const endMin = endMins % 60;
      const formattedEndTime = `${String(endHour).padStart(2, '0')}:${String(endMin).padStart(2, '0')}`;

      const res = await createBookingApi(
        {
          stationId: station.id,
          connectorId: selectedConnector?.id,
          bookingDate,
          startTime,
          endTime: formattedEndTime,
          durationHours,
          amount: totalAmount,
          vehicleType: vehicleModel
        },
        token
      );

      setIsProcessingPayment(false);
      setConfirmedBooking(res.booking);
      setStep(3);
    }, 1200);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Breadcrumb Header */}
      <div className="flex items-center space-x-2 text-xs font-semibold text-gray-500">
        <Link to="/stations" className="hover:text-teal-600">
          Charging Stations
        </Link>
        <span>/</span>
        <span className="text-gray-900 dark:text-white">{station.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Station Highlights */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm">
            <span className="text-xs font-extrabold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              {station.operator}
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white mt-1">
              {station.name}
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-center space-x-1">
              <MapPin className="w-4 h-4 flex-shrink-0 text-gray-400" />
              <span>{station.address}, {station.city}, {station.state} - {station.pincode}</span>
            </p>

            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60">
                <span className="text-gray-400 font-semibold block text-[11px]">Operating Hours</span>
                <span className="font-extrabold text-gray-800 dark:text-gray-200">
                  {station.openingTime} - {station.closingTime} (24/7)
                </span>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60">
                <span className="text-gray-400 font-semibold block text-[11px]">Contact Helpline</span>
                <span className="font-extrabold text-gray-800 dark:text-gray-200">
                  {station.contactNumber || '+91 1800 209 8888'}
                </span>
              </div>
            </div>

            {station.amenities && (
              <div className="mt-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                  Available Amenities
                </h4>
                <div className="text-xs text-gray-600 dark:text-gray-300 bg-teal-50/50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900/40 p-3 rounded-xl">
                  {station.amenities}
                </div>
              </div>
            )}
          </div>

          {/* Pricing Guarantee Card */}
          <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-3xl p-5 text-xs">
            <div className="flex items-center space-x-2 text-emerald-800 dark:text-emerald-300 font-extrabold mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Guaranteed Slot & Transparent Tariff</span>
            </div>
            <p className="text-emerald-700 dark:text-emerald-400 leading-relaxed text-[11px]">
              Slots booked on EVision are held for 15 minutes beyond your reserved start time.
              Electricity tariff is charged strictly based on regulated BEE transparent units.
            </p>
          </div>
        </div>

        {/* Right Column: Step-by-Step Interactive Booking Engine */}
        <div className="lg:col-span-7">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-xl">
            {/* Step indicator */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 dark:border-gray-800 text-xs font-bold">
              <div className={`flex items-center space-x-1.5 ${step >= 1 ? 'text-teal-600 dark:text-teal-400' : 'text-gray-400'}`}>
                <span className="w-5 h-5 rounded-full bg-teal-100 dark:bg-teal-950 flex items-center justify-center text-[10px]">1</span>
                <span>Configure Slot</span>
              </div>
              <div className="h-0.5 w-8 bg-gray-200 dark:bg-gray-700"></div>
              <div className={`flex items-center space-x-1.5 ${step >= 2 ? 'text-teal-600 dark:text-teal-400' : 'text-gray-400'}`}>
                <span className="w-5 h-5 rounded-full bg-teal-100 dark:bg-teal-950 flex items-center justify-center text-[10px]">2</span>
                <span>UPI Payment & ML Check</span>
              </div>
              <div className="h-0.5 w-8 bg-gray-200 dark:bg-gray-700"></div>
              <div className={`flex items-center space-x-1.5 ${step === 3 ? 'text-emerald-600' : 'text-gray-400'}`}>
                <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-[10px]">3</span>
                <span>Confirmed Pass</span>
              </div>
            </div>

            {/* STEP 1: CONFIGURE SLOT */}
            {step === 1 && (
              <form onSubmit={handleInitiatePayment} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">
                    Select Charging Connector Plug
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {station.connectors.map((c) => {
                      const isSelected = selectedConnector?.id === c.id;
                      return (
                        <div
                          key={c.id}
                          onClick={() => setSelectedConnector(c)}
                          className={`p-3.5 rounded-2xl border text-xs cursor-pointer transition-all ${
                            isSelected
                              ? 'border-teal-500 bg-teal-50/60 dark:bg-teal-950/40 text-teal-900 dark:text-teal-200 shadow-sm'
                              : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          <div className="flex items-center justify-between font-extrabold">
                            <span className="flex items-center space-x-1">
                              <Zap className="w-3.5 h-3.5 text-teal-600" />
                              <span>{c.connectorType}</span>
                            </span>
                            <span className="px-2 py-0.5 rounded bg-white dark:bg-gray-800 text-[10px] font-bold">
                              {c.powerKW} kW Fast
                            </span>
                          </div>
                          <div className="mt-1 flex justify-between text-[11px] text-gray-500 dark:text-gray-400">
                            <span>Tariff: ₹{c.pricePerKWh}/kWh</span>
                            <span className="text-emerald-600 font-bold">{c.status}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                      Booking Date
                    </label>
                    <input
                      type="date"
                      required
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                      Start Time Slot
                    </label>
                    <select
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold text-gray-900 dark:text-white"
                    >
                      <option value="09:00">09:00 AM - 10:00 AM</option>
                      <option value="11:00">11:00 AM - 12:00 PM</option>
                      <option value="14:00">02:00 PM - 03:00 PM (Recommended)</option>
                      <option value="16:00">04:00 PM - 05:00 PM</option>
                      <option value="18:00">06:00 PM - 07:00 PM</option>
                      <option value="20:00">08:00 PM - 09:00 PM</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                      Vehicle Model
                    </label>
                    <input
                      type="text"
                      value={vehicleModel}
                      onChange={(e) => setVehicleModel(e.target.value)}
                      placeholder="e.g. Tata Nexon EV"
                      className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-semibold text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                      Charging Duration ({durationHours} hr)
                    </label>
                    <div className="flex items-center space-x-2 pt-2">
                      {[0.5, 1.0, 1.5, 2.0].map((hrs) => (
                        <button
                          type="button"
                          key={hrs}
                          onClick={() => setDurationHours(hrs)}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            durationHours === hrs
                              ? 'bg-teal-600 text-white'
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {hrs} hr
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Live Fare Breakdown */}
                <div className="bg-gray-50 dark:bg-gray-800/80 rounded-2xl p-4 space-y-2 text-xs border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between text-gray-500 dark:text-gray-400">
                    <span>Estimated Electricity Output</span>
                    <span className="font-bold text-gray-800 dark:text-gray-200">~{estimatedKwh} kWh</span>
                  </div>
                  <div className="flex justify-between text-gray-500 dark:text-gray-400">
                    <span>Tariff Rate</span>
                    <span className="font-bold text-gray-800 dark:text-gray-200">₹{pricePerKwh}/kWh</span>
                  </div>
                  <div className="pt-2 border-t border-gray-200 dark:border-gray-700 flex justify-between font-extrabold text-sm text-gray-900 dark:text-white">
                    <span>Total Reservation Deposit</span>
                    <span className="text-teal-600 dark:text-teal-400">₹{totalAmount}.00</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-sm shadow-lg shadow-teal-600/25 flex items-center justify-center space-x-2 transition-all"
                >
                  <span>Proceed to Mock UPI Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* STEP 2: MOCK UPI PAYMENT & ML FRAUD VERIFICATION */}
            {step === 2 && (
              <div className="space-y-5">
                <div className="text-center space-y-1">
                  <span className="text-xs font-bold text-teal-600 uppercase tracking-widest">
                    NPCI Mock UPI Payment Simulator
                  </span>
                  <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">
                    Scan or Select UPI App to Pay ₹{totalAmount}.00
                  </h3>
                  <p className="text-xs text-gray-500">
                    Instant Bank-Grade Slot Hold with Encrypted Digital Pass Generation
                  </p>
                </div>

                {/* QR Code Container */}
                <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl p-6 flex flex-col items-center justify-center max-w-xs mx-auto">
                  {/* Mock UPI QR Graphic */}
                  <div className="w-44 h-44 bg-white p-3 rounded-2xl shadow-inner border border-gray-200 flex flex-col items-center justify-center relative">
                    <QrCode className="w-36 h-36 text-gray-900" />
                  </div>
                  <div className="mt-3 text-center">
                    <span className="text-[11px] font-mono text-gray-500 dark:text-gray-400 block">
                      VPA: evision.charging@okhdfcbank
                    </span>
                    <span className="text-[10px] text-teal-600 font-bold">
                      Verified Charging Merchant
                    </span>
                  </div>
                </div>

                {/* App Selector Pills */}
                <div>
                  <span className="block text-center text-xs font-bold text-gray-500 mb-2">
                    Or select one-click simulated UPI App:
                  </span>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { id: 'gpay', name: 'Google Pay', color: 'border-blue-500 bg-blue-50/40 text-blue-700' },
                      { id: 'phonepe', name: 'PhonePe', color: 'border-purple-500 bg-purple-50/40 text-purple-700' },
                      { id: 'paytm', name: 'Paytm', color: 'border-sky-500 bg-sky-50/40 text-sky-700' },
                      { id: 'bhim', name: 'BHIM UPI', color: 'border-amber-500 bg-amber-50/40 text-amber-700' }
                    ].map((app) => (
                      <button
                        type="button"
                        key={app.id}
                        onClick={() => setSelectedUpiApp(app.id as any)}
                        className={`p-2 rounded-xl border text-xs font-bold text-center transition-all ${
                          selectedUpiApp === app.id
                            ? `${app.color} shadow-sm`
                            : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                        }`}
                      >
                        {app.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bank-Grade Security Badge */}
                <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl p-3.5 flex items-start space-x-2.5 text-xs">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-extrabold text-emerald-900 dark:text-emerald-300">
                      256-Bit Bank-Grade Encryption & Fraud Protection:
                    </span>
                    <p className="text-emerald-700 dark:text-emerald-400 text-[11px] mt-0.5">
                      Your transaction is authenticated through the NPCI Unified Payments Interface protocol. Zero convenience charges applied.
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="py-3 px-4 rounded-xl border border-gray-300 dark:border-gray-700 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmMockUpiPayment}
                    disabled={isProcessingPayment}
                    className="flex-1 py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs shadow-lg shadow-teal-600/25 flex items-center justify-center space-x-2 disabled:opacity-60"
                  >
                    <span>{isProcessingPayment ? 'Securing & Verifying UPI Payment...' : `Confirm & Pay ₹${totalAmount}`}</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: CONFIRMED RESERVATION PASS */}
            {step === 3 && confirmedBooking && (
              <div className="space-y-6 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                    Payment Verified & Slot Reserved
                  </span>
                  <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">
                    Booking Confirmed!
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Present this digital charging pass at the station kiosk or scan upon arrival.
                  </p>
                </div>

                {/* Printable Digital Pass */}
                <div className="bg-white dark:bg-gray-800 border-2 border-dashed border-teal-500 rounded-3xl p-6 text-left shadow-lg max-w-md mx-auto space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-700">
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Reference Code</span>
                      <h4 className="text-lg font-mono font-extrabold text-teal-600">
                        {confirmedBooking.bookingReference}
                      </h4>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-extrabold border border-emerald-200">
                      ACTIVE PASS
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-gray-400 block text-[11px]">Station Hub</span>
                      <span className="font-bold text-gray-800 dark:text-gray-200">{station.name}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[11px]">Connector Bay</span>
                      <span className="font-bold text-gray-800 dark:text-gray-200">
                        {selectedConnector?.connectorType} ({selectedConnector?.powerKW}kW)
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[11px]">Date & Time</span>
                      <span className="font-bold text-gray-800 dark:text-gray-200">
                        {confirmedBooking.bookingDate} • {confirmedBooking.startTime}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[11px]">Amount Paid</span>
                      <span className="font-bold text-emerald-600">₹{confirmedBooking.amount}.00 (UPI)</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-[11px] text-gray-400">
                    <span>Driver: {user?.name || 'EV Driver'}</span>
                    <span>Vehicle: {vehicleModel}</span>
                  </div>
                </div>

                <div className="flex items-center justify-center space-x-3 pt-2">
                  <button
                    onClick={() => window.print()}
                    className="py-2.5 px-4 rounded-xl border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print / Save Pass</span>
                  </button>
                  <Link
                    to="/my-bookings"
                    className="py-2.5 px-5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/20"
                  >
                    View in My Bookings
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
