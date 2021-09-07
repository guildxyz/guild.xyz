import { Button, Divider, HStack, Icon, Text, VStack } from "@chakra-ui/react"
import Section from "components/admin/common/Section"
import useCommunityData from "components/admin/hooks/useCommunityData"
import usePersonalSign from "components/[community]/community/Platforms/components/JoinModal/hooks/usePersonalSign"
import { AnimatePresence, motion } from "framer-motion"
import useToast from "hooks/useToast"
import { Plus } from "phosphor-react"
import { useEffect } from "react"
import { useFieldArray } from "react-hook-form"
import AddLevel from "./components/AddLevel"

const Levels = (): JSX.Element => {
  const {
    fields: levelFields,
    append: appendLevel,
    remove: removeLevel,
    swap: swapLevels,
    update: updateLevels,
  } = useFieldArray({
    name: "levels",
    keyName: "dbId",
  })

  const { mutateCommunityData } = useCommunityData()

  const sign = usePersonalSign()
  const toast = useToast()

  useEffect(() => {
    if (levelFields.length === 0) {
      appendLevel(
        {
          name: "",
          image: undefined,
          description: "",
          requirementType: "OPEN",
          requirement: undefined,
          tokenTimeLock: undefined,
          telegramGroupId: undefined,
        },
        { shouldFocus: false }
      )
    }
  }, [])

  const onDelete = (index: number, id: number) => {
    sign("Please sign this message to verify your address")
      .then((addressSignedMessage) => {
        fetch(`${process.env.NEXT_PUBLIC_API}/community/level/${id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ addressSignedMessage }),
        })
          .then((response) => {
            if (response.status !== 200) {
              toast({
                title: "Error",
                description: "Could not remove level",
                status: "error",
                duration: 4000,
              })
              return
            }

            // Success
            toast({
              title: "Success!",
              description: "Level removed!",
              status: "success",
              duration: 2000,
            })

            // Mutate communities to display the levels correctly
            mutateCommunityData()
          })
          .catch(() => {
            toast({
              title: "Error",
              description: "Server error",
              status: "error",
              duration: 4000,
            })
          })
      })
      .catch(() => {
        toast({
          title: "Error",
          description: "You must sign the message to verify your address!",
          status: "error",
          duration: 4000,
        })
      })
  }

  const removeLevelHandler = (index: number, id: number) => {
    if (id) {
      // Delete from the database
      onDelete(index, id)
    } else {
      // Just remove from the form
      removeLevel(index)
    }
  }

  /* const isTGEnabled = useWatch({ name: "isTGEnabled" })
  useEffect(() => {
    if (typeof isTGEnabled === "boolean" && !isTGEnabled && levelFields.length > 0)
      levelFields.forEach((level, index) =>
        updateLevels(index, { ...level, telegramGroupId: null })
      )
  }, [isTGEnabled, setValue, updateLevels]) // Including levelFields would lead to an infinite loop
  */

  return (
    <Section
      title="Levels"
      description="Ordered from the most accessible to the most VIP one. Each one gives access to the lower levels too"
    >
      <>
        {levelFields.length > 0 ? (
          <VStack width="full" spacing={8}>
            {levelFields.map((levelField, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <AnimatePresence key={index}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.75, width: "100%" }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.75 }}
                >
                  <AddLevel
                    index={index}
                    onRemove={(id) => removeLevelHandler(index, id)}
                  />
                </motion.div>
              </AnimatePresence>
            ))}
          </VStack>
        ) : (
          <Text colorScheme="gray" pl={4}>
            There aren't any levels
          </Text>
        )}

        <HStack width="full" spacing={2}>
          <Divider borderBottomWidth={2} borderColor="primary.300" />
          <Button
            width={60}
            variant="ghost"
            colorScheme="primary"
            leftIcon={<Icon as={Plus} />}
            onClick={() =>
              appendLevel({
                name: "",
                image: undefined,
                description: "",
                requirementType: "OPEN",
                requirement: undefined,
                tokenTimeLock: undefined,
                telegramGroupId: undefined,
              })
            }
          >
            Add level
          </Button>
          <Divider borderBottomWidth={2} borderColor="primary.300" />
        </HStack>
      </>
    </Section>
  )
}

export default Levels
