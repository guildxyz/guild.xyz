import { EASINGS } from "@chakra-ui/react"
import { motion } from "framer-motion"
import { PropsWithChildren } from "react"

const CardMotionWrapper = ({
  children,
}: PropsWithChildren<unknown>): JSX.Element => (
  <motion.div
    layout="position"
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.1, ease: EASINGS.easeIn },
    }}
    transition={{ duration: 0.2, ease: EASINGS.easeOut }}
  >
    {children}
  </motion.div>
)

export default CardMotionWrapper
