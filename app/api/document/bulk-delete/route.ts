import { NextRequest, NextResponse } from 'next/server';
import { bulkDocumentIdsSchema } from '@/lib/schema';
import { bulkDeleteDocuments } from '@/lib/mock/documents';
import { formatZodError } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();

    // Validate request body
    const validationResult = bulkDocumentIdsSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { message: "Invalid input", error: formatZodError(validationResult.error) },
        { status: 400 }
      );
    }

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Bulk delete documents
    const deletedCount = bulkDeleteDocuments(validationResult.data.ids);

    // Return success message with deleted count
    return NextResponse.json(
      { message: `${deletedCount} document(s) deleted successfully` },
      { status: 200 }
    );
  } catch (error) {
    console.error('Bulk delete documents error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 