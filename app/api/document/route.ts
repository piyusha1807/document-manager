import { NextRequest, NextResponse } from 'next/server';
import { getDocuments } from '@/lib/mock/documents';

// GET all documents with pagination, sorting, and searching
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

    // Get all documents
    let documents = getDocuments();

    // Apply search filter if provided
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      documents = documents.filter(
        (document) => 
          document.name.toLowerCase().includes(searchLower) || 
          document.type.toLowerCase().includes(searchLower) ||
          document.uploadedBy.name.toLowerCase().includes(searchLower) ||
          document.uploadedBy.email.toLowerCase().includes(searchLower)
      );
    }

    // Calculate total items and pages
    const totalItems = documents.length;
    const totalPages = Math.ceil(totalItems / rowsPerPage);

    // Apply sorting
    documents.sort((a, b) => {
      // Handle nested fields like uploadedBy.name
      if (sortField.includes('.')) {
        const [parent, child] = sortField.split('.');
        
        if (parent === 'uploadedBy' && (child === 'name' || child === 'email' || child === 'id')) {
          const fieldA = a.uploadedBy[child as keyof typeof a.uploadedBy];
          const fieldB = b.uploadedBy[child as keyof typeof b.uploadedBy];
          
          if (typeof fieldA === 'string' && typeof fieldB === 'string') {
            return sortOrder === 'asc' 
              ? fieldA.localeCompare(fieldB) 
              : fieldB.localeCompare(fieldA);
          }
        }
        
        return 0;
      }
      
      // For regular fields
      if (sortField === 'name' || sortField === 'type' || sortField === 'id' || sortField === 'uploadedAt') {
        const fieldA = a[sortField];
        const fieldB = b[sortField];
        
        if (typeof fieldA === 'string' && typeof fieldB === 'string') {
          return sortOrder === 'asc' 
            ? fieldA.localeCompare(fieldB) 
            : fieldB.localeCompare(fieldA);
        }
      } else if (sortField === 'size') {
        const fieldA = a.size;
        const fieldB = b.size;
        
        return sortOrder === 'asc' ? fieldA - fieldB : fieldB - fieldA;
      }
      
      return 0;
    });

    // Apply pagination
    const startIndex = pageNumber * rowsPerPage;
    const paginatedDocuments = documents.slice(startIndex, startIndex + rowsPerPage);

    // Return paginated data with metadata
    return NextResponse.json({
      data: paginatedDocuments,
      pagination: {
        totalItems,
        totalPages,
        currentPage: pageNumber,
        rowsPerPage
      }
    });
  } catch (error) {
    console.error('Get documents error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 