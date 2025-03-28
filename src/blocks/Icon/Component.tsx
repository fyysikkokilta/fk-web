import { DynamicIcon, IconName } from 'lucide-react/dynamic'

import type { IconBlock as IconBlockType } from '@/payload-types'

interface IconBlockProps {
  block: IconBlockType
}

export const Icon = ({ block }: IconBlockProps) => {
  return <DynamicIcon className="inline-block" name={block.icon as IconName} />
}
