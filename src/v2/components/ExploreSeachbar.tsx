export const GuildSeachBar = () => {
  const a = ''
  return <div className="relative flex flex-col gap-3 py-4 sm:flex-row sm:gap-0">
    <Input
      className="text-md relative h-12 grow rounded-xl border pl-12 pr-6 sm:rounded-r-none"
      placeholder="Search verified guilds"
      onChange={({ currentTarget }) => setGuildQuery(currentTarget.value)}
    />
    <div className="absolute left-4 flex h-12 items-center justify-center">
      <MagnifyingGlass className="text-muted-foreground" />
    </div>
    <ToggleGroup
      type="single"
      className="self-start sm:h-12 sm:rounded-r-lg sm:border sm:border-l-0 sm:bg-card sm:px-4"
      defaultValue="featured"
      size="sm"
      variant="outline"
    >
      <ToggleGroupItem value="featured" className="space-x-2">
        <PushPin />
        <span>featured</span>
      </ToggleGroupItem>
      <ToggleGroupItem value="newest" className="space-x-2">
        <Sparkle />
        <span>newest</span>
      </ToggleGroupItem>
    </ToggleGroup>
  </div>
}
