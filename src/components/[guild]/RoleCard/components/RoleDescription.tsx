import parseDescription from "utils/parseDescription"

const MAX_INITIAL_DESCRIPTION_HEIGHT = 160

type Props = {
  description: string
}

const RoleDescription = ({ description }: Props) => {
  return <div className="break-words px-5 pb-3">{parseDescription(description)}</div>

  /**
   * TODO:
   * The description should be a grid, with grid-rows-[1fr], and if its height is bigger than MAX_INITIAL_DESCRIPTION_HEIGHT, we should just set a fixed row height, and render the collapse button, and if the user clicks on it, we should set the height to auto (grid-rows-[1fr])
   */
}

export { RoleDescription }
