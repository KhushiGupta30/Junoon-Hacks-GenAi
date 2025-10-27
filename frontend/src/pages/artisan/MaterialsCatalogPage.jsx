import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AnimatedSection from '../../components/ui/AnimatedSection';
import {
    ArrowLeftIcon,
    BuildingStorefrontIcon,
    ArchiveIcon 
} from '../../components/common/Icons'; // Assuming you have these

// --- Tab Button Component (Copied from your other pages) ---
const TabButton = ({ title, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2.5 text-sm transition-colors relative whitespace-nowrap ${
            isActive ? 'text-google-blue font-medium' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100/50 rounded-t-md'
        }`}
    >
        {title}
        {isActive && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-google-blue rounded-t-full"></div>}
    </button>
);

// --- Placeholder for Catalog View ---
const CatalogBrowseView = () => (
    <AnimatedSection>
        <div className="text-center py-16 px-6 bg-white rounded-lg border-2 border-dashed">
            <BuildingStorefrontIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700">Catalog View</h3>
            <p className="text-gray-500 mt-2 text-sm">
                This is where you will build the "Browse Catalog" experience.
            </p>
        </div>
    </AnimatedSection>
);

// --- Placeholder for Order History View ---
const OrderHistoryView = () => (
    <AnimatedSection>
        <div className="text-center py-16 px-6 bg-white rounded-lg border-2 border-dashed">
            <ArchiveIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700">Order History</h3>
            <p className="text-gray-500 mt-2 text-sm">
                This is where you will build the "My Order History" list.
            </p>
        </div>
    </AnimatedSection>
);


// --- MAIN MATERIALS CATALOG PAGE ---
const MaterialsCatalogPage = () => {
    const [activeTab, setActiveTab] = useState('catalog'); // 'catalog' or 'history'

    return (
        <div className="px-6 md:px-8 py-8 md:py-15 bg-gradient-to-br from-[#F8F9FA] via-[#F1F3F4] to-[#E8F0FE] min-h-screen">
            
            {/* --- Page Header --- */}
            <AnimatedSection className="mb-8">
                <Link
                    to="/artisan/raw-materials"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-google-blue hover:underline mb-4"
                >
                    <ArrowLeftIcon className="w-4 h-4" />
                    Back to Our Process
                </Link>
                <h1 className="text-3xl font-semibold text-gray-800 tracking-tight">
                    Materials Marketplace
                </h1>
                <p className="mt-2 text-lg text-gray-600">
                    Browse, order, and track your ethically sourced materials.
                </p>
            </AnimatedSection>

            {/* --- Tab Navigation --- */}
            <div className="border-b border-gray-200 mb-8 sticky top-16 bg-white/80 backdrop-blur-sm z-30 -mx-6 md:-mx-8 px-6 md:px-8">
                <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
                    <TabButton title="Browse Catalog" isActive={activeTab === 'catalog'} onClick={() => setActiveTab('catalog')} />
                    <TabButton title="My Order History" isActive={activeTab === 'history'} onClick={() => setActiveTab('history')} />
                </div>
            </div>

            {/* --- Tab Content --- */}
            <div>
                {activeTab === 'catalog' && <CatalogBrowseView />}
                {activeTab === 'history' && <OrderHistoryView />}
            </div>
            
        </div>
    );
};

export default MaterialsCatalogPage;