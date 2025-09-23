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
    
    // Use the pdf-parse library to extract text
    const data = await pdf(buffer);

    return NextResponse.json({text: data.text});
  } catch (error: any) {
    console.error('Error parsing PDF:', error);
    return NextResponse.json(
      {error: error.message || 'Failed to parse PDF file.'},
      {status: 500}
    );
  }
}
