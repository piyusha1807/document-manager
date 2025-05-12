import { NextRequest, NextResponse } from 'next/server';
import { userIdSchema } from '@/lib/schema';
import { deleteUser } from '@/lib/mock/users';
import { formatZodError } from '@/lib/utils';

export async function DELETE(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();

    // Validate request body
    const validationResult = userIdSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { message: "Invalid input", error: formatZodError(validationResult.error) },
        { status: 400 }
      );
    }

    const { id } = validationResult.data;

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Delete user
    const result = deleteUser(id);

    if (!result) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Return success response
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 