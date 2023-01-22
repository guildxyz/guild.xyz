import DataBlock from "components/[guild]/Requirements/components/DataBlock"
import Requirement, {
  RequirementProps,
} from "components/[guild]/Requirements/components/Requirement"
import { useRequirementContext } from "components/[guild]/Requirements/components/RequirementContext"
import pluralize from "utils/pluralize"
import TesseraUrl from "./components/TesseraUrl"
import useTesseraVault from "./hooks/useTesseraVault"

const TesseraRequirement = (props: RequirementProps): JSX.Element => {
  const requirement = useRequirementContext()

  const { vault, isLoading } = useTesseraVault(requirement.data.vault)

  return (
    <Requirement
      image={
        requirement.data.vault && isLoading
          ? ""
          : vault?.imageUrl ?? "/requirementLogos/tessera.png"
      }
      footer={<TesseraUrl collectionSlug={requirement.data.vault} />}
      {...props}
    >
      {(() => {
        switch (requirement.type) {
          case "TESSERA_HOLD":
            return (
              <>
                {`Own ${
                  requirement.data.minAmount > 0
                    ? `at least ${pluralize(requirement.data.minAmount, "Rae")}`
                    : "a Rae"
                } of the `}
                <DataBlock>{vault?.name ?? requirement.data.vault}</DataBlock>
                {" NFT"}
              </>
            )
          case "TESSERA_HOLD_COLLECTION":
            return (
              <>
                {`Own ${
                  requirement.data.minAmount > 0
                    ? `at least ${pluralize(requirement.data.minAmount, "Rae")}`
                    : "a Rae"
                } of any vault that contains an NFT from `}
                <DataBlock>{requirement.data.collection}</DataBlock>
              </>
            )
          case "TESSERA_HOLD_STATE":
            return (
              <>
                {`Own at least ${pluralize(
                  requirement.data.minAmount,
                  "Rae"
                )} on Tessera `}
                {requirement.data.vaultState && (
                  <>
                    {`thats Vault ${
                      requirement.data.minAmount > 1 ? "are" : "is"
                    } in the `}
                    <DataBlock>{requirement.data.vaultState}</DataBlock>
                    {` phase`}
                  </>
                )}
              </>
            )
          case "TESSERA_LISTINGS":
            return (
              <>
                {`Have at least ${pluralize(
                  requirement.data.minAmount,
                  "Rae"
                )} listed on Tessera `}
                {requirement.data.vaultState && (
                  <>
                    {`that ${requirement.data.minAmount > 1 ? "are" : "is"} in `}
                    <DataBlock>{requirement.data.vaultState}</DataBlock>
                    {` phase`}
                  </>
                )}
              </>
            )
        }
      })()}
    </Requirement>
  )
}

export default TesseraRequirement
