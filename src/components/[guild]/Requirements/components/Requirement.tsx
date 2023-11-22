import {
  Box,
  HStack,
  Icon,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Portal,
  SimpleGrid,
  Skeleton,
  Tag,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react"
import SetVisibility from "components/[guild]/SetVisibility"
import Visibility from "components/[guild]/Visibility"
import { CaretDown } from "phosphor-react"
import { PropsWithChildren } from "react"
import { Visibility as VisibilityType } from "types"
import OriginalRequirementPreview from "./OriginalRequirementPreview"
import { RequirementButton } from "./RequirementButton"
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
              fieldRoot ? (
                <RequirementImageEditor />
              ) : (
                requirement?.data?.customImage || image
              )
            }
            isImageLoading={isImageLoading}
            withImgBg={withImgBg}
          />
        </Box>
        <VStack alignItems={"flex-start"} alignSelf="center" spacing={1.5}>
          <HStack>
            <Text wordBreak="break-word">
              {requirement?.isNegated && <Tag mr="2">DON'T</Tag>}
              {fieldRoot ? (
                <RequirementNameEditor>
                  {requirement?.data?.customName || children}
                </RequirementNameEditor>
              ) : (
                requirement?.data?.customName || children
              )}

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

          <HStack>
            {previewAvailable && !isEditing && (
              <Popover placement="bottom-start">
                <PopoverTrigger>
                  <RequirementButton
                    rightIcon={<Icon as={CaretDown} />}
                    onClick={togglePreview}
                  >
                    View original
                  </RequirementButton>
                </PopoverTrigger>
                <Portal>
                  <PopoverContent minW="max-content">
                    <OriginalRequirementPreview
                      isImageLoading={isImageLoading}
                      withImgBg={withImgBg}
                      image={image}
                      title={children}
                      isOpen={showPreview}
                      showReset={!!fieldRoot}
                      id={requirement.id}
                    />
                  </PopoverContent>
                </Portal>
              </Popover>
            )}
            {footer}
          </HStack>
        </VStack>
        {rightElement}
      </SimpleGrid>
    </>
  )
}

export const RequirementSkeleton = () => (
  <Requirement isImageLoading={true}>
    <Skeleton as="span">Loading requirement...</Skeleton>
  </Requirement>
)

export default Requirement
