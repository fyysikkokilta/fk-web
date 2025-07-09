import { BoardMember } from '@/components/BoardMember'
import type { BoardBlock as BoardBlockType } from '@/payload-types'

interface BoardProps {
  block: BoardBlockType
}

export const Board = ({ block }: BoardProps) => {
  if (typeof block.members === 'number') {
    return null
  }
  const { members } = block
  return (
    <div
      className={`grid grid-cols-1 items-baseline justify-center sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4`}
    >
      {members.map((member) => {
        if (typeof member === 'number') {
          return null
        }
        return <BoardMember key={member.id} member={member} />
      })}
    </div>
  )
}
