import { Img, useColorModeValue } from "@chakra-ui/react"
import {
  GroupBase,
  MultiValueGenericProps,
  Props,
  chakraComponents,
} from "chakra-react-select"
import { VISIBILITY_DATA } from "components/[guild]/SetVisibility"
import useGuild from "components/[guild]/hooks/useGuild"
import StyledSelect from "components/common/StyledSelect"
import { PropsWithChildren, Ref, forwardRef } from "react"
import { useController } from "react-hook-form"

const RoleIdsSelect = forwardRef((props: Props, ref: Ref<any>) => {
  const { roles } = useGuild()

  const roleOptions = roles.map((role) => ({
    value: role.id,
    label: role.name,
    img: role.imageUrl,
    details: VISIBILITY_DATA[role.visibility].title,
  }))
  const {
    field: { onChange, value, ...roleSelectProps },
  } = useController({
    name: "roleIds",
    rules: {
      required: "Please select at least one role",
    },
  })

  return (
    <StyledSelect
      ref={ref}
      isMulti
      options={roleOptions}
      components={{
        MultiValueContainer: RoleIdsSelectMultiValuesContainer,
      }}
      {...props}
      {...roleSelectProps}
      value={value.map((roleId) => roleOptions.find((o) => o.value === roleId))}
      onChange={(newValue) => onChange(newValue.map((option) => option.value))}
    />
  )
})

const RoleIdsSelectMultiValuesContainer = ({
  children,
  ...props
}: PropsWithChildren<
  MultiValueGenericProps<unknown, boolean, GroupBase<unknown>>
>) => {
  const { roles } = useGuild()
  const publicRoleBg = useColorModeValue("gray.700", "blackAlpha.300")

  return (
    <chakraComponents.MultiValueContainer
      {...props}
      sx={{
        ...props.sx,
        backgroundColor:
          roles.find((role) => role.id === props.data.value).visibility !== "PUBLIC"
            ? undefined
            : publicRoleBg,
      }}
    >
      {props.data.img.startsWith("/guildLogos") ? (
        <Img src={props.data.img} alt={props.data.label} boxSize={3} mr={2} />
      ) : (
        <Img
          src={props.data.img}
          alt={props.data.label}
          boxSize={4}
          mr={2}
          borderRadius="full"
        />
      )}
      {children}
    </chakraComponents.MultiValueContainer>
  )
}

export default RoleIdsSelect
