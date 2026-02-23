export const getNameSlugs = (name: string) => {
  return [name, name.replace(/ /g, '_'), name.replace(/ /g, '-')]
    .map((namePart) => [
      name,
      namePart.replace(/ å/g, 'a'),
      namePart.replace(/ ä/g, 'a'),
      namePart.replace(/ ö/g, 'o')
    ])
    .flat()
}
