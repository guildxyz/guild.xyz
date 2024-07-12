import { DrawerFooter, Icon } from "@chakra-ui/react"
import Button from "components/common/Button"
import { AnimatePresence, motion } from "framer-motion"
import { Check } from "phosphor-react"

const MotionDrawerFooter = motion(DrawerFooter)
const FOOTER_OFFSET = 76 // Footer is 76px high

const EditRoleFooter = ({
  onClose,
  onSubmit,
  isLoading,
  loadingText,
  isDirty,
}: {
  onClose: () => void
  onSubmit: (event: any) => void
  isLoading: boolean
  loadingText: string
  isDirty: boolean
}) => (
  <DrawerFooter position="absolute" bottom="0" left="0" right="0" zIndex={1}>
    {isDirty ? (
      <>
        <Button variant="outline" mr={3} onClick={onClose}>
          Cancel
        </Button>
        <Button
          isLoading={isLoading}
          colorScheme="green"
          loadingText={loadingText}
          onClick={onSubmit}
          data-test="save-role-button"
        >
          Save
        </Button>
      </>
    ) : (
      <Button colorScheme="green" onClick={onClose}>
        Done
      </Button>
    )}
  </DrawerFooter>
)

export default EditRoleFooter
