import { Center, Text, useColorMode } from "@chakra-ui/react"
import Card from "components/common/Card"
import { FixedSizeList as List } from "react-window"
const height = 40

const CustomMenuList = ({
  options,
  children,
  maxHeight,
  getValue,
  ...rest
}): JSX.Element => {
  const [value] = getValue()
  const initialOffset = options.indexOf(value) * height
  const { colorMode } = useColorMode()

  // Doing it this way, because `chakra-react-select` MenuList prop types doesn't include the `isLoading` prop
  const { isLoading } = rest

  return (
    <Card
      shadow={colorMode === "light" ? "lg" : "dark-lg"}
      borderRadius="md"
      border={"1px"}
      borderColor={colorMode === "light" ? "gray.200" : "gray.500"}
      // Adding a custom class, so we can add a custom scrollbar to the list
      className="custom-menu-list"
    >
      {!children?.length ? (
        <Center h={12}>
          <Text colorScheme="gray">{isLoading ? "Loading..." : "No results"}</Text>
        </Center>
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
    </Card>
  )
}

export default CustomMenuList
