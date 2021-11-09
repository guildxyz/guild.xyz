import { EASINGS } from "@chakra-ui/react"
import { motion } from "framer-motion"
import { PropsWithChildren } from "react"

type Props = {
  animateOnMount?: boolean
}

const CardMotionWrapper = ({
  animateOnMount = true,
  children,
}: PropsWithChildren<Props>): JSX.Element => (
  <motion.div
    layout="position"
    {...(animateOnMount && {
      initial: { opacity: 0, scale: 0.95 },
    })}
    animate={{
      opacity: 1,
      scale: 1,
      transition: { duration: 0.2, ease: EASINGS.easeOut },
    }}
    exit={{
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.1, ease: EASINGS.easeIn },
    }}
    transition={{ duration: 0.3, ease: EASINGS.easeInOut }}
  >
    {children}
  </motion.div>
)

export default CardMotionWrapper
