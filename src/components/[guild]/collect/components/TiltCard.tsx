import { Box, BoxProps } from "@chakra-ui/react"
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion"
import { PropsWithChildren, useRef } from "react"

const ROTATION_RANGE = 15
const HALF_ROTATION_RANGE = ROTATION_RANGE / 2
const MAX_GLARE_OPACITY = 0.75

const MotionBox = motion(Box)

const TiltCard = ({
  borderRadius,
  children,
}: PropsWithChildren<Pick<BoxProps, "borderRadius">>) => {
  const ref = useRef<HTMLDivElement>(null)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const xSpring = useSpring(x)
  const ySpring = useSpring(y)

  const glareOpacity = useTransform(
    xSpring,
    [-HALF_ROTATION_RANGE, HALF_ROTATION_RANGE],
    [0, MAX_GLARE_OPACITY]
  )

  const transform = useMotionTemplate`rotateX(${xSpring}deg) rotateY(${ySpring}deg)`
  const glareTransform = useMotionTemplate`translateY(${xSpring}%) rotate(${ySpring}deg)`

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
        borderRadius={borderRadius}
        style={{
          transformStyle: "preserve-3d",
          transform,
        }}
      >
        {children}

        <Box
          position="absolute"
          inset={0}
          overflow="hidden"
          pointerEvents="none"
          mixBlendMode="overlay"
          borderRadius={borderRadius}
        >
          <MotionBox
            position="absolute"
            opacity={1}
            inset={`-${ROTATION_RANGE * 2}%`}
            bgImage={`linear-gradient(0deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, 1) 100%)`}
            pointerEvents="none"
            style={{
              transform: glareTransform,
              opacity: glareOpacity,
            }}
          />
        </Box>
      </MotionBox>
    </Box>
  )
}
export default TiltCard
