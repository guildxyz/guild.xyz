import {
  Box,
  Circle,
  Flex,
  HStack,
  Icon,
  SimpleGrid,
  Skeleton,
  Stack,
  Tag,
  Text,
  VStack,
} from "@chakra-ui/react"
import Visibility from "components/[guild]/Visibility"
import { Lightning } from "phosphor-react"
import React, { ComponentType, PropsWithChildren } from "react"
import { useFormContext } from "react-hook-form"
import { REQUIREMENT_PROVIDED_VALUES } from "requirements/requirements"
import { Visibility as VisibilityType } from "types"
import { useRequirementContext } from "./RequirementContext"
import { RequirementImage, RequirementImageCircle } from "./RequirementImage"
import ResetRequirementButton from "./ResetRequirementButton"
import ViewOriginalPopover from "./ViewOriginalPopover"

export type RequirementProps = PropsWithChildren<{
  isImageLoading?: boolean
  image?: string | JSX.Element
  footer?: JSX.Element
  rightElement?: JSX.Element
  imageWrapper?: ComponentType<unknown>
  childrenWrapper?: ComponentType<unknown>
  showViewOriginal?: boolean
  dynamicDisplay?: boolean
}>

const Requirement = ({
  isImageLoading,
  image,
  footer,
  rightElement,
  children,
  imageWrapper,
  childrenWrapper,
  showViewOriginal,
  dynamicDisplay,
}: RequirementProps): JSX.Element => {
  const requirement = useRequirementContext()
  const { setValue } = useFormContext() ?? {}

  const ChildrenWrapper = childrenWrapper ?? Box
  const ImageWrapper = imageWrapper ?? React.Fragment

  const ProvidedValueDisplay = REQUIREMENT_PROVIDED_VALUES[requirement?.type]

  return (
    <SimpleGrid
      spacing={4}
      w="full"
      py={2}
      templateColumns={`auto 1fr ${rightElement ? "auto" : ""}`}
      alignItems="center"
    >
      <Box mt="3px" alignSelf={"start"} position={"relative"}>
        <RequirementImageCircle isImageLoading={isImageLoading}>
          <ImageWrapper>
            <RequirementImage image={requirement?.data?.customImage || image} />
          </ImageWrapper>
        </RequirementImageCircle>

        {dynamicDisplay && (
          <Circle
            position="absolute"
            right={-1}
            bottom={0}
            bgColor={"white"}
            size={5}
            overflow="hidden"
          >
            <Icon boxSize={3} as={Lightning} weight="fill" color="green.500" />
          </Circle>
        )}
      </Box>

      {dynamicDisplay ? (
        <>
          <Flex
            alignSelf={"center"}
            flexDir={"column"}
            justifyContent={"center"}
            ml={1}
          >
            {ProvidedValueDisplay && (
              <ProvidedValueDisplay requirement={requirement} />
            )}

            <HStack gap={1} alignItems={"center"}>
              <Text fontSize={"sm"} color={"GrayText"}>
                Via:{" "}
              </Text>
              <Text
                fontWeight={"medium"}
                sx={{ fontSize: "sm", "& *": { fontSize: "inherit" } }}
              >
                {requirement?.data?.customName || children}
              </Text>
            </HStack>
          </Flex>
        </>
      ) : (
        <>
          <VStack alignItems={"flex-start"} alignSelf="center" spacing={1.5}>
            <ChildrenWrapper display="inline-block">
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
        </>
      )}
    </SimpleGrid>
  )
}

export const RequirementSkeleton = () => (
  <Requirement isImageLoading={true}>
    <Skeleton as="span">Loading requirement...</Skeleton>
  </Requirement>
)

export default Requirement
