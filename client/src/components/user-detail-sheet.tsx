import type { User, Post } from "@shared/schema";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Mail,
  Phone,
  Globe,
  Building2,
  MapPin,
  Briefcase,
  FileText,
} from "lucide-react";

interface UserDetailSheetProps {
  user: User | null;
  posts: Post[];
  isLoadingPosts: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onViewPost: (post: Post) => void;
}

export function UserDetailSheet({
  user,
  posts,
  isLoadingPosts,
  open,
  onOpenChange,
  onViewPost,
}: UserDetailSheetProps) {
  if (!user) return null;

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg p-0 flex flex-col">
        <SheetHeader className="p-6 pb-0">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-primary/20">
              <AvatarImage
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                alt={user.name}
              />
              <AvatarFallback className="bg-primary/10 text-primary text-xl font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1">
              <SheetTitle className="text-xl">{user.name}</SheetTitle>
              <SheetDescription className="flex items-center gap-2">
                <span>@{user.username}</span>
                <Badge variant="secondary" className="text-xs">
                  ID: {user.id}
                </Badge>
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1 px-6">
          <div className="flex flex-col gap-6 py-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 text-sm">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-muted-foreground">Email</span>
                  <span className="font-medium truncate max-w-[200px]">
                    {user.email.toLowerCase()}
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between gap-2">
                  <span className="text-muted-foreground">Phone</span>
                  <span className="font-medium">{user.phone}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between gap-2">
                  <span className="text-muted-foreground">Website</span>
                  <a
                    href={`https://${user.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-primary hover:underline"
                  >
                    {user.website}
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Address
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <div className="flex flex-col gap-1">
                  <span className="font-medium">
                    {user.address.street}, {user.address.suite}
                  </span>
                  <span className="text-muted-foreground">
                    {user.address.city}, {user.address.zipcode}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Company
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 text-sm">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-muted-foreground">Name</span>
                  <span className="font-medium">{user.company.name}</span>
                </div>
                <Separator />
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground">Catchphrase</span>
                  <span className="font-medium italic">
                    "{user.company.catchPhrase}"
                  </span>
                </div>
                <Separator />
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground">Business</span>
                  <span className="font-medium">{user.company.bs}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Recent Posts ({posts.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingPosts ? (
                  <div className="flex flex-col gap-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex flex-col gap-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-full" />
                      </div>
                    ))}
                  </div>
                ) : posts.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No posts found
                  </p>
                ) : (
                  <div className="flex flex-col gap-3">
                    {posts.slice(0, 5).map((post) => (
                      <div
                        key={post.id}
                        className="flex flex-col gap-1 p-3 rounded-lg bg-muted/50 hover-elevate cursor-pointer transition-colors"
                        onClick={() => onViewPost(post)}
                        data-testid={`post-preview-${post.id}`}
                      >
                        <span className="font-medium text-sm line-clamp-1 capitalize">
                          {post.title}
                        </span>
                        <span className="text-xs text-muted-foreground line-clamp-2">
                          {post.body}
                        </span>
                      </div>
                    ))}
                    {posts.length > 5 && (
                      <p className="text-xs text-muted-foreground text-center">
                        +{posts.length - 5} more posts
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
