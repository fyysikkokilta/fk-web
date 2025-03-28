import { draftMode } from 'next/headers'

export const isDraftMode = async () => {
  const draft = await draftMode()
  return draft.isEnabled
}
