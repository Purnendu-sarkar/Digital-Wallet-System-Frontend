import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Lottie from "lottie-react";
import notFoundAnimation from "@/assets/animations/not-found.json";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen text-center p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Lottie
        animationData={notFoundAnimation}
        loop={true}
        className="w-64 h-64 mb-6"
      />
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-lg text-gray-600 mb-8">
        Oops! The page you're looking for doesn't exist.
      </p>
      <div className="flex gap-4">
        <Button
          onClick={() => navigate("/")}
          className="bg-primary text-white px-6 py-2 rounded"
        >
          Go to Home
        </Button>
        <Button
          onClick={() => navigate(-1)}
          className="bg-secondary text-white px-6 py-2 rounded"
        >
          Go Back
        </Button>
      </div>
    </motion.div>
  );
};

export default NotFound;
