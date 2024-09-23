import { Box } from "@/components/atoms/layout";
import React from "react";

export default function AuctionDetailSkeleton() {
  return (
    <Box className="container mx-auto p-4">
      {/* Breadcrumb */}
      <Box className="flex items-center space-x-2 mb-4">
        {["Home", "Auctions", ""].map((item, index) => (
          <React.Fragment key={index}>
            <Box className="h-4 bg-gray-200 rounded animate-pulse w-16"></Box>
            {index < 2 && <span className="text-gray-500">&gt;</span>}
          </React.Fragment>
        ))}
      </Box>

      <Box className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-6">
        {/* Product Image */}
        <Box>
          <Box className="size-[300px] lg:size-[500px] aspect-h-1 bg-gray-200 rounded-md animate-pulse"></Box>
        </Box>

        {/* Product Details */}
        <Box className="w-full ">
          {/* Countdown Timer */}
          <Box className="flex gap-2 mb-4">
            {["Days", "Hours", "Mins", "Secs"].map((unit, index) => (
              <Box key={index} className="text-center">
                <Box className="h-8 w-8 bg-gray-200 rounded animate-pulse mb-1 mx-auto"></Box>
                <Box className="h-4 w-12 bg-gray-200 rounded animate-pulse mx-auto"></Box>
              </Box>
            ))}
          </Box>

          {/* Product Title */}
          <Box className="h-8 bg-gray-200 rounded animate-pulse w-3/4 mb-4"></Box>

          {/* Description/Bid History Tabs */}
          <Box className="flex mb-4">
            <Box className="h-8 bg-gray-200 rounded animate-pulse w-24 mr-2"></Box>
            <Box className="h-8 bg-gray-200 rounded animate-pulse w-24"></Box>
          </Box>

          {/* Description */}
          <Box className="space-y-2 mb-4">
            {[...Array(5)].map((_, index) => (
              <Box
                key={index}
                className="h-4 bg-gray-200 rounded animate-pulse"
              ></Box>
            ))}
          </Box>

          {/* Product Attributes */}
          {["Material", "Style", "Quantity"].map((attr, index) => (
            <Box key={index} className="flex justify-between mb-2">
              <Box className="h-4 bg-gray-200 rounded animate-pulse w-20"></Box>
              <Box className="h-4 bg-gray-200 rounded animate-pulse w-24"></Box>
            </Box>
          ))}

          {/* Bidding Section */}
          <Box className="flex items-center justify-between mt-6">
            <Box>
              <Box className="h-6 bg-gray-200 rounded animate-pulse w-32 mb-2"></Box>
              <Box className="h-8 bg-gray-200 rounded animate-pulse w-24"></Box>
            </Box>
            <Box className="h-10 bg-gray-200 rounded animate-pulse w-24"></Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
