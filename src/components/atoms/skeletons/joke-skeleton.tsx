import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function JokeSkeleton() {
  return (
    <Card className="max-w-md mx-auto">
      <CardContent className="pt-6">
        <Skeleton className="w-full h-4 mb-2" />
        <Skeleton className="w-5/6 h-4 mb-4" />
        <Skeleton className="w-full h-4 mb-2" />
        <Skeleton className="w-4/5 h-4 mb-6" />
        <Button disabled className="w-full bg-gray-300">
          <Skeleton className="w-32 h-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
