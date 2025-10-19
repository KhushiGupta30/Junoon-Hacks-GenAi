const SkeletonStat = () => (
    <div className="bg-white p-6 rounded-2xl shadow-lg border-l-8 border-gray-200 animate-pulse">
        <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-full bg-gray-200"></div>
            <div className="h-4 w-1/3 bg-gray-200 rounded"></div>
        </div>
        <div>
            <div className="h-8 w-1/2 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
        </div>
    </div>
);

export default SkeletonStat;