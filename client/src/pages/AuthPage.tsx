import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';
import {
  Zap,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Mail,
  User,
  Phone,
  ArrowRight,
  Sparkles,
  MapPin,
  Car
} from 'lucide-react';

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, registerUser, loginAsGuest, loginAsAdminDemo, loginAsDriverDemo } = useAuth();
  const { requestLiveLocation, setShowLocationModal } = useLocation();

  const [activeTab, setActiveTab] = useState<'signin' | 'signup' | 'demo'>('signin');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sign In fields
  const [signInEmail, setSignInEmail] = useState('driver@evision.gov.in');
  const [signInPassword, setSignInPassword] = useState('driver123');

  // Sign Up fields
  const [suName, setSuName] = useState('');
  const [suEmail, setSuEmail] = useState('');
  const [suPhone, setSuPhone] = useState('');
  const [suPassword, setSuPassword] = useState('');
  const [suCity, setSuCity] = useState('Mumbai');
  const [suEvModel, setSuEvModel] = useState('Tata Nexon EV Max');

  const handlePostAuthSuccess = async () => {
    // Immediately prompt to capture live location right after login/signup
    setShowLocationModal(true);
    requestLiveLocation();
    navigate('/');
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    const res = await login(signInEmail, signInPassword);
    setLoading(false);

    if (res.success) {
      handlePostAuthSuccess();
    } else {
      setErrorMsg(res.error || 'Invalid credentials');
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!suName || !suEmail || !suPassword) {
      setErrorMsg('Full Name, Email, and Password are required.');
      return;
    }

    setLoading(true);
    const res = await registerUser({
      name: suName,
      email: suEmail,
      phone: suPhone,
      password: suPassword,
      city: suCity,
      state: 'Maharashtra',
      evModel: suEvModel
    });
    setLoading(false);

    if (res.success) {
      handlePostAuthSuccess();
    } else {
      setErrorMsg(res.error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#090D16] flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors duration-200">
      {/* Tata/Google clean corporate header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-500 text-white shadow-xl shadow-teal-500/25 mb-4">
          <Zap className="w-8 h-8 fill-current" />
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          EVision <span className="text-teal-600 dark:text-teal-400">Platform</span>
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 max-w-sm mx-auto">
          India's Enterprise EV Infrastructure Intelligence & Smart Charging Network
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white dark:bg-gray-900 py-8 px-6 sm:px-10 shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-200 dark:border-gray-800 rounded-3xl">
          {/* Segmented Auth Navigation */}
          <div className="flex border-b border-gray-200 dark:border-gray-800 mb-6 pb-2">
            <button
              onClick={() => {
                setActiveTab('signin');
                setErrorMsg(null);
              }}
              className={`flex-1 text-center py-2 text-xs font-bold transition-all border-b-2 ${
                activeTab === 'signin'
                  ? 'border-teal-600 text-teal-600 dark:text-teal-400'
                  : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'
              }`}
            >
              🔑 Driver Sign In
            </button>
            <button
              onClick={() => {
                setActiveTab('signup');
                setErrorMsg(null);
              }}
              className={`flex-1 text-center py-2 text-xs font-bold transition-all border-b-2 ${
                activeTab === 'signup'
                  ? 'border-teal-600 text-teal-600 dark:text-teal-400'
                  : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'
              }`}
            >
              📝 Create Account
            </button>
            <button
              onClick={() => {
                setActiveTab('demo');
                setErrorMsg(null);
              }}
              className={`flex-1 text-center py-2 text-xs font-bold transition-all border-b-2 ${
                activeTab === 'demo'
                  ? 'border-teal-600 text-teal-600 dark:text-teal-400'
                  : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'
              }`}
            >
              ⚡ Instant 1-Click Access
            </button>
          </div>

          {errorMsg && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          {/* SIGN IN FORM */}
          {activeTab === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                  Email / Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    placeholder="driver@evision.gov.in"
                    className="block w-full pl-10 pr-3 py-2.5 bg-gray-50 dark:bg-gray-800/80 border border-gray-300 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    placeholder="••••••••"
                    className="block w-full pl-10 pr-3 py-2.5 bg-gray-50 dark:bg-gray-800/80 border border-gray-300 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center text-gray-600 dark:text-gray-400">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                  />
                  <span className="ml-2">Remember credentials</span>
                </label>
                <button
                  type="button"
                  onClick={() => alert('Password reset verification link has been dispatched to your email.')}
                  className="text-teal-600 dark:text-teal-400 font-semibold hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-lg shadow-teal-600/20 flex items-center justify-center space-x-2 transition-all disabled:opacity-60"
              >
                <span>{loading ? 'Authenticating...' : 'Sign In to EVision Portal'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* SIGN UP FORM */}
          {activeTab === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={suName}
                    onChange={(e) => setSuName(e.target.value)}
                    placeholder="e.g. Vikramaditya Singhal"
                    className="block w-full pl-10 pr-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      value={suEmail}
                      onChange={(e) => setSuEmail(e.target.value)}
                      placeholder="vikram@example.com"
                      className="block w-full pl-10 pr-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                    Mobile Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      type="tel"
                      value={suPhone}
                      onChange={(e) => setSuPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="block w-full pl-10 pr-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                    Primary City
                  </label>
                  <select
                    value={suCity}
                    onChange={(e) => setSuCity(e.target.value)}
                    className="block w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="Mumbai">Mumbai (MH)</option>
                    <option value="New Delhi">New Delhi (DL)</option>
                    <option value="Bengaluru">Bengaluru (KA)</option>
                    <option value="Pune">Pune (MH)</option>
                    <option value="Hyderabad">Hyderabad (TS)</option>
                    <option value="Chennai">Chennai (TN)</option>
                    <option value="Kolkata">Kolkata (WB)</option>
                    <option value="Lucknow">Lucknow (UP)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                    Electric Vehicle
                  </label>
                  <select
                    value={suEvModel}
                    onChange={(e) => setSuEvModel(e.target.value)}
                    className="block w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="Tata Nexon EV Max">Tata Nexon EV Max</option>
                    <option value="Tata Punch EV">Tata Punch EV</option>
                    <option value="MG ZS EV">MG ZS EV</option>
                    <option value="BYD Atto 3">BYD Atto 3</option>
                    <option value="Ola S1 Pro (2W)">Ola S1 Pro (2W)</option>
                    <option value="Ather 450X (2W)">Ather 450X (2W)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                  Create Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={suPassword}
                    onChange={(e) => setSuPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    className="block w-full pl-10 pr-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-3 py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-lg shadow-teal-600/20 flex items-center justify-center space-x-2 transition-all disabled:opacity-60"
              >
                <span>{loading ? 'Creating Account...' : 'Register & Enter EV Portal'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* INSTANT ONE-CLICK ACCESS BUTTONS */}
          {activeTab === 'demo' && (
            <div className="space-y-3 pt-1">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                Evaluate EVision immediately using pre-authenticated certified roles:
              </p>

              <button
                onClick={async () => {
                  setLoading(true);
                  await loginAsDriverDemo();
                  setLoading(false);
                  handlePostAuthSuccess();
                }}
                className="w-full p-3.5 rounded-xl border border-teal-200 dark:border-teal-800 bg-teal-50/50 dark:bg-teal-950/30 hover:bg-teal-100/50 dark:hover:bg-teal-900/40 text-left flex items-center justify-between transition-all group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold">
                    <Car className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400">
                      Rahul Sharma (EV Driver)
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      driver@evision.gov.in • Tata Nexon EV • Mumbai
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-teal-600 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={async () => {
                  setLoading(true);
                  await loginAsAdminDemo();
                  setLoading(false);
                  handlePostAuthSuccess();
                }}
                className="w-full p-3.5 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/30 hover:bg-blue-100/50 dark:hover:bg-blue-900/40 text-left flex items-center justify-between transition-all group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      Dr. Anand Verma (Enterprise Administrator)
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      admin@evision.gov.in • Full EDA & Machine Learning Workbench
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => {
                  loginAsGuest();
                  handlePostAuthSuccess();
                }}
                className="w-full p-3.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/40 hover:bg-gray-100 dark:hover:bg-gray-800 text-left flex items-center justify-between transition-all group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-600 text-white flex items-center justify-center font-bold">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                      Instant Guest Explorer
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Explore all public maps, battery tools, and gap rankings instantly
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}

          {/* Location capture notice */}
          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
            <MapPin className="w-3.5 h-3.5 text-teal-600" />
            <span>Upon sign in, EVision calibrates your live GPS location for nearest chargers.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

