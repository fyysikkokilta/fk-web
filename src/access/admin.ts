import type { Access } from 'payload'

export const admin: Access = ({ req }) => !!req.user && req.user.role === 'admin'
