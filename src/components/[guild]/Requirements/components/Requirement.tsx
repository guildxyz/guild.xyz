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
import SetVisibility from "components/[guild]/SetVisibility"
import Visibility from "components/[guild]/Visibility"
import { CaretDown } from "phosphor-react"
import { PropsWithChildren } from "react"
import REQUIREMENTS from "requirements"
import { Visibility as VisibilityType } from "types"
import { RequirementButton } from "./RequirementButton"
import { useRequirementContext } from "./RequirementContext"
import RequirementImage from "./RequirementImage"
import RequirementImageEditor from "./RequirementImageEditor"
import RequirementNameEditor from "./RequirementNameEditor"
import ResetRequirementButton from "./ResetRequirementButton"

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
  const previewAvailable =
    requirement?.data?.customName || requirement?.data?.customImage

  const isCustomizable = REQUIREMENTS[requirement?.type]?.isCustomizable

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
              fieldRoot && isCustomizable ? (
                <RequirementImageEditor orignalImage={image} />
              ) : (
                requirement?.data?.customImage || image
              )
            }
            isImageLoading={isImageLoading}
            withImgBg={withImgBg}
          />
        </Box>
        <VStack alignItems={"flex-start"} alignSelf="center" spacing={1.5}>
          <HStack
            flexDirection={{ base: "column", sm: "row" }}
            alignItems={{ base: "flex-start", sm: "center" }}
            spacing={0}
          >
            {requirement?.isNegated && <Tag mr="2">DON'T</Tag>}
            {fieldRoot && isCustomizable ? (
              <RequirementNameEditor baseFieldPath={fieldRoot}>
                {requirement?.data?.customName || children}
              </RequirementNameEditor>
            ) : (
              <Box display="inline-block" wordBreak="break-word">
                {requirement?.data?.customName || children}
              </Box>
            )}

            {fieldRoot ? (
              <SetVisibility ml={2} entityType="requirement" fieldBase={fieldRoot} />
            ) : (
              <Visibility
                entityVisibility={requirement?.visibility ?? VisibilityType.PUBLIC}
                ml="1"
              />
            )}
          </HStack>

          <HStack>
            {previewAvailable && (
              <Popover placement="bottom-start">
                <PopoverTrigger>
                  <RequirementButton rightIcon={<Icon as={CaretDown} />}>
                    View original
                  </RequirementButton>
                </PopoverTrigger>
                <Portal>
                  <PopoverContent minW="max-content">
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
    </>
  )
}

export const RequirementSkeleton = () => (
  <Requirement isImageLoading={true}>
    <Skeleton as="span">Loading requirement...</Skeleton>
  </Requirement>
)

export default Requirement
