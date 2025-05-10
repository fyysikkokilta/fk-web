export const enableCloudStorage = () => {
  if (process.env.UPLOADTHING_TOKEN) {
    return true
  }
  return false
}
