import type { Block } from 'payload'

export const PageNavigationBlock: Block = {
  slug: 'page-navigation',
  interfaceName: 'PageNavigationBlock',
  fields: [
    {
      name: 'pageNavigation',
      type: 'relationship',
      relationTo: 'page-navigations',
      required: true,
      admin: {
        description: 'Select a page navigation to display'
      }
    },
    {
      name: 'style',
      type: 'select',
      defaultValue: 'links',
      options: [
        { label: 'Links', value: 'links' },
        { label: 'Blocks', value: 'blocks' }
      ],
      required: true,
      admin: {
        description: 'Select a style to display the page navigation'
      }
    }
  ]
}
