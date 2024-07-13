import {
  Box,
  Icon,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  Portal,
  Text,
} from "@chakra-ui/react"
import { CaretDown } from "@phosphor-icons/react/CaretDown"
import { Lightning } from "@phosphor-icons/react/Lightning"
import Button from "components/common/Button"

const PointsAmountTypeSelector = ({ type, setType }) => {
  const options = [
    {
      label: "Static",
      description: "Each eligible user will get the same amount",
      value: "static",
    },
    {
      label: (
        <>
          <Icon
            boxSize={3.5}
            weight="fill"
            color="green.500"
            as={Lightning}
            mr={1}
            mb="-0.5"
          />
          Dynamic
        </>
      ),
      description:
        "User points will be calculated based on a dynamic value, e.g. token balance",
      value: "dynamic",
    },
  ]

  const selected = options.find((option) => option.value === type)

  return (
    <Menu placement="bottom-end">
      <MenuButton
        as={Button}
        size="sm"
        variant="ghost"
        rightIcon={<CaretDown />}
        color="GrayText"
      >
        {selected?.label}
      </MenuButton>
      <Portal>
        <MenuList
          zIndex={"popover"}
          w="sm"
          p="0"
          overflow={"hidden"}
          borderRadius={"lg"}
        >
          <MenuOptionGroup value={type} onChange={setType}>
            {options.map((option, i) => (
              <MenuItemOption
                key={option.value}
                value={option.value}
                py="2.5"
                borderBottomWidth={i !== options.length - 1 && 1}
              >
                <Box w="full">
                  <Text fontWeight={"semibold"}>{option.label}</Text>
                  <Text colorScheme="gray">{option.description}</Text>
                </Box>
              </MenuItemOption>
            ))}
          </MenuOptionGroup>
        </MenuList>
      </Portal>
    </Menu>
  )
}

export default PointsAmountTypeSelector
