import { AnimatePresence, motion } from "framer-motion"
const CardMotionWrapper = ({ children }): JSX.Element => {
  return (
    <AnimatePresence exitBeforeEnter>
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.5 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

export default CardMotionWrapper
