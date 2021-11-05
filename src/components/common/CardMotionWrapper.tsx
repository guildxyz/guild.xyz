import { AnimatePresence, motion } from "framer-motion"
import { PropsWithChildren } from "react"
const CardMotionWrapper = ({
  children,
}: PropsWithChildren<unknown>): JSX.Element => (
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

export default CardMotionWrapper
