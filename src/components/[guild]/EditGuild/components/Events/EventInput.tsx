import {
  CloseButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Switch,
} from "@chakra-ui/react"
import { useFormContext, useWatch } from "react-hook-form"
import { EventProviderKey, EventsFormType } from "types"

type Props = {
  name: EventProviderKey
  logo: JSX.Element
}

const EventInput = ({ name, logo }: Props) => {
  const {
    control,
    register,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext<EventsFormType>()

  const link = useWatch({
    name: `eventProviders.${name}.link`,
  })

  if (link === null) return null

  if (link === "")
    return (
      <InputGroup size={"lg"}>
        <InputLeftElement>{logo}</InputLeftElement>
        <Input {...register(`eventProviders.${name}.link`)} size={"lg"} />
        <InputRightElement>
          <CloseButton
            aria-label="Remove link"
            size="sm"
            rounded="full"
            onClick={() => {
              setValue(`eventProviders.${name}.link`, null)
            }}
          />
        </InputRightElement>
      </InputGroup>
    )

  return (
    <InputGroup size={"lg"}>
      <InputLeftElement>{logo}</InputLeftElement>
      <Input {...register(`eventProviders.${name}.link`)} size={"lg"} />
      <InputRightElement>
        <Switch {...register(`eventProviders.${name}.isEnabled`)} size={"sm"} />
      </InputRightElement>
    </InputGroup>
  )
}

export default EventInput
