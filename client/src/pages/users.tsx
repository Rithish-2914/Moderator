import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import type { User, Post } from "@shared/schema";
import { UserCard } from "@/components/user-card";
import { UserDetailSheet } from "@/components/user-detail-sheet";
import { PostDetailSheet } from "@/components/post-detail-sheet";
import { SearchInput } from "@/components/search-input";
import { EmptyState } from "@/components/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Users as UsersIcon, Search, X, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

function UserCardSkeleton({ index }: { index: number }) {
  return (
    <Card data-testid={`skeleton-user-card-${index}`}>
      <CardContent className="p-5">
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex flex-col gap-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <Skeleton className="h-5 w-12 rounded-full" />
          </div>
          <div className="flex flex-col gap-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-3/4" />
            <Skeleton className="h-3 w-2/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-8 w-full rounded-md" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "company" | "id">("id");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [userSheetOpen, setUserSheetOpen] = useState(false);
  const [postSheetOpen, setPostSheetOpen] = useState(false);

  const { data: users, isLoading: isLoadingUsers, error: usersError } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  const { data: userPosts, isLoading: isLoadingPosts } = useQuery<Post[]>({
    queryKey: ["/api/users", selectedUser?.id, "posts"],
    enabled: !!selectedUser,
  });

  const { data: postComments, isLoading: isLoadingComments } = useQuery<
    { postId: number; id: number; name: string; email: string; body: string }[]
  >({
    queryKey: ["/api/posts", selectedPost?.id, "comments"],
    enabled: !!selectedPost,
  });

  const filteredUsers = useMemo(() => {
    if (!users) return [];

    let filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.company.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "company":
          return a.company.name.localeCompare(b.company.name);
        case "id":
        default:
          return a.id - b.id;
      }
    });

    return filtered;
  }, [users, searchQuery, sortBy]);

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setUserSheetOpen(true);
  };

  const handleViewPost = (post: Post) => {
    setSelectedPost(post);
    setPostSheetOpen(true);
  };

  const handleRetry = () => {
    queryClient.invalidateQueries({ queryKey: ["/api/users"] });
  };

  if (usersError) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8" data-testid="container-error">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-xl font-semibold mb-2">Failed to load users</h2>
        <p className="text-muted-foreground mb-4">Something went wrong while fetching users. Please try again.</p>
        <Button onClick={handleRetry} data-testid="button-retry">
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8" data-testid="container-users">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold" data-testid="text-page-title">
          Users
        </h1>
        <p className="text-muted-foreground" data-testid="text-page-description">
          Manage and view all registered users on the platform.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4" data-testid="container-filters">
        <div className="flex flex-1 flex-wrap items-center gap-3 w-full sm:w-auto">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search users by name, email, or company..."
            className="flex-1 min-w-[200px] max-w-md"
          />
          <Select
            value={sortBy}
            onValueChange={(v) => setSortBy(v as "name" | "company" | "id")}
          >
            <SelectTrigger className="w-[140px]" data-testid="select-sort">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="id" data-testid="select-item-id">ID</SelectItem>
              <SelectItem value="name" data-testid="select-item-name">Name</SelectItem>
              <SelectItem value="company" data-testid="select-item-company">Company</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Badge variant="secondary" className="shrink-0" data-testid="badge-user-count">
          {filteredUsers.length} user{filteredUsers.length !== 1 && "s"}
        </Badge>
      </div>

      {searchQuery && (
        <div className="flex items-center gap-2" data-testid="container-active-filters">
          <span className="text-sm text-muted-foreground">Filtering by:</span>
          <Badge variant="outline" className="gap-1">
            "{searchQuery}"
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 p-0 ml-1"
              onClick={() => setSearchQuery("")}
              data-testid="button-clear-filter"
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        </div>
      )}

      {isLoadingUsers ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" data-testid="container-loading">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <UserCardSkeleton key={i} index={i} />
          ))}
        </div>
      ) : filteredUsers.length === 0 ? (
        <EmptyState
          icon={searchQuery ? Search : UsersIcon}
          title={searchQuery ? "No users found" : "No users yet"}
          description={
            searchQuery
              ? `No users match "${searchQuery}". Try a different search term.`
              : "There are no users on the platform yet."
          }
          action={
            searchQuery
              ? { label: "Clear search", onClick: () => setSearchQuery("") }
              : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" data-testid="container-user-grid">
          {filteredUsers.map((user) => (
            <UserCard key={user.id} user={user} onViewDetails={handleViewUser} />
          ))}
        </div>
      )}

      <UserDetailSheet
        user={selectedUser}
        posts={userPosts || []}
        isLoadingPosts={isLoadingPosts}
        open={userSheetOpen}
        onOpenChange={setUserSheetOpen}
        onViewPost={handleViewPost}
      />

      <PostDetailSheet
        post={selectedPost}
        author={users?.find((u) => u.id === selectedPost?.userId)}
        comments={postComments || []}
        isLoadingComments={isLoadingComments}
        open={postSheetOpen}
        onOpenChange={setPostSheetOpen}
      />
    </div>
  );
}
