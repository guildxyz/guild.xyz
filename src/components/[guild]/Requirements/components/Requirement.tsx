import {
  Box,
  HStack,
  SimpleGrid,
  Skeleton,
  Stack,
  Tag,
  Text,
  VStack,
} from "@chakra-ui/react"
import Visibility from "components/[guild]/Visibility"
import React, { ComponentType, PropsWithChildren } from "react"
import { useFormContext } from "react-hook-form"
import { Requirement as Req, Visibility as VisibilityType } from "types"
import { useRequirementContext } from "./RequirementContext"
import { RequirementImage, RequirementImageCircle } from "./RequirementImage"
import { RequirementImageEditorProps } from "./RequirementImageEditor"
import { RequirementNameAndVisibilityEditorProps } from "./RequirementNameAndVisibilityEditor"
import ResetRequirementButton from "./ResetRequirementButton"
import ViewOriginalPopover from "./ViewOriginalPopover"

export type RequirementProps = PropsWithChildren<{
  fieldRoot?: string
  isImageLoading?: boolean
  image?: string | JSX.Element
  footer?: JSX.Element
  rightElement?: JSX.Element
  imageWrapper?: ComponentType<RequirementImageEditorProps>
  childrenWrapper?: ComponentType<RequirementNameAndVisibilityEditorProps>
  showViewOriginal?: boolean
}>

const Requirement = ({
  isImageLoading,
  image,
  footer,
  rightElement,
  children,
  fieldRoot,
  imageWrapper,
  childrenWrapper,
  showViewOriginal,
}: RequirementProps): JSX.Element => {
  const requirement = useRequirementContext()
  const { setValue } = useFormContext() ?? {}

  const ChildrenWrapper = childrenWrapper ?? Box
  const childrenWrapperProps = !!childrenWrapper
    ? {
        onSave: ({ visibility, visibilityRoleId, data }: Req) => {
          setValue?.(`${fieldRoot}.visibility`, visibility, {
            shouldDirty: true,
          })
          setValue?.(`${fieldRoot}.visibilityRoleId`, visibilityRoleId, {
            shouldDirty: true,
          })
          setValue?.(`${fieldRoot}.data.customName`, data?.customName, {
            shouldDirty: true,
          })
        },
      }
    : {}

  const ImageWrapper = imageWrapper ?? React.Fragment
  const imageWrapperProps =
    !!childrenWrapper && !!imageWrapper
      ? {
          onSave: (customImage) =>
            setValue?.(`${fieldRoot}.data.customImage`, customImage, {
              shouldDirty: true,
            }),
        }
      : {}

  return (
    <SimpleGrid
      spacing={4}
      w="full"
      py={2}
      templateColumns={`auto 1fr ${rightElement ? "auto" : ""}`}
      alignItems="center"
    >
      <Box mt="3px" alignSelf={"start"}>
        <RequirementImageCircle isImageLoading={isImageLoading}>
          <ImageWrapper {...imageWrapperProps}>
            <RequirementImage image={requirement?.data?.customImage || image} />
          </ImageWrapper>
        </RequirementImageCircle>
      </Box>
      <VStack alignItems={"flex-start"} alignSelf="center" spacing={1.5}>
        <ChildrenWrapper {...childrenWrapperProps} display="inline-block">
          {requirement?.isNegated && <Tag mr="2">DON'T</Tag>}
          {requirement?.type === "LINK_VISIT"
            ? children
            : requirement?.data?.customName || children}
          {!setValue ? (
            <Visibility
              visibilityRoleId={requirement?.visibilityRoleId}
              entityVisibility={requirement?.visibility ?? VisibilityType.PUBLIC}
              ml="1"
            />
          ) : null}
        </ChildrenWrapper>

        <HStack wrap={"wrap"}>
          {showViewOriginal && (
            <ViewOriginalPopover>
              <HStack p={3} gap={4}>
                <RequirementImageCircle isImageLoading={isImageLoading}>
                  <RequirementImage image={image} />
                </RequirementImageCircle>
                <Stack
                  direction={{ base: "column", md: "row" }}
                  alignItems={{ base: "flex-start", md: "center" }}
                  spacing={{ base: 2, md: 5 }}
                >
                  <Text wordBreak="break-word" flexGrow={1}>
                    {children}
                  </Text>
                  {!!setValue && <ResetRequirementButton />}
                </Stack>
              </HStack>
            </ViewOriginalPopover>
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
