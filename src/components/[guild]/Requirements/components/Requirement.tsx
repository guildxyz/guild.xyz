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
  VStack,
} from "@chakra-ui/react"
import Visibility from "components/[guild]/Visibility"
import { CaretDown } from "phosphor-react"
import { PropsWithChildren, ReactNode } from "react"
import { Visibility as VisibilityType } from "types"
import { RequirementButton } from "./RequirementButton"
import { useRequirementContext } from "./RequirementContext"
import RequirementImage from "./RequirementImage"
import ResetRequirementButton from "./ResetRequirementButton"

export type RequirementProps = PropsWithChildren<{
  fieldRoot?: string
  isImageLoading?: boolean
  image?: string | JSX.Element
  withImgBg?: boolean
  footer?: JSX.Element
  rightElement?: JSX.Element
  imageEditor?: (originalImage: string | JSX.Element) => JSX.Element
  nameEditor?: (originalName: ReactNode) => JSX.Element
  previewAvailable?: boolean
}>

const Requirement = ({
  isImageLoading,
  image,
  footer,
  withImgBg = true,
  rightElement,
  children,
  fieldRoot,
  imageEditor,
  nameEditor,
  previewAvailable,
}: RequirementProps): JSX.Element => {
  const requirement = useRequirementContext()

  return (
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
            !!imageEditor
              ? imageEditor(image)
              : requirement?.data?.customImage || image
          }
          isImageLoading={isImageLoading}
          withImgBg={withImgBg}
        />
      </Box>
      <VStack alignItems={"flex-start"} alignSelf="center" spacing={1.5}>
        {requirement?.isNegated && <Tag mr="2">DON'T</Tag>}
        {!!nameEditor ? (
          nameEditor(children)
        ) : (
          <Box display="inline-block" wordBreak="break-word">
            {requirement?.data?.customName || children}
          </Box>
        )}

        {!fieldRoot && (
          <Visibility
            entityVisibility={requirement?.visibility ?? VisibilityType.PUBLIC}
            ml="1"
          />
        )}

        <HStack wrap={"wrap"}>
          {previewAvailable && (
            <Popover placement="bottom-start">
              <PopoverTrigger>
                <RequirementButton rightIcon={<Icon as={CaretDown} />}>
                  View original
                </RequirementButton>
              </PopoverTrigger>
              <Portal>
                <PopoverContent w="max-content" maxWidth={"100vw"}>
                  <HStack p={3} gap={4}>
                    <RequirementImage
                      isImageLoading={isImageLoading}
                      withImgBg={withImgBg}
                      image={image}
                    />
                    <Text wordBreak="break-word" flexGrow={1}>
                      {children}
                    </Text>
                    {!!fieldRoot && <ResetRequirementButton />}
                  </HStack>
                </PopoverContent>
              </Portal>
            </Popover>
          )}
          {footer}
        </HStack>
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
