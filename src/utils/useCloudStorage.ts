export const useCloudStorage = () => {
  if (process.env.UPLOADTHING_TOKEN) {
    return true
  }
  return false
}
