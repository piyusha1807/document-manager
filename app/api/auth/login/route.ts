import { formatZodError } from '@/lib/utils';
import { NextRequest, NextResponse } from 'next/server';
import { loginSchema } from '@/lib/schema';
import { User } from '@/lib/context/AuthContext';

// Mock user data (to be replaced with actual API calls)
const mockUsers: User[] = [
    {
      id: "1",
      name: "Admin User",
      email: "admin@example.com",
      role: "admin",
    },
    {
      id: "2",
      name: "Editor User",
      email: "editor@example.com",
      role: "editor",
    },
    {
      id: "3",
      name: "Viewer User",
      email: "viewer@example.com",
      role: "viewer",
    },
  ];

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();

    // Validate request body
    const validationResult = loginSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { message: "Invalid input", error: formatZodError(validationResult.error) },
        { status: 400 }
      );
    }
    const { email, password } = body;

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Find user by email
    const user = mockUsers.find((u) => u.email === email);

    if (!user || password !== "password") {
      // Simulate 401 Unauthorized
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Return user data (excluding sensitive information in a real app)
    return NextResponse.json(user);
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 