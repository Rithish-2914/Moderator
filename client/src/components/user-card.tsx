import type { User } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Globe, Building2, Eye } from "lucide-react";

interface UserCardProps {
  user: User;
  onViewDetails: (user: User) => void;
}

export function UserCard({ user, onViewDetails }: UserCardProps) {
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const statusColors = ["bg-green-500", "bg-yellow-500", "bg-blue-500"];
  const statusColor = statusColors[user.id % 3];

  return (
    <Card
      className="group hover-elevate active-elevate-2 cursor-pointer transition-all duration-200"
      data-testid={`card-user-${user.id}`}
    >
      <CardContent className="p-5">
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="h-12 w-12 border-2 border-background">
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                    alt={user.name}
                  />
                  <AvatarFallback className="bg-primary/10 text-primary font-medium">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <span
                  className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card ${statusColor}`}
                />
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="font-semibold truncate">{user.name}</span>
                <span className="text-sm text-muted-foreground truncate">
                  @{user.username}
                </span>
              </div>
            </div>
            <Badge variant="secondary" className="shrink-0 text-xs">
              ID: {user.id}
            </Badge>
          </div>

          <div className="flex flex-col gap-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{user.email.toLowerCase()}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{user.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Building2 className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{user.company.name}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Globe className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{user.website}</span>
            </div>
          </div>

          <Button
            variant="secondary"
            size="sm"
            className="w-full mt-1"
            onClick={() => onViewDetails(user)}
            data-testid={`button-view-user-${user.id}`}
          >
            <Eye className="h-4 w-4 mr-2" />
            View Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
