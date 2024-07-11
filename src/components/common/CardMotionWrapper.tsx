// import { EASINGS } from "@chakra-ui/react"
import { LazyMotion, domMax, m } from "framer-motion"
import { PropsWithChildren } from "react"

type Props = {
  animateOnMount?: boolean
  delay?: number
}

const CardMotionWrapper = ({
  animateOnMount = true,
  delay = 0,
  children,
}: PropsWithChildren<Props>): JSX.Element => (
  <LazyMotion features={domMax}>
    <m.div
      layout="position"
      {...(animateOnMount && {
        initial: { opacity: 0, scale: 0.95 },
      })}
      animate={{
        opacity: 1,
        scale: 1,
        // transition: { delay, duration: 0.2, ease: EASINGS.easeOut },
      }}
      exit={{
        opacity: 0,
        scale: 0.95,
        // transition: { duration: 0.1, ease: EASINGS.easeIn },
      }}
      // transition={{ duration: 0.3, ease: EASINGS.easeInOut }}
      // TODO: solve this if it is relevant
      // sx={{ "> *": { height: "full" } }}
    >
      {children}
    </m.div>
  </LazyMotion>
)

export default CardMotionWrapper
