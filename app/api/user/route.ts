import { NextRequest, NextResponse } from 'next/server';
import { getUsers } from '@/lib/mock/users';

// GET all users with pagination, sorting, and searching
export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const rowsPerPage = parseInt(searchParams.get('rowsPerPage') || '10', 10);
    const pageNumber = parseInt(searchParams.get('pageNumber') || '0', 10);
    const sortField = searchParams.get('sortField') || 'name';
    const sortOrder = searchParams.get('sortOrder') || 'asc';
    const searchQuery = searchParams.get('search') || '';

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Get all users
    let users = getUsers();

    // Apply search filter if provided
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      users = users.filter(
        (user) => 
          user.name.toLowerCase().includes(searchLower) || 
          user.email.toLowerCase().includes(searchLower)
      );
    }

    // Calculate total items and pages
    const totalItems = users.length;
    const totalPages = Math.ceil(totalItems / rowsPerPage);

    // Apply sorting
    users.sort((a, b) => {
      const fieldA = a[sortField as keyof typeof a];
      const fieldB = b[sortField as keyof typeof b];
      
      if (typeof fieldA === 'string' && typeof fieldB === 'string') {
        return sortOrder === 'asc' 
          ? fieldA.localeCompare(fieldB) 
          : fieldB.localeCompare(fieldA);
      }
      
      if (fieldA < fieldB) return sortOrder === 'asc' ? -1 : 1;
      if (fieldA > fieldB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    // Apply pagination
    const startIndex = pageNumber * rowsPerPage;
    const paginatedUsers = users.slice(startIndex, startIndex + rowsPerPage);

    // Return paginated data with metadata
    return NextResponse.json({
      data: paginatedUsers,
      pagination: {
        totalItems,
        totalPages,
        currentPage: pageNumber,
        rowsPerPage
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}