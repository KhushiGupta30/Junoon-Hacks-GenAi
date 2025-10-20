import React, { useState, useEffect } from 'react';
// Import necessary icons
import { XIcon, ThumbUpIcon, ChatAltIcon, PlusCircleIcon } from '../common/Icons'; // Adjust path, ensure ChatAltIcon and PlusCircleIcon exist

const IdeaDetailModal = ({ idea, onClose, onAddToProducts }) => {
    const [show, setShow] = useState(false);

    // Mock comments/reviews for demonstration
    const mockComments = [
        { id: 1, author: 'Buyer A', text: 'Love this concept! Would definitely buy.', time: '1d ago' },
        { id: 2, author: 'Artisan B', text: 'Consider using sustainable wood? Might appeal more.', time: '2d ago' },
    ];

    useEffect(() => {
        setShow(true); // Trigger fade-in animation
    }, []);

    const handleClose = () => {
        setShow(false);
        setTimeout(onClose, 300); // Wait for animation before unmounting
    };

    const handleAddClick = () => {
        onAddToProducts(idea); // Pass the idea data
        handleClose(); // Close modal after action
    };

    if (!idea) return null;

    return (
        <div
            className={`fixed inset-0 z-[100] flex justify-center items-center p-4 transition-opacity duration-300 ${show ? 'opacity-100' : 'opacity-0'} bg-black/60`} // Darker overlay
            onClick={handleClose}
        >
            <div
                className={`relative bg-white w-full max-w-lg rounded-xl shadow-xl transform transition-all duration-300 ${show ? 'scale-100 opacity-100' : 'scale-95 opacity-0'} flex flex-col max-h-[85vh]`} // Max height
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-200 flex-shrink-0">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800">{idea.title}</h3>
                        <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{idea.category}</span>
                    </div>
                    <button onClick={handleClose} className="text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors">
                        <XIcon className="w-5 h-5"/>
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="p-5 overflow-y-auto space-y-5 flex-grow">
                     {/* Description */}
                     <div>
                         <h4 className="text-sm font-medium text-gray-500 mb-1">Description</h4>
                         <p className="text-sm text-gray-700 whitespace-pre-wrap">{idea.description || "No description provided."}</p>
                     </div>

                    {/* Votes */}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                         <ThumbUpIcon className="w-4 h-4 text-google-blue" />
                         <span className="font-medium">{idea.votes} Votes</span>
                    </div>

                     {/* Comments/Reviews */}
                     <div>
                         <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-1.5">
                             <ChatAltIcon className="w-4 h-4"/> Feedback ({mockComments.length})
                         </h4>
                         <div className="space-y-3 max-h-48 overflow-y-auto border rounded-md p-3 bg-gray-50/50">
                             {mockComments.length > 0 ? mockComments.map(comment => (
                                 <div key={comment.id} className="text-xs border-b border-gray-200 pb-2 last:border-b-0">
                                     <p className="text-gray-700">{comment.text}</p>
                                     <p className="text-gray-400 mt-1">- {comment.author}, {comment.time}</p>
                                 </div>
                             )) : (
                                 <p className="text-xs text-gray-500 text-center py-4">No feedback yet.</p>
                             )}
                         </div>
                     </div>
                </div>

                 {/* Footer Action */}
                 <div className="p-4 border-t border-gray-200 bg-gray-50/70 flex-shrink-0">
                     <button
                         onClick={handleAddClick}
                         className="w-full flex items-center justify-center bg-google-green text-white font-medium py-2 rounded-lg hover:bg-opacity-90 transition-colors shadow-sm text-sm gap-1.5"
                     >
                         <PlusCircleIcon className="w-5 h-5"/>
                         Add to My Products
                     </button>
                 </div>

            </div>
        </div>
    );
};
export default IdeaDetailModal;

// --- Add ChatAltIcon and PlusCircleIcon to Icons.jsx if needed -