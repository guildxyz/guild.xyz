import { Box } from "@chakra-ui/react"
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion"
import { PropsWithChildren, useRef } from "react"

const ROTATION_RANGE = 30
const HALF_ROTATION_RANGE = 30 / 2

const MotionBox = motion(Box)

const TiltCard = ({ children }: PropsWithChildren<unknown>) => {
  const ref = useRef<HTMLDivElement>(null)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const xSpring = useSpring(x)
  const ySpring = useSpring(y)

  const transform = useMotionTemplate`rotateX(${xSpring}deg) rotateY(${ySpring}deg)`
  const glareTransform = useMotionTemplate`translateY(${xSpring}%)`

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!ref.current) return [0, 0]

    const rect = ref.current.getBoundingClientRect()

    const width = rect.width
    const height = rect.height

    const mouseX = (e.clientX - rect.left) * ROTATION_RANGE
    const mouseY = (e.clientY - rect.top) * ROTATION_RANGE

    const rX = (mouseY / height - HALF_ROTATION_RANGE) * -1
    const rY = mouseX / width - HALF_ROTATION_RANGE

    x.set(rX)
    y.set(rY)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <Box style={{ perspective: "1500px" }}>
      <MotionBox
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        position="relative"
        style={{
          transformStyle: "preserve-3d",
          transform,
        }}
      >
        {children}

        <Box position="absolute" inset={0} overflow="hidden" pointerEvents="none">
          <MotionBox
            position="absolute"
            inset={`-${ROTATION_RANGE}%`}
            bgImage={`linear-gradient(0deg, rgba(255, 255, 255, 0) 0%, ,rgba(255, 255, 255, 0.05) ${
              100 - ROTATION_RANGE
            }%, rgba(255, 255, 255, 0.15) 100%)`}
            pointerEvents="none"
            style={{
              transform: glareTransform,
            }}
          />
        </Box>
      </MotionBox>
    </Box>
  )
}
export default TiltCard
