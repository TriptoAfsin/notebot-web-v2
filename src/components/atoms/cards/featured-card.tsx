import { Box } from "@/components/atoms/layout";
import { Text } from "@/components/atoms/typography/text";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { APP_PATHS } from "@/config/path-config";
import { lengthTrimmer } from "@/utils/string-utils";
import { convertToISOTime } from "@/utils/time-utils";
import Image from "next/image";
import Link from "next/link";
import dummyImage from "../../../../public/images/dummy.png";

type Props = {
  item: Record<string, any>;
};

export default function FeaturedCard({ item }: Props) {
  const isExpired =
    convertToISOTime(item?.attributes?.auctionEndDate) <
    new Date().toISOString();

  return (
    <Box className="relative border border-gray-200/70 rounded-md p-4 flex items-center justify-center flex-col overflow-hidden min-h-[200px]">
      {/* Background Image */}

      <Image
        src={
          item?.attributes?.photos?.data?.length > 0
            ? item?.attributes?.photos?.data[0]?.attributes?.url
            : dummyImage
        }
        alt={item?.attributes?.title}
        layout="fill"
        className="absolute inset-0 w-full h-full z-0 object-cover "
      />

      {/* Overlay */}
      <Box className="absolute inset-0 bg-gray-900 bg-opacity-50 z-10 flex flex-col items-start justify-center p-4 text-center">
        <Link href={APP_PATHS.AUCTION.AUCTION_DETAIL(2)}>
          <Text className="text-white text-lg font-semibold mb-2">
            {item?.attributes?.title}
          </Text>
        </Link>
        <Text className="text-white text-sm mb-4">
          {lengthTrimmer(item?.attributes?.description, 50)}
        </Text>
        {item?.attributes?.auctionEndDate && isExpired ? (
          <Badge className="ml-auto" variant={"destructive"}>
            Expired
          </Badge>
        ) : (
          <Link href={APP_PATHS.AUCTION.AUCTION_DETAIL(2)}>
            <Button className="px-4 py-2 bg-white text-black rounded-md hover:bg-slate-100">
              Bid Now
            </Button>
          </Link>
        )}
      </Box>
    </Box>
  );
}
