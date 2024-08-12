import { Icon } from "@chakra-ui/react"
import { Palette } from "@phosphor-icons/react"
import Color from "color"
import useDebouncedState from "hooks/useDebouncedState"
import { useEffect, useState } from "react"
import { useWatch } from "react-hook-form"
import { FormControl, FormErrorMessage, FormField, FormItem } from "./Form"
import { Input } from "./Input"

type Props = {
  fieldName: string
  onChange?: (color: string) => void
}

export const ColorPicker = ({ fieldName, onChange }: Props) => {
  const [isIconLight, setIsIconLight] = useState(false)

  const pickedColor = useWatch({ name: fieldName })
  const debouncedPickedColor = useDebouncedState(pickedColor, 300)

  useEffect(() => {
    if (!CSS.supports("color", debouncedPickedColor)) return
    onChange?.(debouncedPickedColor)
    const color = Color(debouncedPickedColor)
    setIsIconLight(color.isDark())
  }, [debouncedPickedColor, onChange])

  return (
    <FormField
      name={fieldName}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <div className="flex gap-1.5">
              <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border">
                <input
                  className="size-16 shrink-0 cursor-pointer"
                  type="color"
                  {...field}
                />
                <Icon
                  as={Palette}
                  pos="absolute"
                  pointerEvents={"none"}
                  color={isIconLight ? "whiteAlpha.800" : "blackAlpha.800"}
                />
              </div>
              <Input
                className="h-10 max-w-40"
                placeholder="Pick a color"
                {...field}
              />
            </div>
          </FormControl>
          <FormErrorMessage />
        </FormItem>
      )}
    />
  )
}
