import Secure from "@/assets/images/blog/Post-1.png";
import Payments from "@/assets/images/blog/Post-3.png";
import Features from "@/assets/images/blog/Post-2.webp";

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  image: string;
}

export const mockBlogPosts: BlogPost[] = [
  {
    id: 1,
    title: "5 Tips for Secure Digital Wallet Transactions",
    excerpt: "Learn how to keep your digital wallet safe with these essential tips.",
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
    excerpt: "Discover advanced features to get the most out of your digital wallet.",
    author: "Jane Smith",
    date: "August 20, 2025",
    image: Features,
  },
];