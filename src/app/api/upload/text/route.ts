import {NextRequest, NextResponse} from 'next/server';
import pdf from 'pdf-parse';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({error: 'No file uploaded.'}, {status: 400});
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const data = await pdf(buffer);

    return NextResponse.json({text: data.text});
  } catch (error: any) {
    console.error('Error parsing PDF on server:', error);
    return NextResponse.json(
      {error: `Failed to parse PDF file on the server. Details: ${error.message || 'Unknown error'}`},
      {status: 500}
    );
  }
}
