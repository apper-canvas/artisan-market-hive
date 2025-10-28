import { motion } from "framer-motion";

const Loading = () => {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="text-center">
        <motion.div
          className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <p className="text-gray-600 font-medium">Loading handmade treasures...</p>
      </div>
    </div>
  );
};

export default Loading;