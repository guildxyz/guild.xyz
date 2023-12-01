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
  Stack,
  Tag,
  Text,
  VStack,
} from "@chakra-ui/react"
import Visibility from "components/[guild]/Visibility"
import { CaretDown } from "phosphor-react"
import React, { PropsWithChildren } from "react"
import { Visibility as VisibilityType } from "types"
import { RequirementButton } from "./RequirementButton"
import { useRequirementContext } from "./RequirementContext"
import { RequirementImage, RequirementImageCircle } from "./RequirementImage"
import ResetRequirementButton from "./ResetRequirementButton"

export type RequirementProps = PropsWithChildren<{
  fieldRoot?: string
  isImageLoading?: boolean
  image?: string | JSX.Element
  footer?: JSX.Element
  rightElement?: JSX.Element
  imageWrapper?: React.FC<any>
  childrenWrapper?: React.FC<any>
  showViewOriginal?: boolean
}>

const Requirement = ({
  isImageLoading,
  image,
  footer,
  rightElement,
  children,
  fieldRoot,
  imageWrapper: ImageWrapper = React.Fragment,
  childrenWrapper: ChildrenWrapper = Text,
  showViewOriginal,
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
        <RequirementImageCircle isImageLoading={isImageLoading}>
          <ImageWrapper baseFieldPath={fieldRoot}>
            <RequirementImage image={requirement?.data?.customImage || image} />
          </ImageWrapper>
        </RequirementImageCircle>
      </Box>
      <VStack alignItems={"flex-start"} alignSelf="center" spacing={1.5}>
        <ChildrenWrapper baseFieldPath={fieldRoot}>
          {requirement?.isNegated && <Tag mr="2">DON'T</Tag>}
          {requirement?.data?.customName || children}
          {!fieldRoot && (
            <Visibility
              entityVisibility={requirement?.visibility ?? VisibilityType.PUBLIC}
              ml="1"
            />
          )}
        </ChildrenWrapper>

        <HStack wrap={"wrap"}>
          {showViewOriginal && (
            <Popover placement="bottom-start">
              <PopoverTrigger>
                <RequirementButton rightIcon={<Icon as={CaretDown} />}>
                  View original
                </RequirementButton>
              </PopoverTrigger>
              <Portal>
                <PopoverContent w="max-content" maxWidth={"100vw"}>
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
                      {!!fieldRoot && <ResetRequirementButton />}
                    </Stack>
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
