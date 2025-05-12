import {  NextResponse } from 'next/server';

export async function POST() {
  try {

    // Return new document data
    return NextResponse.json({name: 'test', type: 'test', size: 100, uploadedBy: {id: '1', name: 'test', email: 'test@test.com'}}, { status: 201 });
  } catch (error) {
    console.error('Upload document error:', error);
    return NextResponse.json(
      { message: 'Failed to process upload', error: (error as Error).message || 'Internal server error' },
      { status: 500 }
    );
  }
} 