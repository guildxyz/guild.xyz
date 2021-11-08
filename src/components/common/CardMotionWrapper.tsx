import { motion } from "framer-motion"
import { PropsWithChildren } from "react"

const CardMotionWrapper = ({
  children,
}: PropsWithChildren<unknown>): JSX.Element => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0 }}
    transition={{ duration: 0.2 }}
  >
    {children}
  </motion.div>
)

export default CardMotionWrapper
