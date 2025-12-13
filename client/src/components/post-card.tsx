import type { Post, User } from "@shared/schema";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle, Eye, Clock } from "lucide-react";

interface PostCardProps {
  post: Post;
  author?: User;
  commentCount: number;
  onViewDetails: (post: Post) => void;
  onViewAuthor?: (user: User) => void;
}

export function PostCard({
  post,
  author,
  commentCount,
  onViewDetails,
  onViewAuthor,
}: PostCardProps) {
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
    <Card
      className="group hover-elevate transition-all duration-200"
      data-testid={`card-post-${post.id}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => author && onViewAuthor?.(author)}
            data-testid={`button-post-author-${post.id}`}
          >
            <Avatar className="h-10 w-10 border border-border">
              <AvatarImage
                src={
                  author
                    ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${author.username}`
                    : undefined
                }
                alt={author?.name}
              />
              <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                {authorInitials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium text-sm" data-testid={`text-post-author-name-${post.id}`}>
                {author?.name || "Unknown User"}
              </span>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{timeAgo}</span>
              </div>
            </div>
          </div>
          <Badge variant="outline" className="shrink-0 text-xs" data-testid={`badge-post-id-${post.id}`}>
            #{post.id}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <h3 className="font-semibold text-base mb-2 line-clamp-2 capitalize" data-testid={`text-post-title-${post.id}`}>
          {post.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-3" data-testid={`text-post-body-${post.id}`}>
          {post.body}
        </p>
      </CardContent>

      <CardFooter className="pt-0 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 text-muted-foreground" data-testid={`text-post-comments-${post.id}`}>
          <MessageCircle className="h-4 w-4" />
          <span className="text-xs">{commentCount} comments</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewDetails(post)}
          data-testid={`button-view-post-${post.id}`}
        >
          <Eye className="h-4 w-4 mr-1" />
          View
        </Button>
      </CardFooter>
    </Card>
  );
}
