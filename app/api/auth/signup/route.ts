import { NextRequest, NextResponse } from 'next/server';
import { User } from '@/lib/context/AuthContext';
import { signupSchema } from '@/lib/schema';
import { formatZodError } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();

    // Validate request body
    const validationResult = signupSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { message: "Invalid input", error: formatZodError(validationResult.error) },
        { status: 400 }
      );
    }

    const { name, email } = body;

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      // Create new user
      const newUser: User = {
        id: "4", 
        name,
        email,
        role: "viewer",
      };

      // Return user data (excluding sensitive information in a real app)
      return NextResponse.json(newUser, { status: 201 });
    } catch (error) {
      throw error;
    }
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 