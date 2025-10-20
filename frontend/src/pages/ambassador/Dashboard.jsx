import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import { Users, Star, BarChart2 } from 'lucide-react';
// FIX: Changed from { SkeletonStat } to SkeletonStat to handle the default export
import SkeletonStat from '../../components/ui/SkeletonStat';

const StatCard = ({ icon, title, value, colorClass }) => (
    <div className="bg-white p-6 rounded-lg shadow flex items-center">
        <div className={`rounded-full p-3 ${colorClass}`}>
            {icon}
        </div>
        <div className="ml-4">
            <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
    </div>
);

const AmbassadorDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const response = await api.get('/dashboard/ambassador-stats');
                setStats(response.data);
            } catch (error) {
                console.error("Failed to fetch ambassador stats:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SkeletonStat />
                <SkeletonStat />
                <SkeletonStat />
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Impact</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard 
                    icon={<Users size={24} className="text-white" />}
                    title="Mentored Artisans"
                    value={stats?.mentoredArtisans || 0}
                    colorClass="bg-blue-500"
                />
                <StatCard 
                    icon={<Star size={24} className="text-white" />}
                    title="Community Rating"
                    value={stats?.communityRating || 'N/A'}
                    colorClass="bg-yellow-500"
                />
                <StatCard 
                    icon={<BarChart2 size={24} className="text-white" />}
                    title="Artisan Sales Growth"
                    value={`${stats?.artisanSalesGrowth || 0}%`}
                    colorClass="bg-green-500"
                />
            </div>
            {/* You can add more dashboard components here */}
        </div>
    );
};

export default AmbassadorDashboard;