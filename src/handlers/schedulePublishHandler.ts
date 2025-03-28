import type { TaskHandler } from 'payload'

const schedulePublishHandler: TaskHandler<'schedulePublish'> = async ({ input, req }) => {
  const { type, doc, global } = input

  if (doc) {
    await req.payload.update({
      collection: doc.relationTo,
      id: typeof doc.value === 'object' ? doc.value.id : doc.value,
      data: {
        _status: type === 'publish' ? 'published' : 'draft',
        hidden: type !== 'publish'
      },
      req
    })
    req.payload.logger.info(`[Job] ${type} page with id ${doc.value} completed`)
  } else if (global) {
    await req.payload.updateGlobal({
      slug: global,
      data: {
        _status: type === 'publish' ? 'published' : 'draft'
      },
      req
    })
    req.payload.logger.info(`[Job] ${type} landing page completed`)
  }

  return {
    output: {}
  }
}

export default schedulePublishHandler
