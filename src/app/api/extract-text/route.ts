import {NextRequest, NextResponse} from 'next/server';
import pdf from 'pdf-parse';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({error: 'No file was uploaded.'}, {status: 400});
    }
    
    if (file.type !== 'application/pdf') {
        return NextResponse.json({ error: 'Only PDF files are accepted.' }, { status: 400 });
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    
    const data = await pdf(fileBuffer);
    
    return NextResponse.json({text: data.text});

  } catch (error: any) {
    console.error('PDF parsing error:', error);
    return NextResponse.json(
      {error: `Failed to parse PDF: ${error.message || 'Unknown error'}`},
      {status: 500}
    );
  }
}
