import {
  Box,
  ChakraProps,
  Divider,
  Flex,
  HStack,
  Skeleton,
  SkeletonCircle,
  Stack,
  Text,
} from "@chakra-ui/react"
import { useRolePlatform } from "components/[guild]/RolePlatforms/components/RolePlatformProvider"
import SetVisibility from "components/[guild]/SetVisibility"
import ColorCard from "components/common/ColorCard"
import ColorCardLabel from "components/common/ColorCard/ColorCardLabel"
import Image from "next/image"
import { PropsWithChildren } from "react"
import { Rest } from "types"

type Props = {
  label: string | JSX.Element
  title: string
  description?: string | JSX.Element
  image: string | JSX.Element
  colorScheme: ChakraProps["color"]
  actionRow?: JSX.Element
  cornerButton?: JSX.Element
} & Rest

const RewardCard = ({
  label,
  title,
  description,
  image,
  colorScheme,
  actionRow,
  cornerButton,
  children,
  ...rest
}: PropsWithChildren<Props>) => {
  const rolePlatform = useRolePlatform()

  return (
    <ColorCard
      color={`${colorScheme}.500`}
      pt={{ base: 10, sm: 11 }}
      display="flex"
      flexDir="column"
      justifyContent="space-between"
      {...rest}
    >
      {cornerButton && (
        <Box position="absolute" top={2} right={2}>
          {cornerButton}
        </Box>
      )}
      <Flex
        justifyContent={"space-between"}
        flexDirection={{ base: "column", md: "row" }}
        mb={children && 5}
      >
        <HStack spacing={3} minHeight={10}>
          {typeof image === "string" ? (
            <>
              {image.length > 0 ? (
                <Box
                  overflow={"hidden"}
                  borderRadius="full"
                  boxSize={10}
                  flexShrink={0}
                  position="relative"
                >
                  <Image src={image} alt={title} layout="fill" />
                </Box>
              ) : (
                <SkeletonCircle size="10" />
              )}
            </>
          ) : (
            image
          )}
          <Stack spacing={0}>
            <HStack>
              <Skeleton isLoaded={!!title}>
                <Text fontWeight={"bold"}>{title || "Loading reward..."}</Text>
              </Skeleton>
              {rolePlatform && (
                <SetVisibility
                  entityType="reward"
                  fieldBase={`rolePlatforms.${rolePlatform.index}`}
                />
              )}
            </HStack>
            {description && (
              <Text as="span" color="gray" fontSize="sm" noOfLines={3}>
                {description}
              </Text>
            )}
          </Stack>
        </HStack>
        {actionRow && (
          <>
            <Divider my={3} display={{ md: "none" }} />
            {actionRow}
          </>
        )}
      </Flex>
      {children}
      <ColorCardLabel
        fallbackColor="white"
        backgroundColor={`${colorScheme}.500`}
        label={label}
        top="-2px"
        left="-2px"
        borderBottomRightRadius="xl"
        borderTopLeftRadius="2xl"
      />
    </ColorCard>
  )
}
export default RewardCard
