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
import { useAddRewardContext } from "components/[guild]/AddRewardContext"
import Button from "components/common/Button"
import { CaretDown, Lightning } from "phosphor-react"

const PointsAmountTypeSelector = ({ type, setType, optionsDisabled }) => {
  const { targetRoleId } = useAddRewardContext()

  const options = [
    {
      label: "Static",
      description: "Each eligible user will get the same amount",
      value: "static",
      disabled: optionsDisabled,
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
      disabled:
        optionsDisabled ||
        (!targetRoleId &&
          "You can set up Dynamic points by editing an existing role, as they depend on the role's requirements"),
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
                isDisabled={!!option.disabled}
              >
                <Tooltip
                  label={option.disabled}
                  isDisabled={!option.disabled}
                  hasArrow
                >
                  <Box w="full">
                    <Text fontWeight={"semibold"}>{option.label}</Text>
                    <Text colorScheme="gray">{option.description}</Text>
                  </Box>
                </Tooltip>
              </MenuItemOption>
            ))}
          </MenuOptionGroup>
        </MenuList>
      </Portal>
    </Menu>
  )
}

export default PointsAmountTypeSelector
