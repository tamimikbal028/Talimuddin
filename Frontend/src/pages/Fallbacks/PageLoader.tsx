const PageLoader = () => {
  return (
    <div className="flex flex-col items-center gap-5 border p-15">
      <div className="h-15 w-15 animate-spin rounded-full border-4 border-blue-600 border-t-transparent shadow-lg"></div>
      <p className="text-3xl font-bold text-gray-700">
        Please wait, loading...
      </p>
    </div>
  );
};

export default PageLoader;
