import type { TextStateFeature } from '@payloadcms/richtext-lexical'

type TextStateFeatureProps = NonNullable<Parameters<typeof TextStateFeature>[0]>
type StateValues = NonNullable<TextStateFeatureProps['state']>[keyof TextStateFeatureProps['state']]

export const textState: TextStateFeatureProps['state'] = {
  color: {
    fkWhite: { label: 'White', css: { background: '#ffffff', color: '#000000' } },
    fkBlack: { label: 'Black', css: { background: '#000000', color: '#ffffff' } },
    fkGray: { label: 'Gray', css: { background: '#201e1e', color: '#ffffff' } },
    fkYellow: { label: 'Yellow', css: { background: '#fbdb1d', color: '#000000' } },
    fkOrange: { label: 'Orange', css: { background: '#ff8a04', color: '#ffffff' } },
    fkBlue: { label: 'Blue', css: { background: '#007bff', color: '#ffffff' } },
    fkGreen: { label: 'Green', css: { background: '#28a745', color: '#ffffff' } },
    fkRed: { label: 'Red', css: { background: '#911f2f', color: '#ffffff' } },
    fkPurple: { label: 'Purple', css: { background: '#6f42c1', color: '#ffffff' } }
  }
}

type ExtractAllColorKeys<T> = {
  [P in keyof T]: T[P] extends StateValues ? keyof T[P] : never
}[keyof T]

export type ColorStateKeys = ExtractAllColorKeys<typeof textState>
