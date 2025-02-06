import { RequirementLink } from "components/[guild]/Requirements/components/RequirementButton"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"

export const VeraxRequirementFooter = () => {
  const { type, data } = useRequirementContext<
    "VERAX_ATTEST" | "VERAX_ATTESTED_BY"
  >()

  return (
    <>
      <RequirementLink
        href={`https://explorer.ver.ax/linea/schemas/${data.schemaId}`}
        imageUrl="/requirementLogos/eas.png"
        label="Schema"
        className="ml-1"
      />

      {type === "VERAX_ATTEST" && (
        <RequirementLink
          href={`https://explorer.ver.ax/linea/subject/${data.subject}`}
          label="Subject"
          className="mx-1"
        />
      )}
    </>
  )
}
