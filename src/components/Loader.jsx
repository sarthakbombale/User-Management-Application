const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center p-20">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      <p className="mt-4 text-gray-600 font-medium">Fetching data...</p>
    </div>
  );
};

export default Loader;