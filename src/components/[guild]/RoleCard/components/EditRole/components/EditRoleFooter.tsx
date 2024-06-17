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
  isVisible,
}: {
  onClose: () => void
  onSubmit: (event: any) => void
  isLoading: boolean
  loadingText: string
  isVisible: boolean
}) => (
  <AnimatePresence>
    {isVisible && (
      <MotionDrawerFooter
        initial={{ y: FOOTER_OFFSET, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: FOOTER_OFFSET, opacity: 0 }}
        transition={{ duration: 0.3 }}
        position="absolute"
        w="full"
        zIndex={1}
        bottom="0"
      >
        <Button variant="outline" mr={3} onClick={onClose}>
          Cancel
        </Button>
        <Button
          isLoading={isLoading}
          colorScheme="green"
          loadingText={loadingText}
          onClick={onSubmit}
          leftIcon={<Icon as={Check} />}
          data-test="save-role-button"
        >
          Save
        </Button>
      </MotionDrawerFooter>
    )}
  </AnimatePresence>
)

export default EditRoleFooter
