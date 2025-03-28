import { BoardMember } from '@/components/BoardMember'
import type { BoardMemberGridBlock as BoardMemberGridBlockType } from '@/payload-types'

interface BoardMemberGridProps {
  block: BoardMemberGridBlockType
}

export const BoardMemberGrid = ({ block }: BoardMemberGridProps) => {
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
