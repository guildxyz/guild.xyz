const capitalize = (text: string) => {
  // Temporary solition, because the audit log api doesn't work properly on dev infra - we should revert this change before merging the PR
  if (text?.length > 1) {
    return text.charAt(0).toUpperCase() + text.slice(1)
  }

  return text
}

export default capitalize
