import { Box, Flex, Text, useColorMode } from "@chakra-ui/react"
import { FixedSizeList as List } from "react-window"
const height = 32

const CustomMenuList = ({ options, children, maxHeight, getValue }): JSX.Element => {
  const [value] = getValue()
  const initialOffset = options.indexOf(value) * height
  const { colorMode } = useColorMode()

  return (
    <Box
      bgColor={colorMode === "light" ? "white" : "gray.700"}
      shadow={colorMode === "light" ? "lg" : "dark-lg"}
      rounded="lg"
      overflow="hidden"
      // Adding a custom class, so we can add a custom scrollbar to the list
      className="custom-menu-list"
    >
      {!children?.length ? (
        <Flex alignItems="center" justifyContent="center" h={12}>
          <Text colorScheme="gray">No results</Text>
        </Flex>
      ) : (
        <List
          height={
            children?.length * height < maxHeight
              ? children?.length * height
              : maxHeight
          }
          itemCount={children.length}
          itemSize={height}
          initialScrollOffset={initialOffset}
        >
          {({ index, style }) => <div style={style}>{children[index]}</div>}
        </List>
      )}
    </Box>
  )
}

export default CustomMenuList
