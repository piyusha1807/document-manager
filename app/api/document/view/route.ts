import { NextRequest, NextResponse } from 'next/server';
import { getDocumentById } from '@/lib/mock/documents';

export async function GET(request: NextRequest) {
  try {
    // Get document ID from query parameters
    const searchParams = request.nextUrl.searchParams;
    const documentId = searchParams.get('id');

    if (!documentId) {
      return NextResponse.json(
        { message: "Document ID is required" },
        { status: 400 }
      );
    }

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Get document by ID
    const document = getDocumentById(documentId);

    if (!document) {
      return NextResponse.json(
        { message: "Document not found" },
        { status: 404 }
      );
    }

    // Return document data
    return NextResponse.json(document);
  } catch (error) {
    console.error('View document error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 