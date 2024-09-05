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
  Tooltip,
} from "@chakra-ui/react"
import { CaretDown, Lightning } from "@phosphor-icons/react"
import Button from "components/common/Button"
import { useWatch } from "react-hook-form"
import { PointsType } from "../types"

const PointsAmountTypeSelector = ({
  type,
  setType,
}: { type: PointsType; setType: (newType: PointsType) => void }) => {
  const rolePlatformId = useWatch({ name: "id" })
  const isEditing = typeof rolePlatformId === "number"

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
      <Tooltip
        isDisabled={!isEditing}
        label="You can't change the point type for existing rewards. Please add another point reward instead!"
        placement="top"
        hasArrow
      >
        <MenuButton
          as={Button}
          size="sm"
          variant="ghost"
          rightIcon={<CaretDown />}
          color="GrayText"
          isDisabled={isEditing}
        >
          {selected?.label}
        </MenuButton>
      </Tooltip>
      <Portal>
        <MenuList
          zIndex={"popover"}
          w="sm"
          p="0"
          overflow={"hidden"}
          borderRadius={"lg"}
        >
          <MenuOptionGroup
            value={type}
            onChange={(newValue) => setType(newValue as PointsType)}
          >
            {options.map((option, i) => (
              <MenuItemOption
                key={option.value}
                value={option.value}
                py="2.5"
                borderBottomWidth={i !== options.length - 1 ? 1 : undefined}
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
