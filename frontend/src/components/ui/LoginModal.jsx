import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext"; // Adjusted path

const LoginModal = ({ isOpen, onClose, selectedRole }) => {
    const { login, register } = useAuth();
    const [isLoginView, setIsLoginView] = useState(true);

    // Form State
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState(selectedRole || 'buyer');
    
    // UI State
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        // When the modal opens, set the role from props
        if (isOpen) {
            setRole(selectedRole || 'buyer');
            setError(''); // Clear previous errors
            setIsLoginView(true); // Default to login view when opening
        }
    }, [isOpen, selectedRole]);

    // Update role state if selectedRole prop changes while modal is open
    // (e.g., user clicks a different role button)
    useEffect(() => {
        if (selectedRole) {
            setRole(selectedRole);
        }
    }, [selectedRole]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isLoginView) {
                await login(email, password);
            } else {
                await register(name, email, password, role);
            }
            onClose(); // Close modal on success
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'An unexpected error occurred.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 w-full max-w-md relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
          
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-2">
            {isLoginView ? 'Welcome Back!' : 'Create Your Account'}
          </h3>
          <p className="text-center text-gray-600 mb-8">
            {isLoginView ? 'Please log in.' : `Joining as a ${role}`}
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLoginView && (
                <input type="text" placeholder="Your Name" value={name} onChange={e => setName(e.target.value)} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            )}
            <input type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required minLength="6" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            
            {!isLoginView && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">I am an:</label>
                    <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="buyer">Buyer</option>
                        <option value="artisan">Artisan</option>
                        <option value="investor">Investor</option>
                        <option value="ambassador">Ambassador</option>
                    </select>
                </div>
            )}
            
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg mt-4 hover:bg-blue-700 transition-all duration-300 shadow-md disabled:bg-blue-300">
                {loading ? 'Processing...' : (isLoginView ? 'Login' : 'Create Account')}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            {isLoginView ? "Don't have an account?" : "Already have an account?"}
            <button onClick={() => setIsLoginView(!isLoginView)} className="font-semibold text-blue-600 hover:underline ml-1">
                {isLoginView ? 'Sign Up' : 'Log In'}
            </button>
          </p>
        </div>
      </div>
    );
};

export default LoginModal;