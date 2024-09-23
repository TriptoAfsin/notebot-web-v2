import { Box } from "@/components/atoms/layout";
import Hero from "@/components/organisms/views/home/hero";

export default function HeroSkeleton() {
  return (
    <>
      {/* Hero Section */}
      <Hero isLoggedIn={false} />
      <Box className="container mx-auto px-4 py-8">
        {/* Featured Items */}
        <Box className="mb-12">
          <Box className="h-8 bg-gray-200 rounded w-48 mx-auto mb-8 animate-pulse"></Box>
          <Box className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map(item => (
              <Box key={item} className="bg-gray-100 rounded-lg p-6">
                <Box className="h-48 bg-gray-200 rounded-lg mb-4 animate-pulse"></Box>
                <Box className="h-6 bg-gray-200 rounded w-1/2 mb-2 animate-pulse"></Box>
                <Box className="h-4 bg-gray-200 rounded w-3/4 mb-4 animate-pulse"></Box>
                <Box className="h-10 bg-gray-200 rounded w-24 animate-pulse"></Box>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Deals of the Week */}
        <Box>
          <Box className="h-8 bg-gray-200 rounded w-64 mx-auto mb-8 animate-pulse"></Box>
          <Box className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map(item => (
              <Box key={item} className="flex bg-gray-100 rounded-lg p-4">
                <Box className="w-1/3">
                  <Box className="h-32 bg-gray-200 rounded-lg animate-pulse"></Box>
                </Box>
                <Box className="w-2/3 pl-4">
                  <Box className="h-6 bg-gray-200 rounded w-1/2 mb-2 animate-pulse"></Box>
                  <Box className="h-4 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></Box>
                  <Box className="flex space-x-2 mb-2">
                    {[1, 2, 3, 4].map(unit => (
                      <Box
                        key={unit}
                        className="h-8 w-8 bg-gray-200 rounded animate-pulse"
                      ></Box>
                    ))}
                  </Box>
                  <Box className="h-10 bg-gray-200 rounded w-24 animate-pulse"></Box>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </>
  );
}
