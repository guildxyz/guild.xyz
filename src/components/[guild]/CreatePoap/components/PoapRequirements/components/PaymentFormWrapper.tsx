import { forwardRef } from "react"
import { FormProvider, useForm } from "react-hook-form"
import PaymentForm from "requirements/Payment/PaymentForm"

const PaymentFormWrapper = forwardRef(({ onAdd }: any, ref: any) => {
  const methods = useForm({
    mode: "all",
    defaultValues: {
      type: "PAYMENT",
    },
  })

  return (
    <FormProvider {...methods}>
      <PaymentForm baseFieldPath="" addRequirement={methods.handleSubmit(onAdd)} />
    </FormProvider>
  )
})

export default PaymentFormWrapper
