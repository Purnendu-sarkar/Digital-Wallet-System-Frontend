import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Secure from "@/assets/images/blog/Post-1.png";
import Payments from "@/assets/images/blog/Post-3.png";
import Features from "@/assets/images/blog/Post-2.webp";
import BlogModal from "./BlogModal";
import type { BlogPost } from "@/types";

// Mock blog post data
const mockBlogPosts: BlogPost[] = [
  {
    id: 1,
    title: "5 Tips for Secure Digital Wallet Transactions",
    excerpt:
      "Learn how to keep your digital wallet safe with these essential tips.",
    author: "John Doe",
    date: "September 5, 2025",
    image: Secure,
  },
  {
    id: 2,
    title: "The Future of Digital Payments",
    excerpt: "Explore trends shaping the future of cashless transactions.",
    author: "Alice Johnson",
    date: "July 15, 2025",
    image: Payments,
  },
  {
    id: 3,
    title: "How to Maximize Your Wallet’s Features",
    excerpt:
      "Discover advanced features to get the most out of your digital wallet.",
    author: "Jane Smith",
    date: "August 20, 2025",
    image: Features,
  },
];

// Skeleton
const BlogPostSkeleton = () => (
  <Card className="w-full">
    <CardHeader>
      <Skeleton className="h-6 w-3/4" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-40 w-full mb-4" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-2/3" />
    </CardContent>
    <CardFooter>
      <Skeleton className="h-10 w-32" />
    </CardFooter>
  </Card>
);

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null); 
  const postsPerPage = 6;

  // Simulate fetching posts
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setPosts(mockBlogPosts);
      setLoading(false);
    }, 1000);
  }, []);

  // Pagination logic
  const totalPages = Math.ceil(posts.length / postsPerPage);
  const paginatedPosts = posts.slice(
    (page - 1) * postsPerPage,
    page * postsPerPage
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            className="text-4xl md:text-5xl font-bold mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Digital Wallet Blog
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Stay updated with the latest tips, trends, and insights on digital
            payments.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Button
              asChild
              variant="secondary"
              className="text-secondary-foreground"
            >
              <a href="/contact">Get in Touch</a>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Blog Posts Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold mb-8 text-center">
            Latest Posts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {loading
                ? Array(postsPerPage)
                    .fill(0)
                    .map((_, index) => (
                      <motion.div
                        key={`skeleton-${index}`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                      >
                        <BlogPostSkeleton />
                      </motion.div>
                    ))
                : paginatedPosts.map((post) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="bg-card text-card-foreground">
                        <CardHeader>
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-40 object-cover rounded-t-md"
                          />
                          <CardTitle className="text-xl font-semibold mt-4">
                            {post.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground mb-4">
                            {post.excerpt}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            By {post.author} | {post.date}
                          </p>
                        </CardContent>
                        <CardFooter>
                          <Button
                            variant="outline"
                            onClick={() => setSelectedPost(post)}
                          >
                            Read More
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
            </AnimatePresence>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8 gap-2">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage((prev) => prev - 1)}
                aria-label="Previous page"
              >
                Previous
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Button
                  key={p}
                  variant={page === p ? "default" : "outline"}
                  onClick={() => setPage(p)}
                  aria-label={`Go to page ${p}`}
                >
                  {p}
                </Button>
              ))}
              <Button
                variant="outline"
                disabled={page === totalPages}
                onClick={() => setPage((prev) => prev + 1)}
                aria-label="Next page"
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Blog Modal */}
      <AnimatePresence>
        {selectedPost && (
          <BlogModal post={selectedPost} onClose={() => setSelectedPost(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
