# UPC Chatbot Frontend

A modern web interface for the UP Cebu Student Handbook Chatbot, built with Next.js and Tailwind CSS.

## Features

- **Modern UI/UX**: Clean and responsive interface using Tailwind CSS
- **Authentication**: Secure login and session management
- **Dashboard**: User-friendly interface for interacting with the chatbot
- **Knowledge Base Management**: Admin interface for managing documents and training data
- **File Management**: AWS S3 integration for document upload and management

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- AWS SDK for S3 integration

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- AWS Account (for S3 integration)

### Installation

1. Install dependencies:
```bash
npm install
# or
yarn install
```

2. Create a `.env.local` file in the root directory with the following variables:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

```
src/
├── app/              # Next.js app directory
├── components/       # Reusable React components
├── services/        # API and service integrations
└── styles/          # Global styles and Tailwind config
```

## Development

- The application uses Next.js App Router for routing
- Tailwind CSS is used for styling
- TypeScript is used for type safety
- AWS SDK is used for S3 file management

## Building for Production

```bash
npm run build
# or
yarn build
```

## Deployment

The application is deployed to Vercel.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
