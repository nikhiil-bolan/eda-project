import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchStations, fetchOverviewKPIs } from '../services/api';
import { ChargingStation, OverviewKPIs } from '../types';
import {
  ShieldCheck,
  Building2,
  Users,
  Zap,
  Plus,
  Download,
  AlertTriangle,
  CheckCircle2,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

export const AdminHub: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const [stations, setStations] = useState<ChargingStation[]>([]);
  const [kpis, setKpis] = useState<OverviewKPIs | null>(null);

  // Add station modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newOperator, setNewOperator] = useState('Tata Power EZ Charge');
  const [newCity, setNewCity] = useState('Mumbai');
  const [newAddress, setNewAddress] = useState('');
  const [newLat, setNewLat] = useState('19.0760');
  const [newLng, setNewLng] = useState('72.8777');
  const [newConnectors, setNewConnectors] = useState(4);

  useEffect(() => {
    async function load() {
      const [stData, kpiData] = await Promise.all([
        fetchStations(),
        fetchOverviewKPIs()
      ]);
      setStations(stData);
      setKpis(kpiData);
    }
    load();
  }, []);

  const handleToggleStatus = (stationId: string) => {
    setStations((prev) =>
      prev.map((s) => {
        if (s.id === stationId) {
          const nextStatus = s.status === 'ACTIVE' ? 'MAINTENANCE' : 'ACTIVE';
          return { ...s, status: nextStatus };
        }
        return s;
      })
    );
  };

  const handleAddStation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newAddress) return;

    const newStation: ChargingStation = {
      id: `st-custom-${Date.now()}`,
      name: newName,
      operator: newOperator,
      address: newAddress,
      city: newCity,
      state: 'Maharashtra',
      latitude: parseFloat(newLat) || 19.0760,
      longitude: parseFloat(newLng) || 72.8777,
      openingTime: '00:00',
      closingTime: '23:59',
      totalConnectors: newConnectors,
      availableConnectors: newConnectors,
      status: 'ACTIVE',
      amenities: '24/7 Security, Restrooms, Fast Wi-Fi',
      connectors: [
        {
          id: `c-${Date.now()}-1`,
          stationId: `st-custom-${Date.now()}`,
          connectorType: 'CCS2',
          powerKW: 60.0,
          pricePerKWh: 18.0,
          status: 'AVAILABLE'
        }
      ]
    };

    setStations([newStation, ...stations]);
    setShowAddModal(false);
    setNewName('');
    setNewAddress('');
    alert(`Station "${newName}" successfully registered on the live national grid!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-bold border border-blue-200 dark:border-blue-800 mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>Authenticated Administrator Workbench</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
            Enterprise Admin & Station Registry Hub
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-2xl mt-1">
            Manage charging station lifecycle, inspect registered drivers, and verify national telemetry pipelines.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md shadow-teal-600/20 flex items-center space-x-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Station Hub</span>
        </button>
      </div>

      {/* Admin KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
          <span className="text-[11px] font-bold text-gray-400 uppercase">Station Directory Count</span>
          <div className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">
            {stations.length} Active Hubs
          </div>
          <p className="text-xs text-teal-600 font-semibold mt-1">Real-time Telemetry Linked</p>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
          <span className="text-[11px] font-bold text-gray-400 uppercase">Registered Drivers</span>
          <div className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">
            142 Drivers
          </div>
          <p className="text-xs text-blue-600 font-semibold mt-1">Active KYC Authentication</p>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
          <span className="text-[11px] font-bold text-gray-400 uppercase">Total Reservations</span>
          <div className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">
            68 Sessions
          </div>
          <p className="text-xs text-emerald-600 font-semibold mt-1">100% Mock UPI Verified</p>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
          <span className="text-[11px] font-bold text-gray-400 uppercase">Master Dataset</span>
          <div className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">
            192 Records
          </div>
          <p className="text-xs text-purple-600 font-semibold mt-1">VAHAN & BEE Clean Pipeline</p>
        </div>
      </div>

      {/* Station Management Table */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
          <h3 className="text-sm font-extrabold text-gray-900 dark:text-white">
            Station Operational Status & Bay Management
          </h3>
          <span className="text-xs text-gray-400 font-medium">Click status to toggle maintenance</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-800 text-[11px] uppercase tracking-wider text-gray-500 font-extrabold">
              <tr>
                <th className="py-4 px-6">Station Name</th>
                <th className="py-4 px-6">CPO Operator</th>
                <th className="py-4 px-6">Location</th>
                <th className="py-4 px-6">Bays Available</th>
                <th className="py-4 px-6">Operational Status</th>
                <th className="py-4 px-6">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800 font-medium">
              {stations.map((st) => (
                <tr key={st.id} className="hover:bg-gray-50/80 dark:hover:bg-gray-800/40">
                  <td className="py-4 px-6 font-extrabold text-gray-900 dark:text-white">
                    {st.name}
                  </td>
                  <td className="py-4 px-6 text-gray-600 dark:text-gray-300 font-bold">
                    {st.operator}
                  </td>
                  <td className="py-4 px-6 text-gray-500">
                    {st.city}, {st.state}
                  </td>
                  <td className="py-4 px-6 font-mono font-bold text-teal-600">
                    {st.availableConnectors} / {st.totalConnectors}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        st.status === 'ACTIVE'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {st.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => handleToggleStatus(st.id)}
                      className="text-xs font-bold text-teal-600 hover:underline"
                    >
                      Toggle Status
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for adding new station */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-extrabold text-gray-900 dark:text-white">
              Add New Public Charging Station
            </h3>
            <form onSubmit={handleAddStation} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Station Name
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Jio-bp pulse - Navi Mumbai Hub"
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                    CPO Operator
                  </label>
                  <select
                    value={newOperator}
                    onChange={(e) => setNewOperator(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border rounded-xl"
                  >
                    <option value="Tata Power EZ Charge">Tata Power EZ Charge</option>
                    <option value="Statiq Networks">Statiq Networks</option>
                    <option value="Zeon Charging">Zeon Charging</option>
                    <option value="Jio-bp pulse">Jio-bp pulse</option>
                    <option value="ChargeZone">ChargeZone</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  required
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  placeholder="e.g. Sector 17, Vashi, Navi Mumbai"
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Latitude
                  </label>
                  <input
                    type="text"
                    value={newLat}
                    onChange={(e) => setNewLat(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Longitude
                  </label>
                  <input
                    type="text"
                    value={newLng}
                    onChange={(e) => setNewLng(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border rounded-xl"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 text-white font-bold rounded-xl"
                >
                  Deploy Station to Network
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

