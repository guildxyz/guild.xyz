import { RequirementComponentProps } from "requirements"
import DataBlock from "requirements/common/DataBlock"
import Requirement from "requirements/common/Requirement"
import pluralize from "utils/pluralize"
import TesseraUrl from "./components/TesseraUrl"
import useTesseraVault from "./hooks/useTesseraVault"

const TesseraRequirement = ({
  requirement,
  ...rest
}: RequirementComponentProps): JSX.Element => {
  const { vault, isLoading } = useTesseraVault(requirement.data.vault)

  return (
    <Requirement
      image={
        requirement.data.vault && isLoading
          ? ""
          : vault?.imageUrl ?? "/requirementLogos/tessera.png"
      }
      footer={<TesseraUrl collectionSlug={requirement.data.vault} />}
      {...rest}
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
                    {`that ${requirement.data.minAmount > 1 ? "are" : "is"} in `}
                    <DataBlock>{requirement.data.vaultState}</DataBlock>
                    {` state`}
                  </>
                )}
              </>
            )
          case "TESSERA_LISTINGS":
            return (
              <>
                {`List at least ${pluralize(
                  requirement.data.minAmount,
                  "Rae"
                )} on Tessera `}
                {requirement.data.vaultState && (
                  <>
                    {`that ${requirement.data.minAmount > 1 ? "are" : "is"} in `}
                    <DataBlock>{requirement.data.vaultState}</DataBlock>
                    {` state`}
                  </>
                )}
              </>
            )
          case "TESSERA_USER_SINCE":
            const formattedDate = new Date(
              requirement.data.minDate
            ).toLocaleDateString()

            return (
              <>
                {"Be a Tessera user since at least "}
                <DataBlock>{formattedDate}</DataBlock>
              </>
            )
        }
      })()}
    </Requirement>
  )
}

export default TesseraRequirement
