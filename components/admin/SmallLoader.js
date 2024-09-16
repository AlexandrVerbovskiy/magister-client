const SmallLoader = () => {
  return (
    <div className="flex justify-center items-center flex-col">
      <div className="flex items-center justify-center space-x-2">
        <div className="animate-spin rounded-full h-4 w-4 border-t-3 border-b-3 border-slate-200 border-mainColor"></div>
        <span className="text-mainColor text-sm text-slate-400">
          Loading...
        </span>
      </div>
    </div>
  );
};

export default SmallLoader;
