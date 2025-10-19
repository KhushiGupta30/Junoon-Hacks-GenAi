const SkeletonListItem = () => (
     <div className="flex items-center space-x-3 py-3 animate-pulse">
        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
        <div className="flex-1 space-y-2">
             <div className="h-4 bg-gray-200 rounded w-3/4"></div>
             <div className="h-3 bg-gray-200 rounded w-1/2"></div>
         </div>
     </div>
 );

export default SkeletonListItem;