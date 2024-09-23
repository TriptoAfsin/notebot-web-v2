import { Box } from "@/components/atoms/layout";
import { Text } from "@/components/atoms/typography/text";
import CountdownTimer from "@/components/molecules/countdown-timer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { APP_PATHS } from "@/config/path-config";
import { convertToISOTime } from "@/utils/time-utils";
import Image from "next/image";
import Link from "next/link";
import dummyImage from "../../../../public/images/dummy.png";
type Props = {
  item: Record<string, any>;
};

export function DealCard({ item }: Props) {
  const isExpired =
    convertToISOTime(item?.attributes?.auctionEndDate) <
    new Date().toISOString();

  return (
    <Box
      key={item.id}
      className="relative border border-gray-200 rounded-md p-4 flex flex-row items-start overflow-hidden"
    >
      {/* ID Label */}
      {/* <Box className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-200 px-2 py-1 text-xs font-semibold text-gray-700 rounded-r-md">
        ID {item.id}
      </Box> */}

      {/* Image and Bid Button */}
      <Box className="flex flex-col items-center justify-between w-1/3 p-2">
        <Link href={APP_PATHS.AUCTION.AUCTION_DETAIL(item.id)}>
          <Image
            src={
              item?.attributes?.photos?.data?.length > 0
                ? item?.attributes?.photos?.data[0]?.attributes?.url
                : dummyImage
            }
            alt={item?.attributes?.title}
            width={150}
            height={150}
            // objectFit="contain"
            className="rounded-sm aspect-[4/3] object-cover"
          />
        </Link>
        {item?.attributes?.auctionEndDate && !isExpired && (
          <Link href={APP_PATHS.AUCTION.AUCTION_DETAIL(item.id)}>
            <Button className="mt-4  text-white rounded-md  px-4 py-2">
              Place A Bid
            </Button>
          </Link>
        )}
      </Box>

      {/* Text Content */}
      <Box className="flex flex-col justify-center w-2/3 pl-4 p-2">
        <Box className="flex">
          <Link href={APP_PATHS.AUCTION.AUCTION_DETAIL(item.id)}>
            <Text className="text-xl font-semibold text-gray-800">
              {item?.attributes?.title}
            </Text>
          </Link>
          {item?.attributes?.auctionEndDate && isExpired && (
            <Badge className="ml-auto" variant={"destructive"}>
              Expired
            </Badge>
          )}
        </Box>
        {item?.attributes?.auctionEndDate && isExpired ? (
          <Text className="text-gray-500 text-sm mb-2">
            Winning Bid $
            {item?.attributes?.winningBid?.data?.attributes?.amount}
          </Text>
        ) : (
          <Text className="text-gray-500 text-sm mb-2">
            Current Bid ${item?.attributes?.currentBidAmount}
          </Text>
        )}

        {item?.attributes?.auctionEndDate && !isExpired && (
          <CountdownTimer expiryDate={item?.attributes?.auctionEndDate} />
        )}
      </Box>
    </Box>
  );
}
