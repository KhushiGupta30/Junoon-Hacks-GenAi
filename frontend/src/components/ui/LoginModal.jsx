import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

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
            // Clear form fields
            setEmail('');
            setPassword('');
            setName('');
        }
    }, [isOpen, selectedRole]);

    // Update role state if selectedRole prop changes while modal is open
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
                console.log('Attempting login with:', email);
                await login(email, password);
                onClose(); // Close modal on success
            } else {
                console.log('Attempting registration with:', { name, email, role });
                await register(name, email, password, role);
                onClose(); // Close modal on success
            }
        } catch (err) {
            console.error('Auth error:', err);
            
            // Handle specific Firebase error codes
            let errorMessage = 'An unexpected error occurred.';
            
            if (err.code === 'auth/invalid-email') {
                errorMessage = 'Invalid email address format.';
            } else if (err.code === 'auth/user-disabled') {
                errorMessage = 'This account has been disabled.';
            } else if (err.code === 'auth/user-not-found') {
                errorMessage = 'No account found with this email.';
            } else if (err.code === 'auth/wrong-password') {
                errorMessage = 'Incorrect password.';
            } else if (err.code === 'auth/email-already-in-use') {
                errorMessage = 'An account already exists with this email.';
            } else if (err.code === 'auth/weak-password') {
                errorMessage = 'Password should be at least 6 characters.';
            } else if (err.code === 'auth/network-request-failed') {
                errorMessage = 'Network error. Please check your connection.';
            } else if (err.code === 'auth/too-many-requests') {
                errorMessage = 'Too many failed attempts. Please try again later.';
            } else if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err.message) {
                errorMessage = err.message;
            }
            
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Reset form when switching between login and register
    const toggleView = () => {
        setIsLoginView(!isLoginView);
        setError('');
        setEmail('');
        setPassword('');
        setName('');
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
                <input 
                  type="text" 
                  placeholder="Your Name" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  required 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
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