import VerifiedIcon from "components/common/VerifiedIcon"

const GuildName = ({ name, tags }): any => (
  <>
    {name}
    {tags?.includes("VERIFIED") && (
      <VerifiedIcon
        display="inline-block"
        size={{ base: 5, lg: 6 }}
        verticalAlign={"top"}
        pt={{ base: 2, lg: 3 }}
        ml="1.5"
      />
    )}
  </>
)

export default GuildName
