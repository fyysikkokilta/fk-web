import path from 'path'

const buildEslintCommand = (filenames) =>
  `next lint --fix --file ${filenames.map((f) => path.relative(process.cwd(), f)).join(' --file ')}`

const lintStagedConfig = {
  '**/*.ts?(x)': () => 'tsc --noEmit',
  '**/*.{js,jsx,ts,tsx}': [buildEslintCommand]
}

export default lintStagedConfig
