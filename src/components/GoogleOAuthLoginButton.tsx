// eslint-disable-next-line no-restricted-imports
import Link from 'next/link'

export const GoogleOAuthLoginButton = () => (
  <Link
    href="/api/users/oauth/google"
    className="btn btn--icon-style-without-border btn--size-large btn--withoutPopup btn--style-primary btn--withoutPopup"
    style={{ width: '100%', textAlign: 'center' }}
  >
    {'Continue with Google'}
  </Link>
)
