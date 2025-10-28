import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  title = "Nothing here yet",
  message = "We couldn't find what you're looking for.",
  actionText = "Start Shopping",
  onAction,
  icon = "Package"
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-[400px] flex items-center justify-center"
    >
      <div className="text-center max-w-md mx-auto p-6">
        <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <ApperIcon name={icon} className="w-10 h-10 text-primary" />
        </div>
        <h3 className="text-2xl font-display text-gray-800 mb-3">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        {onAction && (
          <Button onClick={onAction} variant="primary">
            {actionText}
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default Empty;