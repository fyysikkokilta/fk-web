import type { Block } from 'payload'

export const CustomHTMLBlock: Block = {
  slug: 'custom-html',
  interfaceName: 'CustomHTMLBlock',
  fields: [
    {
      name: 'html',
      type: 'code',
      required: true,
      admin: {
        language: 'html',
        description: 'Enter custom HTML code. Be careful with scripts and ensure the HTML is safe.'
      },
      validate: (value: unknown) => {
        if (!value || typeof value !== 'string') {
          return 'HTML content is required'
        }

        // Basic HTML validation - check for opening and closing tags
        const trimmedValue = value.trim()
        if (trimmedValue.length === 0) {
          return 'HTML content cannot be empty'
        }

        // Check for basic HTML structure
        const hasOpeningTag = /<[^>]+>/.test(trimmedValue)
        if (!hasOpeningTag) {
          return 'Please enter valid HTML with proper tags'
        }

        // Optional: Check for potentially dangerous content
        const dangerousPatterns = [
          /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
          /javascript:/gi,
          /on\w+\s*=/gi
        ]

        for (const pattern of dangerousPatterns) {
          if (pattern.test(trimmedValue)) {
            return 'Potentially unsafe content detected. Please review your HTML.'
          }
        }

        return true
      }
    }
  ]
}
