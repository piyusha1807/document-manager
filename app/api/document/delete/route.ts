import { NextRequest, NextResponse } from 'next/server';
import { documentIdSchema } from '@/lib/schema';
import { deleteDocument } from '@/lib/mock/documents';
import { formatZodError } from '@/lib/utils';

export async function DELETE(request: NextRequest) {
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

    // Validate document ID
    const validationResult = documentIdSchema.safeParse({ id: documentId });
    if (!validationResult.success) {
      return NextResponse.json(
        { message: "Invalid input", error: formatZodError(validationResult.error) },
        { status: 400 }
      );
    }

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Delete document
    const deleted = deleteDocument(documentId);

    if (!deleted) {
      return NextResponse.json(
        { message: "Document not found" },
        { status: 404 }
      );
    }

    // Return success message
    return NextResponse.json(
      { message: "Document deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete document error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 