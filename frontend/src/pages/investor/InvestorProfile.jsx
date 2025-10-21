import React, { useState, useEffect, useRef } from 'react';
import AnimatedSection from '../../components/ui/AnimatedSection';
import {
    UserCircleIcon,
    OfficeBuildingIcon,
    CreditCardIcon,
    CameraIcon,
    ExclamationCircleIcon,
    SparklesIcon // Using this for 'Preferences'
} from '../../components/common/Icons';
import api from '../../api/axiosConfig';
import { useAuth } from '../../context/AuthContext'; // Import useAuth

// --- Reusable Form Components ---
const FormInput = ({ label, id, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
    <input
      id={id}
      {...props}
      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400
                 focus:outline-none focus:ring-1 focus:ring-google-blue focus:border-google-blue sm:text-sm
                 disabled:bg-gray-50 disabled:text-gray-500"
    />
  </div>
);

const FormSelect = ({ label, id, children, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
    <select
      id={id}
      {...props}
      className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm
                 focus:outline-none focus:ring-1 focus:ring-google-blue focus:border-google-blue sm:text-sm"
    >
      {children}
    </select>
  </div>
);

// --- Side Navigation Component ---
const SideNavItem = ({ icon, children, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            isActive
                ? 'bg-google-blue/10 text-google-blue'
                : 'text-gray-600 hover:bg-gray-100'
        }`}
    >
        {React.cloneElement(icon, { className: "w-5 h-5 mr-3"})}
        <span>{children}</span>
    </button>
);

// --- Individual Form Sections ---
const PersonalInfoSection = ({ investorData, setInvestorData }) => {
    const fileInputRef = useRef(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setInvestorData({...investorData, profilePicture: reader.result});
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-lg font-medium text-gray-800">Personal Info</h2>
                <p className="mt-1 text-xs text-gray-500">This information will be used for your account and profile.</p>
            </div>
           
            <div className="flex items-center gap-5">
                <div className="relative">
                    <img src={investorData.profilePicture || 'https://placehold.co/96x96/E8F0FE/4285F4?text=I&font=roboto'} alt="Profile" className="w-24 h-24 rounded-full object-cover border border-gray-200" />
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        accept="image/png, image/jpeg"
                        className="hidden"
                        id="profilePictureInput"
                    />
                    <label
                        htmlFor="profilePictureInput"
                        className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full shadow-md border border-gray-200 hover:bg-gray-100 transition cursor-pointer"
                    >
                        <CameraIcon className="w-4 h-4 text-gray-600"/>
                    </label>
                </div>
                <div className="flex-1">
                     <FormInput label="Full Name" id="name" value={investorData.name} onChange={e => setInvestorData({...investorData, name: e.target.value})} placeholder="Your full name" required />
                </div>
            </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput label="Email Address" id="email" type="email" value={investorData.email} disabled />
                <FormInput label="Contact Phone" id="contact" type="tel" value={investorData.contact} onChange={e => setInvestorData({...investorData, contact: e.target.value})} placeholder="e.g., +91 98765 43210" />
             </div>

            <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1.5">Investor Bio</label>
                <textarea id="bio" rows="5" value={investorData.bio} onChange={e => setInvestorData({...investorData, bio: e.target.value})} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-google-blue focus:border-google-blue sm:text-sm" placeholder="Tell artisans about your investment interests, background, or what you look for..."></textarea>
            </div>
        </div>
    );
};

const InvestmentProfileSection = ({ investorData, setInvestorData }) => {
    return (
         <div className="space-y-8">
            <div>
                <h2 className="text-lg font-medium text-gray-800">Investment Profile</h2>
                <p className="mt-1 text-xs text-gray-500">Help us match you with the right artisans and opportunities.</p>
            </div>
            <div className="space-y-6 pt-4 border-t border-gray-100">
                 <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Preferences</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormSelect label="Interested Crafts (Primary)" id="interestedCrafts" value={investorData.interestedCrafts} onChange={e => setInvestorData({...investorData, interestedCrafts: e.target.value})}>
                        <option value="">Select a craft category</option>
                        <option value="Pottery">Pottery</option>
                        <option value="Textiles">Textiles</option>
                        <option value="Painting">Painting</option>
                        <option value="Woodwork">Woodwork</option>
                        <option value="Metalwork">Metalwork</option>
                        <option value="Jewelry">Jewelry</option>
                        <option value="All">All Categories</option>
                        <option value="Other">Other</option>
                    </FormSelect>
                    <FormSelect label="Typical Investment Range" id="typicalInvestmentRange" value={investorData.typicalInvestmentRange} onChange={e => setInvestorData({...investorData, typicalInvestmentRange: e.target.value})}>
                        <option value="">Select range</option>
                        <option value="<$500">$100 - $500</option>
                        <option value="$500-$2500">$500 - $2,500</option>
                        <option value="$2500+">$2,500 +</option>
                    </FormSelect>
                 </div>
                 <div>
                    <label htmlFor="investmentGoals" className="block text-sm font-medium text-gray-700 mb-1.5">Investment Goals</label>
                    <textarea id="investmentGoals" rows="4" value={investorData.investmentGoals} onChange={e => setInvestorData({...investorData, investmentGoals: e.target.value})} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-google-blue focus:border-google-blue sm:text-sm" placeholder="e.g., Supporting sustainable crafts, long-term growth, community impact..."></textarea>
                 </div>
            </div>
         </div>
    );
};

const BillingSection = ({ investorData, setInvestorData }) => {
     return (
        <div className="space-y-8">
            <div>
                <h2 className="text-lg font-medium text-gray-800">Billing Details</h2>
                <p className="mt-1 text-xs text-gray-500">This is where your investment returns will be sent. This information is kept private.</p>
            </div>
            <div className="p-4 bg-yellow-50/70 border border-yellow-200 rounded-lg flex items-start gap-3">
                <ExclamationCircleIcon className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-yellow-800">For security, billing details can only be changed by contacting support after they have been verified.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <FormInput label="Bank Name" id="bankName" value={investorData.bankName} onChange={e => setInvestorData({...investorData, bankName: e.target.value})} />
                 <FormInput label="Account Holder Name" id="accountHolder" value={investorData.accountHolder} onChange={e => setInvestorData({...investorData, accountHolder: e.target.value})} />
                 <FormInput label="Account Number" id="accountNumber" value={investorData.accountNumber} onChange={e => setInvestorData({...investorData, accountNumber: e.target.value})} />
                 <FormInput label="IFSC / Routing Code" id="ifscCode" value={investorData.ifscCode} onChange={e => setInvestorData({...investorData, ifscCode: e.target.value})} />
            </div>
        </div>
    );
};

// --- MAIN PROFILE PAGE COMPONENT ---
// Ensure this name matches your export
const InvestorProfile = () => {
  const { user } = useAuth(); 
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
 
  const [investorData, setInvestorData] = useState({
      name: '',
      email: '',
      contact: '',
      profilePicture: '',
      bio: '',
      interestedCrafts: '',
      typicalInvestmentRange: '',
      investmentGoals: '',
      bankName: '',
      accountHolder: '',
      accountNumber: '',
      ifscCode: ''
  });

  useEffect(() => {
      setLoading(true);
      
      // Simulating fetch and setting user data from auth context
      setTimeout(() => {
          setInvestorData(prev => ({
              ...prev,
              name: user.name || '',
              email: user.email || '',
              // ...other fetched data would be spread here
          }));
          setLoading(false);
      }, 1000);
  }, [user]); // Depend on the user object

  const handleSave = async () => {
    setIsSaving(true);
    try {
        const { email, ...dataToSave } = investorData;
        await api.put('/investor/profile', dataToSave);
        // Add toast.success('Profile saved!');
    } catch (error) {
        console.error("Failed to save profile:", error);
        // Add toast.error('Failed to save.');
    } finally {
        setIsSaving(false);
    }
  }

  const renderContent = () => {
    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <aside className="md:col-span-1">
                    <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-200 space-y-1 animate-pulse">
                        <div className="h-10 bg-gray-200 rounded-md"></div>
                        <div className="h-10 bg-gray-200 rounded-md"></div>
                        <div className="h-10 bg-gray-200 rounded-md"></div>
                    </div>
                </aside>
                <main className="md:col-span-3">
                    <div className="h-96 bg-gray-200 rounded-xl animate-pulse"></div>
                </main>
            </div>
        );
    }

    let currentSection;
    switch (activeTab) {
      case 'preferences':
        currentSection = <InvestmentProfileSection investorData={investorData} setInvestorData={setInvestorData} />;
        break;
      case 'billing':
        currentSection = <BillingSection investorData={investorData} setInvestorData={setInvestorData} />;
        break;
      default:
        currentSection = <PersonalInfoSection investorData={investorData} setInvestorData={setInvestorData} />;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <aside className="md:col-span-1 md:sticky md:top-24 self-start">
                <AnimatedSection>
                    <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-200 space-y-1">
                        <SideNavItem icon={<UserCircleIcon />} isActive={activeTab === 'profile'} onClick={() => setActiveTab('profile')}>Personal Info</SideNavItem>
                        <SideNavItem icon={<SparklesIcon />} isActive={activeTab === 'preferences'} onClick={() => setActiveTab('preferences')}>Investment Profile</SideNavItem>
                        <SideNavItem icon={<CreditCardIcon />} isActive={activeTab === 'billing'} onClick={() => setActiveTab('billing')}>Billing Details</SideNavItem>
                    </div>
                </AnimatedSection>
            </aside>

            <main className="md:col-span-3">
                <AnimatedSection >
                    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-200">
                        {currentSection}
                        <div className="mt-8  border-t border-gray-100 flex justify-end">
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="bg-google-blue text-white font-bold px-5 py-2.5 rounded-lg hover:bg-opacity-90 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center gap-2"
                            >
                                {isSaving && <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </AnimatedSection>
            </main>
        </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-[#F8F9FA] via-[#F1F3F4] to-[#E8F0FE] min-h-[calc(100vh-4rem)] px-4 sm:px-6 md:px-8 ">
        <div className="max-w-screen-xl mx-auto">
            {renderContent()}
        </div>
    </div>
  );
};

// Ensure this default export matches the component name
export default InvestorProfile;
