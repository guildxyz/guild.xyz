import { Label } from "@/components/ui/Label"
import { cn } from "@/lib/utils"
import * as LabelPrimitive from "@radix-ui/react-label"
import { Slot } from "@radix-ui/react-slot"
import {
  ComponentPropsWithoutRef,
  ElementRef,
  HTMLAttributes,
  createContext,
  forwardRef,
  useContext,
  useId,
} from "react"
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  useFormContext,
} from "react-hook-form"
import { useDebounceValue } from "usehooks-ts"
import { Collapsible, CollapsibleContent } from "./Collapsible"

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName
}

const FormFieldContext = createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
)

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => (
  <FormFieldContext.Provider value={{ name: props.name }}>
    <Controller {...props} />
  </FormFieldContext.Provider>
)

const useFormField = () => {
  const fieldContext = useContext(FormFieldContext)
  const itemContext = useContext(FormItemContext)
  const { getFieldState, formState } = useFormContext()

  const fieldState = getFieldState(fieldContext.name, formState)

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>")
  }

  const { id } = itemContext

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  }
}

type FormItemContextValue = {
  id: string
}

const FormItemContext = createContext<FormItemContextValue>(
  {} as FormItemContextValue
)

const FormItem = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const id = useId()

    return (
      <FormItemContext.Provider value={{ id }}>
        <div ref={ref} className={cn("flex flex-col", className)} {...props} />
      </FormItemContext.Provider>
    )
  }
)
FormItem.displayName = "FormItem"

const FormLabel = forwardRef<
  ElementRef<typeof LabelPrimitive.Root>,
  ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, children, ...props }, ref) => {
  const { formItemId } = useFormField()

  return (
    <Label
      ref={ref}
      className={cn(
        "group mb-2 text-md aria-disabled:text-muted-foreground ",
        className
      )}
      htmlFor={formItemId}
      {...props}
    >
      {children}
      <span className="ml-1 hidden select-none font-bold text-destructive-subtle-foreground group-aria-required:inline-block">
        *
      </span>
    </Label>
  )
})
FormLabel.displayName = "FormLabel"

const FormControl = forwardRef<
  ElementRef<typeof Slot>,
  ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={
        !error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  )
})
FormControl.displayName = "FormControl"

const FormDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField()

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn("mt-2 text-muted-foreground text-sm", className)}
      {...props}
    />
  )
})
FormDescription.displayName = "FormDescription"

const FormErrorMessage = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField()
  const body = error ? String(error?.message) : children
  const [debounceBody] = useDebounceValue(body, 200)

  return (
    <Collapsible open={!!body}>
      <CollapsibleContent>
        <p
          ref={ref}
          id={formMessageId}
          // TODO: not sure if it is a good idea to use "destructive-subtle-foreground" here? Should we add a completely new CSS variable instead?
          className={cn(
            "pt-2 font-medium text-[0.8rem] text-destructive-subtle-foreground",
            className
          )}
          {...props}
        >
          {body ?? debounceBody}
        </p>
      </CollapsibleContent>
    </Collapsible>
  )
})
FormErrorMessage.displayName = "FormErrorMessage"

export {
  FormControl,
  FormDescription,
  FormErrorMessage,
  FormField,
  FormItem,
  FormLabel,
  useFormField,
}
