import { Box, HStack, Icon, Stack, Tag, Text, useColorMode } from "@chakra-ui/react"
import Link from "components/common/Link"
import { Plus } from "phosphor-react"
import { FC, forwardRef } from "react"
import { Rest } from "types"

type Props = {
  title: string
  description?: string
  rightIcon?: FC
  link?: string
  onClick?: () => void
  isDisabled?: boolean
} & Rest

const AddCard = forwardRef(
  (
    { title, description, rightIcon, link, onClick, isDisabled, ...rest }: Props,
    ref: any
  ): JSX.Element => {
    const { colorMode } = useColorMode()

    const Component = link ? Link : Box

    return (
      <Component
        ref={ref}
        as={onClick ? "button" : undefined}
        _hover={{
          textDecor: "none",
          bg: colorMode === "light" ? "blackAlpha.50" : "whiteAlpha.50",
        }}
        borderRadius="2xl"
        display="flex"
        alignItems="center"
        w="full"
        px={{ base: 5, sm: 7 }}
        py={link ? 9 : 7}
        borderWidth={2}
        borderColor={colorMode === "light" ? "gray.200" : "gray.600"}
        href={link}
        cursor="pointer"
        onClick={onClick}
        {...(isDisabled && {
          onClick: null,
          opacity: 0.5,
          _hover: null,
          cursor: "not-allowed",
        })}
        {...rest}
      >
        <HStack spacing={{ base: 5, sm: 7 }} alignItems="center" w="full">
          <Icon
            as={Plus}
            boxSize={8}
            color={colorMode === "light" ? "gray.300" : "gray.500"}
          />
          <Stack spacing="1" flex="1">
            <Text
              fontWeight="bold"
              color={
                !description && (colorMode === "light" ? "gray.400" : "gray.500")
              }
              textAlign="left"
            >
              {title}

              {isDisabled && <Tag ml="2">Temporarily disabled</Tag>}
            </Text>
            {description && (
              <Text
                color={colorMode === "light" ? "gray.400" : "gray.500"}
                textAlign="left"
              >
                {description}
              </Text>
            )}
          </Stack>
          {rightIcon && (
            <Icon
              as={rightIcon}
              boxSize={5}
              color={colorMode === "light" ? "gray.400" : "gray.500"}
            />
          )}
        </HStack>
      </Component>
    )
  }
)

export default AddCard
