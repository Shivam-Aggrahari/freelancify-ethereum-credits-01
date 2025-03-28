
import { Gig } from "@/types/user";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";

interface GigCardProps {
  gig: Gig;
  onApply?: () => void;
}

export function GigCard({ gig, onApply }: GigCardProps) {
  const formatDate = (date: Date) => {
    return formatDistanceToNow(date, { addSuffix: true });
  };
  
  const truncateDescription = (text: string, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + "...";
  };
  
  let statusStyle = "";
  
  switch (gig.status) {
    case "open":
      statusStyle = "bg-green-100 text-green-800";
      break;
    case "assigned":
      statusStyle = "bg-blue-100 text-blue-800";
      break;
    case "completed":
      statusStyle = "bg-gray-100 text-gray-800";
      break;
  }
  
  return (
    <Card className="overflow-hidden card-hover">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start mb-1">
          <CardTitle className="text-lg">{gig.title}</CardTitle>
          <Badge className={statusStyle}>
            {gig.status.charAt(0).toUpperCase() + gig.status.slice(1)}
          </Badge>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <span className="mr-2">{formatDate(gig.createdAt)}</span>
          <span>•</span>
          <Badge variant="outline" className="ml-2">
            {gig.category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <p className="text-sm">{truncateDescription(gig.description)}</p>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4 pb-4 bg-muted/50">
        <div>
          <span className="font-medium text-web3-blue">{gig.credits} Credits</span>
        </div>
        {gig.status === "open" && onApply && (
          <Button onClick={onApply} variant="outline">Apply</Button>
        )}
      </CardFooter>
    </Card>
  );
}
