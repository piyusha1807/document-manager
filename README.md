# Document Management Application

A comprehensive web application for managing users, documents, and providing a Q&A interface.

## Features

- **User Authentication**: Sign up, login, and logout functionality
- **User Management**: Admin panel for managing users and roles
- **Document Management**: Upload, view, update, and delete documents
- **Ingestion Management**: Monitor and control document ingestion processes
- **Q&A Interface**: Ask questions and get answers based on document content

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **State Management**: React Context API
- **UI Components**: Custom components with Tailwind CSS
- **Testing**: Jest, React Testing Library, MSW

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository

```bash
git clone https://github.com/username/document-manager.git
cd document-manager
```

2. Install dependencies

```bash
npm install
```

3. Run the development server

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Testing

This project uses Jest and React Testing Library for testing. Please see the [TESTING.md](TESTING.md) file for detailed information about our testing strategy and guidelines.

Run the test suite:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
