export const ShortCopySkeletonLoader = ({ lines = 1 }) => {
  return (
    <div role="status" className="animate-pulse max-w-lg">
      {lines === 1 ? (
        <div className="h-4 m-1 bg-gray-200 rounded-full dark:bg-gray-700 w-48"></div>
      ) : (
        <div className="m-2">
          <div className="h-3 bg-gray-200 rounded-full dark:bg-gray-700 w-32 mb-2"></div>
          <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48"></div>
        </div>
      )}
    </div>
  );
};

export const IconLoader = () => (
  <div role="status" className="animate-pulse">
    <div className="h-4 bg-gray-200 rounded-full dark:bg-gray-700 w-8"></div>
  </div>
);

export const MessageLoader = ({ incoming = true }) => (
  <div role="status" className="animate-pulse max-w-full p-4">
    {incoming ? (
      <div className="m-2">
        <div className="h-3 bg-gray-200 rounded-full dark:bg-gray-700 w-32 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded-full dark:bg-gray-700 w-80 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded-full dark:bg-gray-700 w-40 mb-2"></div>
        <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-16"></div>
      </div>
    ) : (
      <div className="m-2 mr-0 flex flex-col items-end">
        <div className="h-3 bg-gray-200 rounded-full dark:bg-gray-700 w-32 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded-full dark:bg-gray-700 w-80 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded-full dark:bg-gray-700 w-40 mb-2"></div>
        <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-16"></div>
      </div>
    )}
  </div>
);
