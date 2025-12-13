import { useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import type { User, Post } from "@shared/schema";
import { StatsCard } from "@/components/stats-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  Users,
  FileText,
  MessageCircle,
  TrendingUp,
  Clock,
  Activity,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { Link } from "wouter";

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} data-testid={`skeleton-stat-${i}`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-12 w-12 rounded-lg" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function RecentUsersSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center gap-3 p-3 rounded-lg" data-testid={`skeleton-user-${i}`}>
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-4 w-32 mb-1" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      ))}
    </div>
  );
}

function RecentPostsSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="p-3 rounded-lg" data-testid={`skeleton-post-${i}`}>
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-3 w-3/4" />
        </div>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const { data: users, isLoading: isLoadingUsers, error: usersError } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  const { data: posts, isLoading: isLoadingPosts, error: postsError } = useQuery<Post[]>({
    queryKey: ["/api/posts"],
  });

  const { data: allComments } = useQuery<{ postId: number; count: number }[]>({
    queryKey: ["/api/comments/counts"],
  });

  const totalComments = allComments?.reduce((acc, c) => acc + c.count, 0) || 0;

  const isLoading = isLoadingUsers || isLoadingPosts;
  const hasError = usersError || postsError;

  const handleRetry = () => {
    queryClient.invalidateQueries({ queryKey: ["/api/users"] });
    queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
    queryClient.invalidateQueries({ queryKey: ["/api/comments/counts"] });
  };

  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8" data-testid="container-error">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
        <p className="text-muted-foreground mb-4">Failed to load dashboard data. Please try again.</p>
        <Button onClick={handleRetry} data-testid="button-retry">
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 p-6 lg:p-8" data-testid="container-dashboard">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold" data-testid="text-page-title">
          Dashboard
        </h1>
        <p className="text-muted-foreground" data-testid="text-page-description">
          Welcome back! Here's an overview of your platform.
        </p>
      </div>

      {isLoading ? (
        <StatsSkeleton />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" data-testid="container-stats">
          <StatsCard
            title="Total Users"
            value={users?.length || 0}
            description="Active platform users"
            icon={Users}
            trend={{ value: 12, isPositive: true }}
            testId="stat-total-users"
          />
          <StatsCard
            title="Total Posts"
            value={posts?.length || 0}
            description="Published content"
            icon={FileText}
            trend={{ value: 8, isPositive: true }}
            testId="stat-total-posts"
          />
          <StatsCard
            title="Comments"
            value={totalComments}
            description="User engagement"
            icon={MessageCircle}
            trend={{ value: 23, isPositive: true }}
            testId="stat-comments"
          />
          <StatsCard
            title="Engagement Rate"
            value="94%"
            description="Active user ratio"
            icon={TrendingUp}
            trend={{ value: 5, isPositive: true }}
            testId="stat-engagement"
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" data-testid="container-recent-activity">
        <Card data-testid="card-recent-users">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4" />
                Recent Users
              </CardTitle>
              <Link
                href="/users"
                className="text-sm text-primary hover:underline"
                data-testid="link-view-all-users"
              >
                View all
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {isLoadingUsers ? (
              <RecentUsersSkeleton />
            ) : (
              <ScrollArea className="h-[320px]">
                <div className="flex flex-col gap-2">
                  {users?.slice(0, 6).map((user) => {
                    const initials = user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2);

                    const statusColors = [
                      "bg-green-500",
                      "bg-yellow-500",
                      "bg-blue-500",
                    ];
                    const statusColor = statusColors[user.id % 3];

                    return (
                      <Link
                        key={user.id}
                        href="/users"
                        className="flex items-center gap-3 p-3 rounded-lg hover-elevate transition-colors"
                        data-testid={`link-recent-user-${user.id}`}
                      >
                        <div className="relative">
                          <Avatar className="h-10 w-10 border border-border">
                            <AvatarImage
                              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                              alt={user.name}
                            />
                            <AvatarFallback className="bg-primary/10 text-primary text-sm">
                              {initials}
                            </AvatarFallback>
                          </Avatar>
                          <span
                            className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-card ${statusColor}`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate" data-testid={`text-user-name-${user.id}`}>
                            {user.name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            @{user.username}
                          </p>
                        </div>
                        <Badge variant="secondary" className="text-xs shrink-0">
                          {user.company.name.split(" ")[0]}
                        </Badge>
                      </Link>
                    );
                  })}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>

        <Card data-testid="card-recent-activity">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Recent Activity
              </CardTitle>
              <Link
                href="/posts"
                className="text-sm text-primary hover:underline"
                data-testid="link-view-all-posts"
              >
                View all
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {isLoadingPosts ? (
              <RecentPostsSkeleton />
            ) : (
              <ScrollArea className="h-[320px]">
                <div className="flex flex-col gap-2">
                  {posts?.slice(0, 8).map((post) => {
                    const author = users?.find((u) => u.id === post.userId);
                    const timeAgo = [
                      "2m ago",
                      "15m ago",
                      "1h ago",
                      "3h ago",
                      "5h ago",
                      "12h ago",
                      "1d ago",
                      "2d ago",
                    ][post.id % 8];

                    return (
                      <Link
                        key={post.id}
                        href="/posts"
                        className="flex items-start gap-3 p-3 rounded-lg hover-elevate transition-colors"
                        data-testid={`link-recent-post-${post.id}`}
                      >
                        <Avatar className="h-8 w-8 shrink-0 border border-border">
                          <AvatarImage
                            src={
                              author
                                ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${author.username}`
                                : undefined
                            }
                          />
                          <AvatarFallback className="text-xs bg-primary/10 text-primary">
                            {author?.name.charAt(0) || "?"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm line-clamp-1 capitalize" data-testid={`text-post-title-${post.id}`}>
                            {post.title}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                            <span>{author?.name || "Unknown"}</span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {timeAgo}
                            </span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
