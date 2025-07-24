export const getNameSlugs = (name: string) => {
  return [name, name.replace(/ /g, '_'), name.replace(/ /g, '-')]
    .map((name) => [
      name,
      name.replace(/ å/g, 'a'),
      name.replace(/ ä/g, 'a'),
      name.replace(/ ö/g, 'o')
    ])
    .flat()
}
