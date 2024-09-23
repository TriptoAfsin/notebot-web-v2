import { Text } from "@/components/atoms/typography/text";
import { Title } from "@/components/atoms/typography/title";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { APP_PATHS } from "@/config/path-config";
import { convertToISOTime, timeAgo } from "@/utils/time-utils";

import Image from "next/image";
import Link from "next/link";
import dummyImage from "../../../../public/images/dummy.png";

type Props = {
  auction: Record<string, any>;
};

export default function AuctionListCard({ auction }: Props) {
  const isExpired =
    convertToISOTime(auction?.attributes?.auctionEndDate) <
    new Date().toISOString();
  return (
    <Card className="relative md:max-h-[450px]">
      <Link
        key={auction.id}
        href={APP_PATHS.AUCTION.AUCTION_DETAIL(auction.id)}
      >
        {auction?.attributes?.auctionEndDate && isExpired && (
          <Badge
            className="text-sm absolute top-4 right-4"
            variant={"destructive"}
          >
            Expired
          </Badge>
        )}
        <Image
          src={
            auction?.attributes?.photos?.data?.length > 0
              ? auction?.attributes?.photos?.data[0]?.attributes?.url
              : dummyImage
          }
          alt={auction?.attributes?.title}
          width={320}
          height={320}
          className="rounded-sm w-full aspect-[4/3] object-cover"
        />
        <CardHeader className="flex flex-row">
          <Title>{auction?.attributes?.title}</Title>{" "}
        </CardHeader>
      </Link>
      <CardContent className="flex flex-col gap-2 items-start">
        <Text className="text-gray-600">
          Starting Bid: ${auction?.attributes?.startingBidAmount}
        </Text>
        <Text className="text-gray-600">
          Qty: {auction?.attributes?.quantity}
        </Text>
        {auction?.attributes?.auctionEndDate && !isExpired && (
          <Link
            key={auction.id}
            href={APP_PATHS.AUCTION.AUCTION_DETAIL(auction.id)}
          >
            <Button>Bid Now</Button>
          </Link>
        )}
        {!auction?.attributes?.auctionEndDate && (
          <Link
            key={auction.id}
            href={APP_PATHS.AUCTION.AUCTION_DETAIL(auction.id)}
          >
            <Button>Bid Now</Button>
          </Link>
        )}

        <Text className="ml-auto text-sm text-gray-600">
          {`${timeAgo(auction?.attributes?.createdAt)} ago`}
        </Text>
      </CardContent>
    </Card>
  );
}
