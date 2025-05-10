export const enableOAuth = () => {
  return (
    typeof process.env.GOOGLE_CLIENT_ID === 'string' &&
    typeof process.env.GOOGLE_CLIENT_SECRET === 'string'
  )
}
