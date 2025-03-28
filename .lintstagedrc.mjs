import path from 'path'

const buildEslintCommand = (filenames) =>
  `next lint --fix --file ${filenames.map((f) => path.relative(process.cwd(), f)).join(' --file ')}`

export default {
  '**/*.ts?(x)': 'bash -c tsc -p tsconfig.json --noEmit',
  '**/*.{js,jsx,ts,tsx}': [buildEslintCommand]
}
