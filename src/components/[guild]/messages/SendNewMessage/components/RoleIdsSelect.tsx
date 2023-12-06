import { Center, Img, useColorMode, useColorModeValue } from "@chakra-ui/react"
import {
  GroupBase,
  MultiValueGenericProps,
  Props,
  chakraComponents,
} from "chakra-react-select"
import MemberCount from "components/[guild]/RoleCard/components/MemberCount"
import useGuild from "components/[guild]/hooks/useGuild"
import StyledSelect from "components/common/StyledSelect"
import { PropsWithChildren, Ref, forwardRef } from "react"
import { useController } from "react-hook-form"

const RoleIdsSelect = forwardRef((props: Props, ref: Ref<any>) => {
  const { roles } = useGuild()

  const roleOptions = roles.map((role) => ({
    value: role.id,
    label: role.name,
    img: <RoleImage imageUrl={role.imageUrl} />,
    details: <MemberCount memberCount={role.memberCount || 0} />,
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
      chakraStyles={{
        valueContainer: (provided) => ({
          ...provided,
          px: 2.5,
          py: 1.5,
        }),
      }}
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

  const isPublic =
    roles.find((role) => role.id === props.data.value).visibility === "PUBLIC"

  return (
    <chakraComponents.MultiValueContainer
      {...props}
      sx={{
        ...props.sx,
        color: isPublic ? "white" : null,
        backgroundColor: isPublic ? publicRoleBg : undefined,
        img: isPublic && { filter: "unset" },
      }}
    >
      {props.data.img}
      {children}
    </chakraComponents.MultiValueContainer>
  )
}

const RoleImage = ({ imageUrl }) => {
  const { colorMode } = useColorMode()

  return (
    <Center boxSize={4} mr={1.5}>
      {imageUrl.startsWith("/guildLogos") ? (
        <Img
          src={imageUrl}
          boxSize={3.5}
          filter={colorMode === "light" && "brightness(0)"}
        />
      ) : (
        <Img src={imageUrl} boxSize={4} borderRadius="full" />
      )}
    </Center>
  )
}

export default RoleIdsSelect
