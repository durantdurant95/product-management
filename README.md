# ProductTracker

ProductTracker is a web application for managing product lists. It allows users to track products with names, descriptions, and completion status.

## Features

- Product management with name, description, and checked status
- Filtering capabilities to easily find products
- Infinite scroll for efficient browsing of large product lists
- Dark/light mode theme switching
- Responsive design using Tailwind CSS
- Modern UI components from shadcn
- Built with Next.js for optimal performance
- Backend powered by mockAPI

## Tech Stack

- [Next.js](https://nextjs.org)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [mockAPI](https://mockapi.io) for backend services

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## API Integration

This application uses mockAPI to handle backend operations for product data management. The API endpoints handle:

- Retrieving product lists
- Adding new products
- Updating product status
- Deleting products

## Deployment

This application is already deployed on [Vercel](https://vercel.com) and can be accessed at [https://product-tracker.vercel.app](https://product-tracker.vercel.app). Vercel provides continuous deployment with automatic updates whenever changes are pushed to the main branch.
