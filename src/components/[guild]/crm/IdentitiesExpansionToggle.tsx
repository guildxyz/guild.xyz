import { IconButton } from "@chakra-ui/Pireact"
import { ArrowsInLineHorizontal, ArrowsOutLineHorizontal } from "Pireact-icons/pi"
import useLocalStorage from "hooks/useLocalStorage"

export const IDENTITIES_COLLAPSED_STYLE = `.identityTd .identityTag:not(:first-child) {margin-left: var(--stacked-margin-left)}`

const IdentitiesExpansionToggle = () => {
  const [isIdentitiesOpen, setIsIdentitiesOpen] = useLocalStorage(
    "isIdentitiesOpen",
    true
  )

  return (
    <>
      {!isIdentitiesOpen && <style>{IDENTITIES_COLLAPSED_STYLE}</style>}
      <IconButton
        variant="ghost"
        className="identitiesToggle"
        icon={
          isIdentitiesOpen ? <ArrowsInLineHorizontal /> : <ArrowsOutLineHorizontal />
        }
        onClick={() => setIsIdentitiesOpen((prev) => !prev)}
        aria-label="Toggle identities expansion"
        size="sm"
        right="-2"
      />
    </>
  )
}

export default IdentitiesExpansionToggle
