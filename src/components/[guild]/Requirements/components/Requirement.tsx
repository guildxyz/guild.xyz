import {
  Box,
  Circle,
  HStack,
  IconButton,
  Img,
  SimpleGrid,
  Skeleton,
  SkeletonCircle,
  Tag,
  Text,
  Tooltip,
  useColorMode,
  useDisclosure,
  VStack,
} from "@chakra-ui/react"
import SetVisibility from "components/[guild]/SetVisibility"
import Visibility from "components/[guild]/Visibility"
import { Check, PencilSimple } from "phosphor-react"
import { PropsWithChildren } from "react"
import { Visibility as VisibilityType } from "types"
import { useRequirementContext } from "./RequirementContext"
import RequirementImageEditor from "./RequirementImageEditor"
import RequirementNameEditor from "./RequirementNameEditor"

export type RequirementProps = PropsWithChildren<{
  fieldRoot?: string
  isImageLoading?: boolean
  image?: string | JSX.Element
  withImgBg?: boolean
  footer?: JSX.Element
  rightElement?: JSX.Element
}>

const Requirement = ({
  isImageLoading,
  image,
  footer,
  withImgBg = true,
  rightElement,
  children,
  fieldRoot,
}: RequirementProps): JSX.Element => {
  const { colorMode } = useColorMode()
  const requirement = useRequirementContext()
  const {
    isOpen: isEditing,
    onOpen: onEdit,
    onClose: onDone,
  } = useDisclosure({
    defaultIsOpen: false,
  })

  return (
    <SimpleGrid
      spacing={4}
      w="full"
      py={2}
      templateColumns={`auto 1fr ${rightElement ? "auto" : ""}`}
      alignItems="center"
    >
      <Box mt="3px" alignSelf={"start"}>
        <SkeletonCircle
          minW={"var(--chakra-space-11)"}
          boxSize={"var(--chakra-space-11)"}
          isLoaded={!isImageLoading}
        >
          <Circle
            size={"var(--chakra-space-11)"}
            backgroundColor={
              withImgBg &&
              (colorMode === "light" ? "blackAlpha.100" : "blackAlpha.300")
            }
            alignItems="center"
            justifyContent="center"
            overflow={withImgBg ? "hidden" : undefined}
          >
            {isEditing ? (
              <RequirementImageEditor id={requirement.id} />
            ) : requirement?.data?.customImage ? (
              <Img
                src={requirement?.data?.customImage}
                maxWidth={"var(--chakra-space-11)"}
                maxHeight={"var(--chakra-space-11)"}
              />
            ) : typeof image === "string" ? (
              image.endsWith(".mp4") ? (
                <video
                  src={image}
                  width={"var(--chakra-space-11)"}
                  height={"var(--chakra-space-11)"}
                  muted
                  autoPlay
                  loop
                />
              ) : (
                <Img
                  src={image}
                  maxWidth={"var(--chakra-space-11)"}
                  maxHeight={"var(--chakra-space-11)"}
                />
              )
            ) : (
              image
            )}
          </Circle>
        </SkeletonCircle>
      </Box>
      <VStack alignItems={"flex-start"} alignSelf="center">
        <HStack>
          <Text wordBreak="break-word">
            {requirement?.isNegated && <Tag mr="2">DON'T</Tag>}
            {isEditing ? (
              <RequirementNameEditor id={requirement.id} />
            ) : (
              requirement?.data?.customName || children
            )}
            {fieldRoot &&
              (isEditing ? (
                <Tooltip label="Done" hasArrow placement="top">
                  <IconButton
                    icon={<Check />}
                    boxSize={3.5}
                    ml={1}
                    variant="ghost"
                    color="green.500"
                    bg="unset !important"
                    aria-label="done"
                    onClick={onDone}
                  />
                </Tooltip>
              ) : (
                <Tooltip label="Edit title or image" hasArrow placement="top">
                  <IconButton
                    icon={<PencilSimple />}
                    boxSize={3.5}
                    ml={1}
                    variant="ghost"
                    color="gray"
                    bg="unset !important"
                    aria-label="edit title or image"
                    onClick={onEdit}
                  />
                </Tooltip>
              ))}
            {fieldRoot ? (
              <SetVisibility ml={2} entityType="requirement" fieldBase={fieldRoot} />
            ) : (
              <Visibility
                entityVisibility={requirement?.visibility ?? VisibilityType.PUBLIC}
                ml="1"
              />
            )}
          </Text>
        </HStack>

        {footer}
      </VStack>
      {rightElement}
    </SimpleGrid>
  )
}

export const RequirementSkeleton = () => (
  <Requirement isImageLoading={true}>
    <Skeleton as="span">Loading requirement...</Skeleton>
  </Requirement>
)

export default Requirement
