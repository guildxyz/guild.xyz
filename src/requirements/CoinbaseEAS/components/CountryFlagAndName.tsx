import { countryCodes } from "requirements/CoinbaseEAS/countryCodes"

type Props = {
  code: string
}

const CountryFlagAndName = ({ code }: Props) => {
  const src = `https://flagcdn.com/20x15/${code.toLowerCase()}.webp`
  const countryName =
    countryCodes.find((country) => country.alpha2 === code)?.name ??
    "Unknown country"

  return (
    <div className="mx-1 inline max-w-max break-words rounded-md bg-blackAlpha-soft px-1.5 py-0.5 text-sm dark:bg-blackAlpha">
      <img src={src} className="-mt-px mr-1.5 inline h-3 w-4" alt={countryName} />
      <span>{countryName}</span>
    </div>
  )
}
export default CountryFlagAndName
