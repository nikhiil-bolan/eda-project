import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, ShieldCheck, Globe, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Col 1: Brand & Overview */}
          <div className="col-span-2 space-y-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
                <Zap className="w-4 h-4 fill-current" />
              </div>
              <span className="text-lg font-extrabold text-gray-900 dark:text-white">
                EVision Enterprise
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm leading-relaxed">
              India's Data Science & Spatial Decision-Support Network for EV Charging Demands,
              National Infrastructure Gap Quantification, and Real-Time Slot Reservations.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-2 text-[11px] text-gray-500 dark:text-gray-400">
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-bold border border-emerald-200 dark:border-emerald-800">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Certified VAHAN & BEE Data Pipeline</span>
              </span>
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-400 font-bold border border-sky-200 dark:border-sky-800">
                <Globe className="w-3.5 h-3.5" />
                <span>Release 2.0 Production</span>
              </span>
            </div>
          </div>

          {/* Col 2: Network & Stations */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-3">
              Charging Network
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-600 dark:text-gray-400 font-medium">
              <li>
                <Link to="/stations" className="hover:text-sky-600 dark:hover:text-sky-400">
                  Find Stations
                </Link>
              </li>
              <li>
                <Link to="/map" className="hover:text-sky-600 dark:hover:text-sky-400">
                  Live Spatial Map
                </Link>
              </li>
              <li>
                <Link to="/my-bookings" className="hover:text-sky-600 dark:hover:text-sky-400">
                  Active Passes & Receipts
                </Link>
              </li>
              <li>
                <Link to="/doorstep" className="hover:text-sky-600 dark:hover:text-sky-400">
                  Roadside Rescue Van
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Analytics & Planning */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-3">
              Analytics & Insights
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-600 dark:text-gray-400 font-medium">
              <li>
                <Link to="/tableau" className="hover:text-sky-600 dark:hover:text-sky-400 flex items-center space-x-1">
                  <span>Executive BI Studio</span>
                  <ArrowUpRight className="w-3 h-3 text-sky-500" />
                </Link>
              </li>
              <li>
                <Link to="/eda" className="hover:text-sky-600 dark:hover:text-sky-400">
                  Data Insights & Trends
                </Link>
              </li>
              <li>
                <Link to="/gap-analysis" className="hover:text-sky-600 dark:hover:text-sky-400">
                  Regional Gap Index
                </Link>
              </li>
              <li>
                <Link to="/forecasting" className="hover:text-sky-600 dark:hover:text-sky-400">
                  Demand Projections (2030)
                </Link>
              </li>
              <li>
                <Link to="/planner" className="hover:text-sky-600 dark:hover:text-sky-400">
                  Deployment Planner
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Consumer Tools */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-3">
              Driver Tools
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-600 dark:text-gray-400 font-medium">
              <li>
                <Link to="/calculator" className="hover:text-sky-600 dark:hover:text-sky-400">
                  Battery & Cost Estimator
                </Link>
              </li>
              <li>
                <Link to="/marketplace" className="hover:text-sky-600 dark:hover:text-sky-400">
                  EV Models & Valuation
                </Link>
              </li>
              <li>
                <Link to="/assistant" className="hover:text-sky-600 dark:hover:text-sky-400">
                  AI Assistant (EVA)
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-sky-600 dark:hover:text-sky-400">
                  Administrative Desk
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500">
          <p>© 2026 EVision Enterprise Technologies. All rights reserved.</p>
          <div className="flex items-center space-x-6 mt-3 sm:mt-0 font-medium">
            <span>Ministry of Heavy Industries PM E-DRIVE</span>
            <span>Bureau of Energy Efficiency (BEE)</span>
            <span>NPCI UPI Spec</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
