import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

// The data structure you provided, now available in the component
const indianStatesAndCities = {
    "Andaman and Nicobar Islands": ["Port Blair"],
    "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool"],
    "Arunachal Pradesh": ["Itanagar"],
    "Assam": ["Guwahati", "Dibrugarh", "Silchar"],
    "Bihar": ["Patna", "Gaya", "Bhagalpur"],
    "Chandigarh": ["Chandigarh"],
    "Chhattisgarh": ["Raipur", "Bhilai", "Bilaspur"],
    "Dadra and Nagar Haveli and Daman and Diu": ["Daman", "Silvassa"],
    "Delhi": ["New Delhi"],
    "Goa": ["Panaji", "Vasco da Gama", "Margao"],
    "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot"],
    "Haryana": ["Faridabad", "Gurugram", "Panipat"],
    "Himachal Pradesh": ["Shimla", "Dharamshala"],
    "Jammu and Kashmir": ["Srinagar", "Jammu"],
    "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad"],
    "Karnataka": ["Bengaluru", "Mysuru", "Hubballi-Dharwad"],
    "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode"],
    "Ladakh": ["Leh"],
    "Lakshadweep": ["Kavaratti"],
    "Madhya Pradesh": ["Indore", "Bhopal", "Jabalpur", "Gwalior"],
    "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Thane"],
    "Manipur": ["Imphal"],
    "Meghalaya": ["Shillong"],
    "Mizoram": ["Aizawl"],
    "Nagaland": ["Kohima", "Dimapur"],
    "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela"],
    "Puducherry": ["Puducherry"],
    "Punjab": ["Ludhiana", "Amritsar", "Jalandhar"],
    "Rajasthan": ["Jaipur", "Jodhpur", "Kota", "Udaipur"],
    "Sikkim": ["Gangtok"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli"],
    "Telangana": ["Hyderabad", "Warangal", "Nizamabad"],
    "Tripura": ["Agartala"],
    "Uttar Pradesh": ["Lucknow", "Kanpur", "Ghaziabad", "Agra", "Varanasi"],
    "Uttarakhand": ["Dehradun", "Haridwar"],
    "West Bengal": ["Kolkata", "Asansol", "Siliguri"]
};

const states = Object.keys(indianStatesAndCities);

const LoginModal = ({ isOpen, onClose, selectedRole }) => {
    const { login, register } = useAuth();
    const [isLoginView, setIsLoginView] = useState(true);

    // Form State
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState(selectedRole || 'buyer');
    const [state, setState] = useState('');
    const [city, setCity] = useState('');
    const [language, setLanguage] = useState('en');
    
    // State to hold the list of cities for the selected state
    const [availableCities, setAvailableCities] = useState([]);

    // UI State
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            setRole(selectedRole || 'buyer');
            setError('');
            setIsLoginView(true);
            // Clear all form fields
            setName('');
            setEmail('');
            setPassword('');
            setState('');
            setCity('');
            setLanguage('en');
            setAvailableCities([]);
        }
    }, [isOpen, selectedRole]);

    useEffect(() => {
        if (selectedRole) {
            setRole(selectedRole);
        }
    }, [selectedRole]);

    // This new handler updates the city list when the state changes
    const handleStateChange = (e) => {
        const selectedState = e.target.value;
        setState(selectedState);
        setCity(''); // Reset city selection
        setAvailableCities(indianStatesAndCities[selectedState] || []);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isLoginView) {
                await login(email, password);
                onClose();
            } else {
                await register({ name, email, password, role, state, city, language });
                onClose();
            }
        } catch (err) {
            let errorMessage = 'An unexpected error occurred.';
            if (err.code) { // Handle Firebase specific errors
                switch (err.code) {
                    case 'auth/invalid-email': errorMessage = 'Invalid email address format.'; break;
                    case 'auth/user-not-found': errorMessage = 'No account found with this email.'; break;
                    case 'auth/wrong-password': errorMessage = 'Incorrect password.'; break;
                    case 'auth/email-already-in-use': errorMessage = 'An account already exists with this email.'; break;
                    case 'auth/weak-password': errorMessage = 'Password should be at least 6 characters.'; break;
                    default: errorMessage = err.message;
                }
            } else if (err.response?.data?.message) { // Handle backend API errors
                errorMessage = err.response.data.message;
            } else if (err.message) {
                errorMessage = err.message;
            }
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const toggleView = () => {
        setIsLoginView(!isLoginView);
        setError('');
        setName('');
        setEmail('');
        setPassword('');
        setState('');
        setCity('');
        setLanguage('en');
        setAvailableCities([]);
    };

    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 w-full max-w-md relative">
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition-colors"
            type="button"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
          
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-2">
            {isLoginView ? 'Welcome Back!' : 'Create Your Account'}
          </h3>
          <p className="text-center text-gray-600 mb-8">
            {isLoginView ? 'Please log in.' : `Joining as a ${role}`}
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLoginView && (
              <>
                <input 
                  type="text" 
                  placeholder="Your Name" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  required 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
                
                {/* --- STATE DROPDOWN --- */}
                <select 
                  value={state} 
                  onChange={handleStateChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-500 focus:text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>Select your State</option>
                  {states.sort().map(s => <option key={s} value={s}>{s}</option>)}
                </select>

                {/* --- DYNAMIC CITY DROPDOWN --- */}
                <select 
                  value={city} 
                  onChange={(e) => setCity(e.target.value)}
                  required
                  disabled={!state} // Disabled until a state is chosen
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-500 focus:text-black focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="" disabled>{state ? "Select your City" : "Please select a state first"}</option>
                  {availableCities.map(c => <option key={c} value={c}>{c}</option>)}
                </select>

                {/* --- LANGUAGE DROPDOWN --- */}
                <select 
                  value={language} 
                  onChange={(e) => setLanguage(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-500 focus:text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="en">English</option>
                  <option value="hi">Hindi (हिन्दी)</option>
                </select>
              </>
            )}
            
            <input 
              type="email" 
              placeholder="Enter your email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
              autoComplete="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />
            
            <input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
              minLength="6" 
              autoComplete={isLoginView ? "current-password" : "new-password"}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />
            
            {!isLoginView && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">I am an:</label>
                    <select 
                      value={role} 
                      onChange={(e) => setRole(e.target.value)} 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={!!selectedRole}
                    >
                        <option value="buyer">Buyer</option>
                        <option value="artisan">Artisan</option>
                        <option value="investor">Investor</option>
                        <option value="ambassador">Ambassador</option>
                    </select>
                </div>
            )}
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg mt-4 hover:bg-blue-700 transition-all duration-300 shadow-md disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (isLoginView ? 'Login' : 'Create Account')}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            {isLoginView ? "Don't have an account?" : "Already have an account?"}
            <button 
              onClick={toggleView} 
              className="font-semibold text-blue-600 hover:underline ml-1"
              type="button"
            >
                {isLoginView ? 'Sign Up' : 'Log In'}
            </button>
          </p>
        </div>
      </div>
    );
};

export default LoginModal;