import {
  Box,
  Button,
  Collapse,
  HStack,
  IconButton,
  SimpleGrid,
  Skeleton,
  Tag,
  Text,
  Tooltip,
  useDisclosure,
  VStack,
} from "@chakra-ui/react"
import SetVisibility from "components/[guild]/SetVisibility"
import Visibility from "components/[guild]/Visibility"
import { CaretDown, Check, PencilSimple } from "phosphor-react"
import { PropsWithChildren } from "react"
import { Visibility as VisibilityType } from "types"
import OriginalRequirementPreview from "./OriginalRequirementPreview"
import { useRequirementContext } from "./RequirementContext"
import RequirementImage from "./RequirementImage"
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
  const requirement = useRequirementContext()
  const {
    isOpen: isEditing,
    onOpen: onEdit,
    onClose: onDone,
  } = useDisclosure({
    defaultIsOpen: false,
  })
  const { isOpen: showPreview, onToggle: togglePreview } = useDisclosure()

  const previewAvailable =
    requirement?.data?.customName || requirement?.data?.customImage
  return (
    <>
      <SimpleGrid
        spacing={4}
        w="full"
        py={2}
        templateColumns={`auto 1fr ${rightElement ? "auto" : ""}`}
        alignItems="center"
      >
        <Box mt="3px" alignSelf={"start"}>
          <RequirementImage
            image={
              isEditing ? (
                <RequirementImageEditor id={requirement.id} />
              ) : (
                requirement?.data?.customImage || image
              )
            }
            isImageLoading={isImageLoading}
            withImgBg={withImgBg}
          />
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
                <SetVisibility
                  ml={2}
                  entityType="requirement"
                  fieldBase={fieldRoot}
                />
              ) : (
                <Visibility
                  entityVisibility={requirement?.visibility ?? VisibilityType.PUBLIC}
                  ml="1"
                />
              )}
            </Text>
          </HStack>
          {previewAvailable && !isEditing && (
            <Button
              size={"xs"}
              variant={"ghost"}
              rightIcon={<CaretDown />}
              aria-label="view original"
              mt={-2}
              ml={-2}
              opacity={0.5}
              colorScheme="gray"
              onClick={togglePreview}
            >
              View original
            </Button>
          )}
          {footer}
        </VStack>
        {rightElement}
      </SimpleGrid>
      {previewAvailable && !isEditing && (
        <Collapse in={showPreview}>
          <OriginalRequirementPreview
            isImageLoading={isImageLoading}
            withImgBg={withImgBg}
            image={image}
            title={children}
            isOpen={showPreview}
            showReset={!!fieldRoot}
            id={requirement.id}
          />
        </Collapse>
      )}
    </>
  )
}

export const RequirementSkeleton = () => (
  <Requirement isImageLoading={true}>
    <Skeleton as="span">Loading requirement...</Skeleton>
  </Requirement>
)

export default Requirement
