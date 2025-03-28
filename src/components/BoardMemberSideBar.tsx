import { BoardMember } from '@/components/BoardMember'
import type { BoardMember as BoardMemberType } from '@/payload-types'

interface BoardMemberSideBarProps {
  boardMembers: (number | BoardMemberType)[]
}

export function BoardMemberSideBar({ boardMembers }: BoardMemberSideBarProps) {
  if (boardMembers.length === 0) return null

  return (
    <aside className="order-last w-full space-y-8 lg:w-[20%]">
      <div className="grid grid-cols-1 gap-8">
        {boardMembers.map((member) => {
          if (typeof member === 'number') {
            return null
          }
          return <BoardMember key={member.id} member={member} />
        })}
      </div>
    </aside>
  )
}
