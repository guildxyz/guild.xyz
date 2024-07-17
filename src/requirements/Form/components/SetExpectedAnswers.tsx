import { Box, Stack, Text, useDisclosure } from "@chakra-ui/react"
import { useGuildForm } from "components/[guild]/hooks/useGuildForms"
import AddCard from "components/common/AddCard"
import CardMotionWrapper from "components/common/CardMotionWrapper"
import { AnimatePresence } from "framer-motion"
import { useFieldArray } from "react-hook-form"
import AddExpectedAnswerModal from "./AddExpectedAnswerModal"
import { ExpectedAnswerCard } from "./ExpectedAnswerCard"
import { ExpectedFieldDataProps } from "./types"

type FieldData = {
  id: string
  fieldId: string
} & ExpectedFieldDataProps

const SetExpectedAnswers = ({ isDisabled, formId, baseFieldPath }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const { form } = useGuildForm(formId)

  const { fields, append, remove } = useFieldArray({
    name: `${baseFieldPath}.data.answers`,
  })

  const alreadyAddedFields = fields.map((f: any) => f.fieldId)

  return (
    <Box w="full" {...(isDisabled ? { opacity: 0.5, pointerEvents: "none" } : {})}>
      <Text mb="2" fontWeight={"medium"}>
        {`Set expected answers `}
        <Text as="span" colorScheme="gray">
          (optional)
        </Text>
      </Text>
      <Stack>
        <AnimatePresence>
          {fields?.map((field: FieldData, index) => (
            <CardMotionWrapper key={field.id}>
              <ExpectedAnswerCard
                field={form?.fields?.find((f) => f.id === field.fieldId)}
                {...field}
                onRemove={() => remove(index)}
              />
            </CardMotionWrapper>
          ))}
          {(!formId || fields.length < form?.fields?.length) && (
            <CardMotionWrapper>
              <AddCard title="Add field" py="4" onClick={onOpen} />
            </CardMotionWrapper>
          )}
        </AnimatePresence>
      </Stack>
      <AddExpectedAnswerModal
        {...{ isOpen, onClose, formId, alreadyAddedFields }}
        onAdd={append}
      />
    </Box>
  )
}

export default SetExpectedAnswers
