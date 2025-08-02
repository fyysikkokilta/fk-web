import type { Access } from 'payload'

export const signedIn: Access = ({ req }) => !!req.user
