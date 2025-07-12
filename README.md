# FK-Web

A modern, full-stack web platform for the Guild of Physics, built with Next.js, Payload CMS, and PostgreSQL.  
This project is designed for extensibility, internationalization, and rich content management.

---

## Requirements

- **Node.js**: v18.20.2 or >=20.9.0
- **pnpm**: v10+
- **Docker** (optional, for containerized development/production)
- **PostgreSQL**: (if not using Docker Compose's built-in service)

---

## Setup

### 1. Clone the repository

```bash
git clone <repo-url>
cd fk-web
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Environment Variables

Create a `.env` file in the root directory.  
**Required variables** (see codebase for more, depending on features used):

```env
# Server and site
NEXT_NEXT_PUBLIC_SERVER_URL=http://localhost:3000

# Database
DATABASE_URI=postgres://user:password@localhost:5432/dbname

# Payload CMS
PAYLOAD_SECRET=your-secret

# Email (SMTP)
EMAIL_FROM_NAME=Fyysikkokilta
EMAIL_FROM_ADDRESS=your@email.com
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-smtp-user
SMTP_PASSWORD=your-smtp-password

# Google APIs
GOOGLE_API_KEY=your-google-api-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_SITE_VERIFICATION=your-google-site-verification

# OAuth
ALLOW_NON_EXISTING_USERS=false

# S3
S3_BUCKET=...
S3_ACCESS_KEY_ID=...
S3_SECRET=...
S3_ENDPOINT=...
NEXT_PUBLIC_S3_PUBLIC_URL=...

# Form builder
FORM_BUILDER_DEFAULT_TO_EMAIL=...

# Analyze bundle (optional)
ANALYZE=true
```

### 4. Database

- By default, the project expects a PostgreSQL database.
- You can use Docker Compose to spin up the app and (optionally) a database.

#### Using Docker Compose

Uncomment the `postgres` service in `docker-compose.yml` if you want to use the built-in database.

```bash
docker-compose up --build
```

#### Manual DB Setup

- Create a PostgreSQL database and user.
- Set `DATABASE_URI` accordingly in your `.env`.

### 5. Development

```bash
pnpm dev
```

### 6. Build & Production

```bash
pnpm build
pnpm start
```

Or use Docker:

```bash
docker build -t fk-web .
docker run -p 3000:3000 --env-file .env fk-web
```

---

## Project Structure

```
src/
  app/                # Next.js app directory (frontend routes, layouts, API)
    (frontend)/       # Main frontend, locale-based routing
    (payload)/        # Payload CMS admin interface
  blocks/             # Reusable content blocks (Calendar, TwoColumns, etc.)
  collections/        # Payload CMS collections (Pages, Newsletters, Media, etc.)
  components/         # Shared React components (RichText, Navigation, etc.)
  emails/             # Email templates
  fields/             # Custom Payload field configs
  globals/            # Global site settings (Footer, Navigation, etc.)
  hooks/              # Custom hooks for Payload/Next.js
  lib/                # Utility libraries (calendar, etc.)
  utils/              # Utility functions
  payload.config.ts   # Payload CMS configuration
  payload-types.ts    # Auto-generated Payload types
```

---

## Main Dependencies

- **Next.js** (App Router, SSR, i18n)
- **Payload CMS** (headless CMS, admin UI, API)
- **PostgreSQL** (database)
- **Tailwind CSS** (utility-first styling)
- **date-fns** (date utilities)
- **lucide-react** (icon set)
- **next-intl** (internationalization)
- **S3 (Cloudflare)** (cloud storage, optional)
- **Plaiceholder** (image placeholders)
- **React Hook Form** (forms)
- **Nodemailer** (email via Payload plugin)
- **Payload Plugins**: SEO, Redirects, Form Builder, Import/Export, Storage, etc.

---

## Content Blocks

- **Calendar**: Google Calendar integration, color-coded events
- **TwoColumns**: Responsive two-column layout
- **Align**: Horizontally align and set width for rich text content
- **Newsletter**: Newsletter content and settings
- **PDFViewer**: Embed PDFs
- **BoardMemberGrid**: Display board members
- **Collapsible**: Expand/collapse content
- **EmbedVideo**: YouTube/Vimeo embeds
- ...and more

---

## Development Notes

- Uses **pnpm** for package management.
- Uses **ESLint** and **Prettier** for code style.
- Uses **Docker** for production and local development.
- All media and document uploads are stored in `/public/media` and `/public/documents` (volumes in Docker).
- Rich text editing is powered by Payload's Lexical editor.

---

## Useful Scripts

- `pnpm dev` – Start development server
- `pnpm build` – Build for production
- `pnpm start` – Start production server
- `pnpm lint` – Lint code
- `pnpm generate:types` – Generate Payload types
- `pnpm generate:importmap` – Generate import map for Payload

---

## License

MIT
