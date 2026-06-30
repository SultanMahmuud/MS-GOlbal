const Loading = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center ml-72">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-5xl p-4">
        {Array.from({ length: 7 }).map((_, idx) => (
          <div
            key={idx}
            className="animate-pulse bg-gray-200 rounded-xl h-28 w-full"
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Loading;
