'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBagShopping } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';

interface CartIconProps {
  count?: number;
}

export default function CartIcon({ count = 0 }: CartIconProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className="relative"
    >
      <FontAwesomeIcon icon={faBagShopping} />
      {count > 0 && (
        <motion.div
          key={count}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 bg-black text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
        >
          {count}
        </motion.div>
      )}
    </motion.div>
  );
}
