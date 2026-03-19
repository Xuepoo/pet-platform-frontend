import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '../../lib/utils';

const Card = ({ className, children, ...props }: HTMLMotionProps<"div">) => {
  return (
    <motion.div
      className={cn(
        "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 overflow-hidden transition-colors duration-200",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        y: -5, 
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" 
      }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 20 
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export { Card };
