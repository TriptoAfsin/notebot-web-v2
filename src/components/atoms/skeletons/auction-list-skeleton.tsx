import { Box } from "@/components/atoms/layout";

export default function AuctionListSkeleton() {
  return (
    <Box className="container mx-auto p-4">
      {/* Header */}
      <h1 className="text-2xl font-bold mb-4 animate-pulse bg-gray-200 h-8 w-32"></h1>

      {/* Search and Sort */}
      <Box className="flex flex-row justify-between mb-4 space-y-2 sm:space-y-0">
        {/* <Box className="w-full sm:w-2/3 h-10 bg-gray-200 rounded animate-pulse"></Box> */}
        <Box className="w-full sm:w-1/4 h-10 bg-gray-200 rounded animate-pulse ml-auto"></Box>
      </Box>

      {/* Main content area */}
      <Box className="flex md:flex-row flex-col">
        {/* Sidebar */}
        <Box className="w-full md:w-1/4 pr-0 md:pr-4 mb-4 md:mb-0 hidden md:block">
          {/* Price Range */}
          <Box className="mb-4">
            <Box className="h-6 bg-gray-200 rounded w-1/2 mb-2 animate-pulse"></Box>
            <Box className="h-4 bg-gray-200 rounded animate-pulse"></Box>
          </Box>

          {/* Style */}
          <Box className="mb-4">
            <Box className="h-6 bg-gray-200 rounded w-1/2 mb-2 animate-pulse"></Box>
            <Box className="space-y-2">
              {[...Array(4)].map((_, index) => (
                <Box
                  key={`style-${index}`}
                  className="h-4 bg-gray-200 rounded animate-pulse"
                ></Box>
              ))}
            </Box>
          </Box>

          {/* Material */}
          <Box className="mb-4">
            <Box className="h-6 bg-gray-200 rounded w-1/2 mb-2 animate-pulse"></Box>
            <Box className="space-y-2">
              {[...Array(6)].map((_, index) => (
                <Box
                  key={`material-${index}`}
                  className="h-4 bg-gray-200 rounded animate-pulse"
                ></Box>
              ))}
            </Box>
          </Box>

          {/* Quantity */}
          <Box>
            <Box className="h-6 bg-gray-200 rounded w-1/2 mb-2 animate-pulse"></Box>
            <Box className="space-y-2">
              {[...Array(3)].map((_, index) => (
                <Box
                  key={`quantity-${index}`}
                  className="h-4 bg-gray-200 rounded animate-pulse"
                ></Box>
              ))}
            </Box>
          </Box>
        </Box>

        {/* Product grid */}
        <Box className="w-full md:w-3/4 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[...Array(2)].map((_, index) => (
            <Box
              key={`product-${index}`}
              className="border rounded-lg p-4 h-[400px]"
            >
              <Box className="w-full h-48 bg-gray-200 rounded mb-4 animate-pulse"></Box>
              <Box className="h-6 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></Box>
              <Box className="h-4 bg-gray-200 rounded w-1/2 mb-2 animate-pulse"></Box>
              <Box className="h-4 bg-gray-200 rounded w-1/4 mb-4 animate-pulse"></Box>
              <Box className="h-8 bg-gray-200 rounded w-1/3 animate-pulse"></Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
