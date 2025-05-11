import { NextRequest, NextResponse } from 'next/server';
import { updateUserSchema } from '@/lib/schema';
import { updateUser } from '@/lib/mock/users';
import { formatZodError } from '@/lib/utils';

export async function PUT(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();

    // Validate request body
    const validationResult = updateUserSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { message: "Invalid input", error: formatZodError(validationResult.error) },
        { status: 400 }
      );
    }

    const { id, ...userData } = validationResult.data;

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Update user
    const updatedUser = updateUser(id, userData);

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Return updated user data
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Edit user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 