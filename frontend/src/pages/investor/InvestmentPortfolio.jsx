import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';

const InvestmentPortfolio = () => {
    const [investments, setInvestments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInvestments = async () => {
            try {
                const response = await api.get('/investments');
                setInvestments(response.data.investments || []);
            } catch (error) {
                console.error("Failed to fetch investments:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchInvestments();
    }, []);

    if (loading) {
        return <div>Loading your investments...</div>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">My Investments</h1>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
                {investments.length > 0 ? (
                    investments.map(investment => (
                        <div key={investment.id} className="border-b py-4">
                            <p className="font-bold">{investment.artisan.name}</p>
                            <p>Amount: ${investment.amount}</p>
                            <p>Type: {investment.type}</p>
                            <p>Status: {investment.status}</p>
                        </div>
                    ))
                ) : (
                    <p>You have not made any investments yet.</p>
                )}
            </div>
        </div>
    );
};

export default InvestmentPortfolio;