import React from 'react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { renderHook, waitFor } from '@testing-library/react';

// Mock API server
const server = setupServer(
  rest.get('/api/documents', (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        documents: [
          { id: '1', title: 'Document 1', createdAt: '2023-01-01' },
          { id: '2', title: 'Document 2', createdAt: '2023-01-02' },
        ],
      })
    );
  }),
  
  rest.post('/api/documents', (_req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        success: true,
        document: { id: '3', title: 'New Document', createdAt: '2023-01-03' },
      })
    );
  })
);

// Enable API mocking before tests
beforeAll(() => server.listen());

// Reset any request handlers that we may add during the tests
afterEach(() => server.resetHandlers());

// Disable API mocking after the tests are done
afterAll(() => server.close());

// Mock hook that would fetch documents
const useDocuments = () => {
  const [documents, setDocuments] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/documents');
      const data = await response.json();
      setDocuments(data.documents);
      setError(null);
    } catch (_err) {
      setError('Failed to fetch documents');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchDocuments();
  }, []);

  return { documents, loading, error, refetch: fetchDocuments };
};

describe('Documents API', () => {
  test('successfully fetches documents', async () => {
    const { result } = renderHook(() => useDocuments());
    
    // Initially loading
    expect(result.current.loading).toBe(true);
    
    // Wait for the documents to be fetched
    await waitFor(() => expect(result.current.loading).toBe(false));
    
    // Should have documents
    expect(result.current.documents).toHaveLength(2);
    expect(result.current.documents[0].title).toBe('Document 1');
  });
  
  test('handles API error', async () => {
    // Override the default handler to simulate an error
    server.use(
      rest.get('/api/documents', (_req, res, ctx) => {
        return res(ctx.status(500));
      })
    );
    
    const { result } = renderHook(() => useDocuments());
    
    // Wait for the API call to complete
    await waitFor(() => expect(result.current.loading).toBe(false));
    
    // Should have an error
    expect(result.current.error).toBe('Failed to fetch documents');
    expect(result.current.documents).toHaveLength(0);
  });
}); 