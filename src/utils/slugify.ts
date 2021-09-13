import _slugify from "slugify"

const slugify = (input: string) =>
  _slugify(input, {
    replacement: "-",
    lower: true,
    strict: true,
  })

export default slugify
