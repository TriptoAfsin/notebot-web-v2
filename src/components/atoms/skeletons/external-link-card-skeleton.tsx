import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ExternalLinkCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="w-2/3 h-4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="w-full h-4 mb-2" />
        <Skeleton className="w-4/5 h-4" />
      </CardContent>
    </Card>
  );
}
