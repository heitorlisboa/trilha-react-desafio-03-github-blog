import { NextResponse } from 'next/server';

import { queryIssues } from '@/lib/github';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return new NextResponse(
      JSON.stringify({ error: '"q" search param is missing' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const posts = await queryIssues(query);
  return NextResponse.json(posts);
}
