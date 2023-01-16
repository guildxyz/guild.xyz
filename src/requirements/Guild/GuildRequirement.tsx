import { Img, Link } from "@chakra-ui/react"
import useGuild from "components/[guild]/hooks/useGuild"
import { RequirementComponentProps } from "requirements"
import DataBlock from "requirements/common/DataBlock"
import pluralize from "utils/pluralize"
import Requirement from "../common/Requirement"

const HaveRole = ({
  requirement,
  ...rest
}: RequirementComponentProps): JSX.Element => {
  const { name, roles, urlName, isLoading } = useGuild(requirement.data.guildId)
  const role = roles?.find((r) => r.id === requirement.data.roleId)

  return (
    <Requirement
      isNegated={requirement.isNegated}
      image={
        role?.imageUrl &&
        (role.imageUrl?.match("guildLogos") ? (
          <Img src={role.imageUrl} alt="Guild logo" boxSize="40%" />
        ) : (
          role.imageUrl
        ))
      }
      isImageLoading={isLoading}
      {...rest}
    >
      {"Have the "}
      <DataBlock isLoading={isLoading}>{role?.name ?? "unknown"}</DataBlock>
      {" role in the "}
      <Link
        href={`https://guild.xyz/${urlName ?? requirement.data.guildId}`}
        isExternal={true}
        colorScheme="blue"
      >
        {name ?? `#${requirement.data.guildId}`}
      </Link>
      {" guild"}
    </Requirement>
  )
}

const UserSince = ({
  requirement,
  ...rest
}: RequirementComponentProps): JSX.Element => {
  const formattedDate = new Date(requirement.data.creationDate).toLocaleDateString()
  return (
    <Requirement
      isNegated={requirement.isNegated}
      image="/requirementLogos/guild.png"
      {...rest}
    >
      {"Be a Guild.xyz user at least since "}
      <DataBlock>{formattedDate}</DataBlock>
    </Requirement>
  )
}

const MinGuilds = ({
  requirement,
  ...rest
}: RequirementComponentProps): JSX.Element => (
  <Requirement
    isNegated={requirement.isNegated}
    image="/requirementLogos/guild.png"
    {...rest}
  >
    {`Be a member of at least ${pluralize(requirement.data.minAmount, "guild")}`}
  </Requirement>
)

const Admin = ({ requirement, ...rest }: RequirementComponentProps): JSX.Element => (
  <Requirement
    isNegated={requirement.isNegated}
    image="/requirementLogos/guild.png"
    {...rest}
  >
    {`Be an admin of a guild${
      requirement.data.minAmount > 0
        ? ` with at least ${pluralize(requirement.data.minAmount, "member")}`
        : ""
    }`}
  </Requirement>
)

const types = {
  GUILD_ROLE: HaveRole,
  GUILD_ADMIN: Admin,
  GUILD_MINGUILDS: MinGuilds,
  GUILD_USER_SINCE: UserSince,
}

const GuildRequirement = (props: RequirementComponentProps) => {
  const Component = types[props.requirement.type]
  return <Component {...props} />
}

export default GuildRequirement
