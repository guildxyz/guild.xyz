import { Box, Icon, Stack, Text, useColorMode } from "@chakra-ui/react"
import Link from "components/common/Link"
import { Plus } from "phosphor-react"
import { forwardRef } from "react"
import { Rest } from "types"

type Props = {
  text: string
  link?: string
  onClick?: () => void
} & Rest

const AddCard = forwardRef(
  ({ text, link, onClick, ...rest }: Props, ref: any): JSX.Element => {
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
        data-dd-action-name={text}
        {...rest}
      >
        <Stack direction="row" spacing={{ base: 5, sm: 8 }} alignItems="center">
          <Icon
            as={Plus}
            boxSize={8}
            color={colorMode === "light" ? "gray.300" : "gray.500"}
          />
          <Text
            as="span"
            fontWeight="bold"
            color={colorMode === "light" ? "gray.400" : "gray.500"}
            textAlign="left"
          >
            {text}
          </Text>
        </Stack>
      </Component>
    )
  }
)

export default AddCard
