import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import type { User, Post, Comment } from "@shared/schema";
import { PostCard } from "@/components/post-card";
import { PostDetailSheet } from "@/components/post-detail-sheet";
import { UserDetailSheet } from "@/components/user-detail-sheet";
import { SearchInput } from "@/components/search-input";
import { EmptyState } from "@/components/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Search, X, ChevronLeft, ChevronRight, AlertCircle, RefreshCw } from "lucide-react";

function PostCardSkeleton({ index }: { index: number }) {
  return (
    <Card data-testid={`skeleton-post-card-${index}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex flex-col gap-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
          <Skeleton className="h-5 w-10 rounded-full" />
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <Skeleton className="h-5 w-3/4 mb-2" />
        <Skeleton className="h-3 w-full mb-1" />
        <Skeleton className="h-3 w-full mb-1" />
        <Skeleton className="h-3 w-2/3" />
      </CardContent>
      <CardFooter className="pt-0 flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-16" />
      </CardFooter>
    </Card>
  );
}

const POSTS_PER_PAGE = 12;

export default function PostsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterByUser, setFilterByUser] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [postSheetOpen, setPostSheetOpen] = useState(false);
  const [userSheetOpen, setUserSheetOpen] = useState(false);

  const { data: posts, isLoading: isLoadingPosts, error: postsError } = useQuery<Post[]>({
    queryKey: ["/api/posts"],
  });

  const { data: users, isLoading: isLoadingUsers, error: usersError } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  const { data: commentCounts } = useQuery<{ postId: number; count: number }[]>({
    queryKey: ["/api/comments/counts"],
  });

  const { data: postComments, isLoading: isLoadingComments } = useQuery<Comment[]>({
    queryKey: ["/api/posts", selectedPost?.id, "comments"],
    enabled: !!selectedPost,
  });

  const { data: userPosts, isLoading: isLoadingUserPosts } = useQuery<Post[]>({
    queryKey: ["/api/users", selectedUser?.id, "posts"],
    enabled: !!selectedUser,
  });

  const filteredPosts = useMemo(() => {
    if (!posts) return [];

    let filtered = posts.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.body.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesUser =
        filterByUser === "all" || post.userId === parseInt(filterByUser);

      return matchesSearch && matchesUser;
    });

    return filtered;
  }, [posts, searchQuery, filterByUser]);

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  const getCommentCount = (postId: number) => {
    return commentCounts?.find((c) => c.postId === postId)?.count || 0;
  };

  const handleViewPost = (post: Post) => {
    setSelectedPost(post);
    setPostSheetOpen(true);
  };

  const handleViewAuthor = (user: User) => {
    setSelectedUser(user);
    setUserSheetOpen(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRetry = () => {
    queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
    queryClient.invalidateQueries({ queryKey: ["/api/users"] });
    queryClient.invalidateQueries({ queryKey: ["/api/comments/counts"] });
  };

  const isLoading = isLoadingPosts || isLoadingUsers;
  const hasError = postsError || usersError;

  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8" data-testid="container-error">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-xl font-semibold mb-2">Failed to load posts</h2>
        <p className="text-muted-foreground mb-4">Something went wrong while fetching posts. Please try again.</p>
        <Button onClick={handleRetry} data-testid="button-retry">
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8" data-testid="container-posts">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold" data-testid="text-page-title">
          Posts
        </h1>
        <p className="text-muted-foreground" data-testid="text-page-description">
          Browse and moderate all user-generated content.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4" data-testid="container-filters">
        <div className="flex flex-1 flex-wrap items-center gap-3 w-full sm:w-auto">
          <SearchInput
            value={searchQuery}
            onChange={(v) => {
              setSearchQuery(v);
              setCurrentPage(1);
            }}
            placeholder="Search posts by title or content..."
            className="flex-1 min-w-[200px] max-w-md"
          />
          <Select
            value={filterByUser}
            onValueChange={(v) => {
              setFilterByUser(v);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[180px]" data-testid="select-user-filter">
              <SelectValue placeholder="Filter by author" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" data-testid="select-item-all-authors">All Authors</SelectItem>
              {users?.map((user) => (
                <SelectItem key={user.id} value={user.id.toString()} data-testid={`select-item-author-${user.id}`}>
                  {user.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Badge variant="secondary" className="shrink-0" data-testid="badge-post-count">
          {filteredPosts.length} post{filteredPosts.length !== 1 && "s"}
        </Badge>
      </div>

      {(searchQuery || filterByUser !== "all") && (
        <div className="flex flex-wrap items-center gap-2" data-testid="container-active-filters">
          <span className="text-sm text-muted-foreground">Filters:</span>
          {searchQuery && (
            <Badge variant="outline" className="gap-1">
              "{searchQuery}"
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 ml-1"
                onClick={() => setSearchQuery("")}
                data-testid="button-clear-search-filter"
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {filterByUser !== "all" && (
            <Badge variant="outline" className="gap-1">
              Author: {users?.find((u) => u.id === parseInt(filterByUser))?.name}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 ml-1"
                onClick={() => setFilterByUser("all")}
                data-testid="button-clear-author-filter"
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" data-testid="container-loading">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <PostCardSkeleton key={i} index={i} />
          ))}
        </div>
      ) : paginatedPosts.length === 0 ? (
        <EmptyState
          icon={searchQuery || filterByUser !== "all" ? Search : FileText}
          title={
            searchQuery || filterByUser !== "all"
              ? "No posts found"
              : "No posts yet"
          }
          description={
            searchQuery || filterByUser !== "all"
              ? "No posts match your current filters. Try adjusting your search."
              : "There are no posts on the platform yet."
          }
          action={
            searchQuery || filterByUser !== "all"
              ? {
                  label: "Clear filters",
                  onClick: () => {
                    setSearchQuery("");
                    setFilterByUser("all");
                  },
                }
              : undefined
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" data-testid="container-post-grid">
            {paginatedPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                author={users?.find((u) => u.id === post.userId)}
                commentCount={getCommentCount(post.id)}
                onViewDetails={handleViewPost}
                onViewAuthor={handleViewAuthor}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4" data-testid="container-pagination">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                data-testid="button-prev-page"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(
                    (page) =>
                      page === 1 ||
                      page === totalPages ||
                      Math.abs(page - currentPage) <= 1
                  )
                  .map((page, index, array) => {
                    if (index > 0 && page - array[index - 1] > 1) {
                      return [
                        <span
                          key={`ellipsis-${page}`}
                          className="px-2 text-muted-foreground"
                        >
                          ...
                        </span>,
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          className="min-w-[36px]"
                          onClick={() => handlePageChange(page)}
                          data-testid={`button-page-${page}`}
                        >
                          {page}
                        </Button>,
                      ];
                    }
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        className="min-w-[36px]"
                        onClick={() => handlePageChange(page)}
                        data-testid={`button-page-${page}`}
                      >
                        {page}
                      </Button>
                    );
                  })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                data-testid="button-next-page"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </>
      )}

      <PostDetailSheet
        post={selectedPost}
        author={users?.find((u) => u.id === selectedPost?.userId)}
        comments={postComments || []}
        isLoadingComments={isLoadingComments}
        open={postSheetOpen}
        onOpenChange={setPostSheetOpen}
      />

      <UserDetailSheet
        user={selectedUser}
        posts={userPosts || []}
        isLoadingPosts={isLoadingUserPosts}
        open={userSheetOpen}
        onOpenChange={setUserSheetOpen}
        onViewPost={(post) => {
          setUserSheetOpen(false);
          setTimeout(() => {
            setSelectedPost(post);
            setPostSheetOpen(true);
          }, 150);
        }}
      />
    </div>
  );
}
