import {
  Circle,
  HStack,
  Img,
  SkeletonCircle,
  Stack,
  useColorMode,
} from "@chakra-ui/react"
import { PropsWithChildren } from "react"
import { Requirement } from "types"
import RequirementText from "./RequirementText"

type Props = {
  requirement: Requirement
  loading?: boolean
  image: string | JSX.Element
  footer?: JSX.Element
}

const RequirementCard = ({
  requirement,
  loading,
  image,
  footer,
  children,
}: PropsWithChildren<Props>): JSX.Element => {
  const { colorMode } = useColorMode()

  return (
    <HStack spacing={4} w="full" py={2} alignItems={footer ? "start" : "center"}>
      <SkeletonCircle minW={10} boxSize={10} isLoaded={!loading}>
        <Circle
          size={10}
          backgroundColor={colorMode === "light" ? "gray.100" : "blackAlpha.300"}
          alignItems="center"
          justifyContent="center"
          overflow="hidden"
        >
          {typeof image === "string" ? (
            <Img src={image} alt={requirement.address} maxWidth={10} />
          ) : (
            image
          )}
        </Circle>
      </SkeletonCircle>
      <Stack w="full">
        <RequirementText>{children}</RequirementText>
        {footer}
      </Stack>
    </HStack>
  )
}

export default RequirementCard
