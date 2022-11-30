import DataBlock from "components/common/DataBlock"
import { RequirementComponentProps } from "requirements"
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
          : vault?.imageUrl ?? "/requirementLogos/tessera.svg"
      }
      footer={<TesseraUrl collectionSlug={requirement.data.vault} />}
      {...rest}
    >
      {(() => {
        switch (requirement.type) {
          case "TESSERA_HOLD":
            return (
              <>
                {`Hold ${
                  requirement.data.minAmount > 0
                    ? `at least ${pluralize(requirement.data.minAmount, "fraction")}`
                    : "a fraction"
                } of the `}
                <DataBlock>{vault?.name ?? requirement.data.vault}</DataBlock>
                {" NFT"}
              </>
            )
          case "TESSERA_VAULTSHARE":
            return (
              <>
                {`Hold ${
                  requirement.data.minShare > 0
                    ? `at least ${requirement.data.minShare}%`
                    : "any percentage"
                } of the fractions of the `}
                <DataBlock>{vault?.name ?? requirement.data.vault}</DataBlock>
                {" NFT"}
              </>
            )
          case "TESSERA_LISTINGS":
            return (
              <>
                {`List at least ${pluralize(requirement.data.minAmount, "NFT")}${
                  requirement.data.minVaultShare
                    ? ` with at least ${requirement.data.minVaultShare} share`
                    : ""
                } on Tessera`}
              </>
            )
          case "TESSERA_USER_SINCE":
            return `Be a Tessera user at least since ${
              requirement.data.minDate?.split("T")[0]
            }`
        }
      })()}
    </Requirement>
  )
}

export default TesseraRequirement
