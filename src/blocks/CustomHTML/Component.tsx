import type { CustomHTMLBlock as CustomHTMLBlockType } from '@/payload-types'

interface CustomHTMLBlockProps {
  block: CustomHTMLBlockType
}

export const CustomHTML = ({ block }: CustomHTMLBlockProps) => {
  if (!block.html) {
    return null
  }

  return <div className="custom-html-block" dangerouslySetInnerHTML={{ __html: block.html }} />
}
