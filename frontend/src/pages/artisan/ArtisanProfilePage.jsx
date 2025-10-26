import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import AnimatedSection from '../../components/ui/AnimatedSection';
import {
    UserCircleIcon,
    OfficeBuildingIcon,
    CreditCardIcon,
    CameraIcon,
    ExclamationCircleIcon,
    CollectionIcon,
    ChatAltIcon,
    StarIcon
} from '../../components/common/Icons';
import api from '../../api/axiosConfig';

export const ArtisanProfileCard = ({ artisan }) => (
    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
        <img
            src={artisan.profile?.avatarUrl || 'https://placehold.co/128x128/E8F0FE/4285F4?text=A&font=roboto'}
            alt={artisan.name}
            className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white shadow-lg flex-shrink-0"
        />
        <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">{artisan.name}</h1>
            <p className="text-sm font-medium text-google-blue mt-1">{artisan.artisanProfile?.craftSpecialty?.join(', ') || 'Artisan'}</p>
            {artisan.profile?.location && (
                <p className="text-xs text-gray-500 mt-1">{artisan.profile.location.city}, {artisan.profile.location.state}</p>
            )}
            <p className="text-sm text-gray-600 mt-3">{artisan.profile?.bio || 'No bio available.'}</p>
        </div>
    </div>
);

export const ArtisanStats = ({ productsCount, reviewCount, rating }) => (
    <div className="grid grid-cols-3 gap-4 text-center">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
            <CollectionIcon className="w-6 h-6 text-gray-400 mx-auto mb-1" />
            <p className="text-xl font-bold text-gray-800">{productsCount}</p>
            <p className="text-xs text-gray-500">Products</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
            <ChatAltIcon className="w-6 h-6 text-gray-400 mx-auto mb-1" />
            <p className="text-xl font-bold text-gray-800">{reviewCount}</p>
            <p className="text-xs text-gray-500">Reviews</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
             <StarIcon className="w-6 h-6 text-yellow-400 mx-auto mb-1" />
            <p className="text-xl font-bold text-gray-800">{rating ? Number(rating).toFixed(1) : 'N/A'}</p>
            <p className="text-xs text-gray-500">Rating</p>
        </div>
    </div>
);

// Helper StarRating component (if not already defined elsewhere)
const StarRatingDisplay = ({ rating, size = "h-4 w-4" }) => (
    <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
            <StarIcon
                key={i}
                className={`${size} ${i < Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
            />
        ))}
    </div>
);


export const RecentProducts = ({ products }) => (
    <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Products</h2>
        {products && products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {products.map(product => (
                    <Link to={`/product/${product._id || product.id}`} key={product._id || product.id} className="block group">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden group-hover:shadow-md transition-shadow">
                             <img src={product.images?.[0]?.url || '/placeholder.png'} alt={product.name} className="h-40 w-full object-cover"/>
                            <div className="p-3">
                                <p className="text-sm font-medium text-gray-800 truncate group-hover:text-google-blue">{product.name}</p>
                                <p className="text-xs text-google-green font-semibold mt-1">${(product.price || 0).toFixed(2)}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        ) : (
            <p className="text-sm text-gray-500 text-center py-4 bg-gray-50 rounded border">No products listed yet.</p>
        )}
    </div>
);

export const Reviews = ({ reviews }) => (
    <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Reviews</h2>
        {reviews && reviews.length > 0 ? (
            <div className="space-y-4">
                {reviews.map(review => (
                    <div key={review._id || review.id} className="bg-white p-4 rounded-lg border border-gray-200">
                        <div className="flex items-start justify-between">
                            <div>
                                <StarRatingDisplay rating={review.rating} />
                                <p className="text-xs text-gray-500 mt-1">by {review.customerName || 'Anonymous'}</p>
                            </div>
                            <p className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</p>
                        </div>
                        <p className="text-sm text-gray-700 mt-2">{review.comment}</p>
                    </div>
                ))}
            </div>
        ) : (
             <p className="text-sm text-gray-500 text-center py-4 bg-gray-50 rounded border">No reviews yet.</p>
        )}
    </div>
);

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
const PublicProfileSection = ({ artisanData, setArtisanData }) => {
    const fileInputRef = useRef(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setArtisanData({...artisanData, profilePicture: reader.result});
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-lg font-medium text-gray-800">Public Profile</h2>
                <p className="mt-1 text-xs text-gray-500">This information will be displayed on your artisan shop page.</p>
            </div>
           
            <div className="flex items-center gap-5">
                <div className="relative">
                    <img src={artisanData.profilePicture || 'https://placehold.co/96x96/E8F0FE/4285F4?text=A&font=roboto'} alt="Profile" className="w-24 h-24 rounded-full object-cover border border-gray-200" />
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
                     <FormInput label="Studio / Business Name" id="studioName" value={artisanData.studioName} onChange={e => setArtisanData({...artisanData, studioName: e.target.value})} placeholder="e.g., Khushi's Creations" />
                </div>
            </div>

            <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1.5">Your Story / Bio</label>
                <textarea id="bio" rows="5" value={artisanData.bio} onChange={e => setArtisanData({...artisanData, bio: e.target.value})} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-google-blue focus:border-google-blue sm:text-sm" placeholder="Tell buyers about your craft, inspiration, and what makes your work unique..."></textarea>
            </div>
        </div>
    );
};

const BusinessInfoSection = ({ artisanData, setArtisanData }) => {
    return (
         <div className="space-y-8">
            <div>
                <h2 className="text-lg font-medium text-gray-800">Business Information</h2>
                <p className="mt-1 text-xs text-gray-500">Provide details about you and your business operations.</p>
            </div>
            <div className="space-y-6 pt-4 border-t border-gray-100">
                 <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Contact Details</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput label="Artisan Name" id="artisanName" value={artisanData.artisanName} onChange={e => setArtisanData({...artisanData, artisanName: e.target.value})} placeholder="Your full name" required />
                    <FormInput label="Contact Phone" id="contact" type="tel" value={artisanData.contact} onChange={e => setArtisanData({...artisanData, contact: e.target.value})} placeholder="e.g., +91 98765 43210" required />
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormInput label="City" id="city" value={artisanData.city} onChange={e => setArtisanData({...artisanData, city: e.target.value})} placeholder="e.g., New Delhi" />
                    <FormInput label="State" id="state" value={artisanData.state} onChange={e => setArtisanData({...artisanData, state: e.target.value})} placeholder="e.g., Delhi" />
                    <FormInput label="Pincode" id="pincode" value={artisanData.pincode} onChange={e => setArtisanData({...artisanData, pincode: e.target.value})} placeholder="e.g., 110001" />
                 </div>
            </div>
            <div className="space-y-6 pt-4 border-t border-gray-100">
                 <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Craft Details</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormSelect label="Primary Speciality" id="speciality" value={artisanData.speciality} onChange={e => setArtisanData({...artisanData, speciality: e.target.value})}>
                        <option value="">Select your craft</option>
                        <option value="Pottery">Pottery</option>
                        <option value="Textiles">Textiles</option>
                        <option value="Painting">Painting</option>
                        <option value="Woodwork">Woodwork</option>
                        <option value="Metalwork">Metalwork</option>
                        <option value="Jewelry">Jewelry</option>
                        <option value="Other">Other</option>
                    </FormSelect>
                    <FormSelect label="Working Status" id="workingStatus" value={artisanData.workingStatus} onChange={e => setArtisanData({...artisanData, workingStatus: e.target.value})}>
                        <option value="">Select status</option>
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Hobbyist">Hobbyist</option>
                    </FormSelect>
                 </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput label="No. of Team Members" id="teamMembers" type="number" value={artisanData.teamMembers} onChange={e => setArtisanData({...artisanData, teamMembers: e.target.value})} min="1" placeholder="e.g., 3" />
                    <FormSelect label="Language Preference" id="languagePreference" value={artisanData.languagePreference} onChange={e => setArtisanData({...artisanData, languagePreference: e.target.value})}>
                        <option value="en">English</option>
                        <option value="hi">हिन्दी (Hindi)</option>
                    </FormSelect>
                 </div>
            </div>
         </div>
    );
};

const PayoutsSection = ({ artisanData, setArtisanData }) => {
     return (
        <div className="space-y-8">
            <div>
                <h2 className="text-lg font-medium text-gray-800">Payout Details</h2>
                <p className="mt-1 text-xs text-gray-500">This is where your earnings will be sent. This information is kept private.</p>
            </div>
            <div className="p-4 bg-yellow-50/70 border border-yellow-200 rounded-lg flex items-start gap-3">
                <ExclamationCircleIcon className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-yellow-800">For security, payout details can only be changed by contacting support after they have been verified.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <FormInput label="Bank Name" id="bankName" value={artisanData.bankName} onChange={e => setArtisanData({...artisanData, bankName: e.target.value})} />
                 <FormInput label="Account Holder Name" id="accountHolder" value={artisanData.accountHolder} onChange={e => setArtisanData({...artisanData, accountHolder: e.target.value})} />
                 <FormInput label="Account Number" id="accountNumber" value={artisanData.accountNumber} onChange={e => setArtisanData({...artisanData, accountNumber: e.target.value})} />
                 <FormInput label="IFSC / Routing Code" id="ifscCode" value={artisanData.ifscCode} onChange={e => setArtisanData({...artisanData, ifscCode: e.target.value})} />
            </div>
        </div>
    );
};

// --- MAIN PROFILE PAGE COMPONENT ---
const ArtisanProfilePage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
 
  const [artisanData, setArtisanData] = useState({
      studioName: '',
      bio: '',
      profilePicture: '',
      artisanName: '',
      contact: '',
      city: '',
      state: '',
      pincode: '',
      speciality: '',
      workingStatus: '',
      teamMembers: 1,
      languagePreference: 'en',
      bankName: '',
      accountHolder: '',
      accountNumber: '',
      ifscCode: ''
  });

  useEffect(() => {
      setLoading(true);
      setTimeout(() => {
          setLoading(false);
      }, 1000);
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
        await api.put('/artisan/profile', artisanData);
    } catch (error) {
        console.error("Failed to save profile:", error);
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
      case 'business':
        currentSection = <BusinessInfoSection artisanData={artisanData} setArtisanData={setArtisanData} />;
        break;
      case 'payouts':
        currentSection = <PayoutsSection artisanData={artisanData} setArtisanData={setArtisanData} />;
        break;
      default:
        currentSection = <PublicProfileSection artisanData={artisanData} setArtisanData={setArtisanData} />;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <aside className="md:col-span-1 md:sticky md:top-24 self-start">
                <AnimatedSection>
                    <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-200 space-y-1">
                        <SideNavItem icon={<UserCircleIcon />} isActive={activeTab === 'profile'} onClick={() => setActiveTab('profile')}>Public Profile</SideNavItem>
                        <SideNavItem icon={<OfficeBuildingIcon />} isActive={activeTab === 'business'} onClick={() => setActiveTab('business')}>Business Info</SideNavItem>
                        <SideNavItem icon={<CreditCardIcon />} isActive={activeTab === 'payouts'} onClick={() => setActiveTab('payouts')}>Payout Details</SideNavItem>
                    </div>
                </AnimatedSection>
            </aside>

            <main className="md:col-span-3">
                <AnimatedSection className='pt-8'>
                    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-200">
                        {currentSection}
                        <div className="mt-8 pt-5 border-t border-gray-100 flex justify-end">
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
    <div className="bg-gradient-to-br from-[#F8F9FA] via-[#F1F3F4] to-[#E8F0FE] min-h-[calc(100vh-4rem)] px-4 sm:px-6 md:px-8 py-8 md:py-10">
        <div className="max-w-screen-xl mx-auto">
            {renderContent()}
        </div>
    </div>
  );
};

export default ArtisanProfilePage;