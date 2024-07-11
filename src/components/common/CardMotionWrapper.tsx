import { LazyMotion, domMax, m } from "framer-motion"
import { PropsWithChildren } from "react"

const EASINGS = {
  ease: [0.25, 0.1, 0.25, 1],
  easeIn: [0.4, 0, 1, 1],
  easeOut: [0, 0, 0.2, 1],
  easeInOut: [0.4, 0, 0.2, 1],
} as const

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
        transition: { delay, duration: 0.2, ease: EASINGS.easeOut },
      }}
      exit={{
        opacity: 0,
        scale: 0.95,
        transition: { duration: 0.1, ease: EASINGS.easeIn },
      }}
      transition={{ duration: 0.3, ease: EASINGS.easeInOut }}
    >
      {children}
    </m.div>
  </LazyMotion>
)

export default CardMotionWrapper
