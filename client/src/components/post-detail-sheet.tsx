import type { Post, User, Comment } from "@shared/schema";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageCircle, User as UserIcon, Clock } from "lucide-react";

interface PostDetailSheetProps {
  post: Post | null;
  author?: User;
  comments: Comment[];
  isLoadingComments: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PostDetailSheet({
  post,
  author,
  comments,
  isLoadingComments,
  open,
  onOpenChange,
}: PostDetailSheetProps) {
  if (!post) return null;

  const authorInitials = author
    ? author.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "??";

  const timeAgo = ["2h ago", "5h ago", "1d ago", "3d ago", "1w ago"][
    post.id % 5
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg p-0 flex flex-col">
        <SheetHeader className="p-6 pb-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 border border-border">
                <AvatarImage
                  src={
                    author
                      ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${author.username}`
                      : undefined
                  }
                  alt={author?.name}
                />
                <AvatarFallback className="bg-primary/10 text-primary font-medium">
                  {authorInitials}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-medium">{author?.name || "Unknown"}</span>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{timeAgo}</span>
                </div>
              </div>
            </div>
            <Badge variant="outline">#{post.id}</Badge>
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1 px-6">
          <div className="flex flex-col gap-6 py-6">
            <div>
              <SheetTitle className="text-xl mb-3 capitalize">
                {post.title}
              </SheetTitle>
              <SheetDescription className="text-base text-foreground/80 leading-relaxed">
                {post.body}
              </SheetDescription>
            </div>

            <Separator />

            <div>
              <div className="flex items-center gap-2 mb-4">
                <MessageCircle className="h-5 w-5" />
                <h3 className="font-semibold">
                  Comments ({comments.length})
                </h3>
              </div>

              {isLoadingComments ? (
                <div className="flex flex-col gap-4">
                  {[1, 2, 3].map((i) => (
                    <Card key={i}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Skeleton className="h-8 w-8 rounded-full" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-1/3" />
                            <Skeleton className="h-3 w-full" />
                            <Skeleton className="h-3 w-2/3" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : comments.length === 0 ? (
                <div className="text-center py-8">
                  <MessageCircle className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                  <p className="text-sm text-muted-foreground">
                    No comments yet
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {comments.map((comment) => (
                    <Card key={comment.id} data-testid={`comment-${comment.id}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Avatar className="h-8 w-8 shrink-0">
                            <AvatarImage
                              src={`https://api.dicebear.com/7.x/initials/svg?seed=${comment.email}`}
                            />
                            <AvatarFallback className="text-xs bg-muted">
                              <UserIcon className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-baseline gap-2 mb-1">
                              <span className="font-medium text-sm capitalize line-clamp-1">
                                {comment.name}
                              </span>
                              <span className="text-xs text-muted-foreground truncate">
                                {comment.email.toLowerCase()}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {comment.body}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
