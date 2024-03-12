import { Button, Spinner } from "@chakra-ui/react"
import useEditRequirement from "components/create-guild/Requirements/hooks/useEditRequirement"
import { useRequirementContext } from "./RequirementContext"

const ResetRequirementButton = () => {
  const requirement = useRequirementContext()
  const { onSubmit, isLoading } = useEditRequirement(requirement.roleId)

  return (
    <Button
      size={"sm"}
      isDisabled={isLoading}
      onClick={() =>
        onSubmit({
          ...requirement,
          data: { ...requirement.data, customName: "", customImage: "" },
        })
      }
    >
      {isLoading ? (
        <>
          <Spinner size={"xs"} mr={2}></Spinner> Saving...{" "}
        </>
      ) : (
        "Reset to original"
      )}
    </Button>
  )
}

export default ResetRequirementButton
