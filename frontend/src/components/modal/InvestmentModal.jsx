import React, { useState } from 'react';
import api from '../../api/axiosConfig';
import { X, Loader } from 'lucide-react';

const InvestmentModal = ({ isOpen, onClose, artisanId, artisanName, onSuccess }) => {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleInvestment = async (e) => {
    e.preventDefault();
    setError('');

    if (!amount || Number(amount) <= 0) {
      setError('Please enter a valid investment amount.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/investments', {
        artisanId,
        amount: Number(amount),
      });
      onSuccess(`Your investment of $${amount} in ${artisanName} was successful!`);
      onClose();
      setAmount('');
    } catch (err) {
      const apiError = err.response?.data?.message || 'An unexpected error occurred.';
      setError(apiError);
      console.error('Investment failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-gray-800/20 backdrop-blur-sm z-40"
      />

      {}
      <div className="fixed inset-0 z-50 flex justify-center items-center">
        {}
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md m-4"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Invest in {artisanName}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
              <X size={24} />
            </button>
          </div>
          <form onSubmit={handleInvestment}>
            <p className="text-gray-600 mb-4">
              Enter the amount you wish to invest. This will directly support the artisan's business and material costs.
            </p>
            <div className="mb-4">
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                Investment Amount ($)
              </label>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g., 500"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                min="1"
                step="any"
              />
            </div>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-blue-300 flex items-center"
              >
                {loading && <Loader className="animate-spin mr-2" size={20} />}
                Confirm Investment
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default InvestmentModal;
