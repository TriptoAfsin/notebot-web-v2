import { Card, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function RootContentSkeleton() {
  return (
    <Card className="mb-4">
      <CardHeader>
        <Skeleton className="w-2/3 h-4" />
      </CardHeader>
    </Card>
  );
}
