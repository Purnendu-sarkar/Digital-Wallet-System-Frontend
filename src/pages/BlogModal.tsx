import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type BlogPost } from "@/types";
interface BlogModalProps {
  post: BlogPost | null;
  onClose: () => void;
}

export default function BlogModal({ post, onClose }: BlogModalProps) {
  if (!post) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
    >
      <motion.div
        className="max-w-2xl w-full"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
      >
        <Card className="bg-card text-card-foreground">
          <CardHeader>
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-64 object-cover rounded-t-md"
            />
            <CardTitle className="text-2xl font-semibold mt-4">
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
          <div className="flex justify-end p-4">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}