import { NextRequest, NextResponse } from 'next/server';
import { userSchema } from '@/lib/schema';
import { addUser } from '@/lib/mock/users';
import { formatZodError } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();

    // Validate request body
    const validationResult = userSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { message: "Invalid input", error: formatZodError(validationResult.error) },
        { status: 400 }
      );
    }

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Add user
    const newUser = addUser(validationResult.data);

    // Return new user data
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error('Add user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 