function pluralize(count: number, word: string | [string, string]) {
  if (Array.isArray(word)) {
    return `${count ?? 0} ${count === 1 ? word[0] : word[1]}`
  }

  if (count !== 1) {
    if (word.endsWith("y")) {
      return `${count ?? 0} ${word.slice(0, -1)}ies`
    } else if (
      word.endsWith("s") ||
      word.endsWith("x") ||
      word.endsWith("z") ||
      word.endsWith("ch") ||
      word.endsWith("sh")
    ) {
      return `${count ?? 0} ${word}es`
    } else {
      return `${count ?? 0} ${word}s`
    }
  }
  return word
}

export default pluralize
