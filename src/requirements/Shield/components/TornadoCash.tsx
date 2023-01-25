import Switch from "components/common/Switch"
import { useController } from "react-hook-form"
import { RequirementFormProps } from "requirements"

const TornadoCash = ({ baseFieldPath }: RequirementFormProps): JSX.Element => {
  const {
    field: { value, onChange, ...rest },
  } = useController({
    name: `${baseFieldPath}.data.hops`,
    defaultValue: false,
  })

  return (
    <Switch
      title="Only check direct interactions"
      isChecked={!value}
      onChange={(e) => onChange(!e.target.checked)}
      {...rest}
    />
  )
}

export default TornadoCash
