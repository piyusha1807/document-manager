import { NextRequest, NextResponse } from 'next/server';
import { bulkUserIdsSchema } from '@/lib/schema';
import { bulkDeleteUsers } from '@/lib/mock/users';
import { formatZodError } from '@/lib/utils';

export async function DELETE(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();

    // Validate request body
    const validationResult = bulkUserIdsSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { message: "Invalid input", error: formatZodError(validationResult.error) },
        { status: 400 }
      );
    }

    const { ids } = validationResult.data;

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Bulk delete users
    const deletedCount = bulkDeleteUsers(ids);

    // Return success response with count of deleted users
    return NextResponse.json({ 
      success: true,
      deletedCount 
    });
  } catch (error) {
    console.error('Bulk delete users error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 