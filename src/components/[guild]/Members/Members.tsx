import { EASINGS, SimpleGrid, Text } from "@chakra-ui/react"
import { motion } from "framer-motion"
import Member from "./Member"

type Props = {
  members: Array<string>
  fallbackText: string
}

const MotionSimpleGrid = motion(SimpleGrid)

const Members = ({ members, fallbackText }: Props): JSX.Element => {
  const simpleGridVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: members?.length > 16 ? 2 / members.length : 0.1,
      },
    },
  }

  const memberVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
    },
    show: {
      opacity: 1,
      scale: 1,
    },
  }

  if (!members?.length) return <Text>{fallbackText}</Text>

  return (
    <MotionSimpleGrid
      columns={{ base: 3, sm: 4, md: 6, lg: 8 }}
      gap={{ base: 6, md: 8 }}
      mt={3}
      variants={simpleGridVariants}
      initial="hidden"
      animate="show"
    >
      {members?.map((address) => (
        <motion.div
          key={address}
          variants={memberVariants}
          transition={{ ease: EASINGS.easeOut }}
        >
          <Member address={address} />
        </motion.div>
      ))}
    </MotionSimpleGrid>
  )
}

export default Members
