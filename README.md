<a href="https://askdit.chiragverma.dev">
    <h1 align="center">Askdit</h1>
</a>

<p align="center">
    A social platform built with Next.js 14 for community interaction, content sharing, and engaging discussions, with integrated Q&amp;A features.
</p>

## Introduction

Askdit is an open-source social platform for community interaction, content sharing, and engaging discussions, with integrated Q&A features. Built with Next.js 14, it offers:

- Community Creation and Interaction: Users can create, join, and engage in diverse communities.
- Multi-format Content Sharing: Support for regular posts, media uploads, and link sharing.
- Integrated Q&A System: Ask questions, provide answers, and mark resolved issues.
- User Engagement: Follow communities, upvote content, and participate in discussions.
- Responsive Design: Seamless experience across devices with a modern, intuitive interface.

## Run Locally

Clone the repository

```
git clone https://github.com/chiragverma11/askdit
```

Go to the project directory

```
cd askdit
```

Install dependencies

```
pnpm install
```

Copy the `.env.example` to `.env` and update the variables

```
cp .env.example .env
```

Push the database schema

```
pnpm run db:push
```

Start the development server

```
pnpm run dev
```

## Tech Stack

- [Next.js](https://nextjs.org/) - Framework
- [TailwindCSS](https://tailwindcss.com/) - Styling
- [Neon](https://neon.tech/) - Database
- [Prisma](https://prisma.io/) - ORM
- [NextAuth](https://next-auth.js.org/) - Auth
- [ImageKit](https://imagekit.io/) - Images & Media
- [shadcn/ui](https://ui.shadcn.com/) - UI Components
- [Aiven](https://aiven.io/) - Caching
- [Vercel](https://vercel.com/) - Hosting

## Contributing

We welcome your contributions to Askdit. Here's how you can get involved:

- Found a bug? [Open an issue](https://github.com/chiragverma11/askdit/issues/new) to report it.
- Have an idea? Share it with us through an issue!
- Ready to code? We welcome [pull requests](https://github.com/chiragverma11/askdit/pulls) for new features, improvements, or bug fixes.
