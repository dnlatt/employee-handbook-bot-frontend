// src/app/api/query/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Pinecone } from '@pinecone-database/pinecone';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize clients
const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { question } = await request.json();

    if (!question) {
      return NextResponse.json(
        { error: 'Question is required' },
        { status: 400 }
      );
    }

    console.log('🤖 Processing question:', question);

    // 1. Get embeddings for the question using Google's embedding model
    const embeddingModel = genAI.getGenerativeModel({ 
      model: 'models/embedding-001' 
    });
    
    const embeddingResult = await embeddingModel.embedContent(question);
    const queryEmbedding = embeddingResult.embedding.values;

    console.log('🧠 Generated embedding vector');

    // 2. Search Pinecone for similar content
    const index = pc.index('handbook-index');
    const searchResults = await index.query({
      vector: queryEmbedding,
      topK: 5,
      includeMetadata: true,
    });

    console.log('🔍 Found', searchResults.matches?.length || 0, 'relevant chunks');

    // 3. Extract relevant text chunks
    const relevantTexts = searchResults.matches
      ?.filter(match => match.score && match.score > 0.6)
      .map(match => typeof match.metadata?.text === 'string' ? match.metadata.text : '')
      .filter(text => text.length > 0) || [];

    if (relevantTexts.length === 0) {
      return NextResponse.json({
        answer: "I couldn't find relevant information about that topic in the employee handbook. Please try rephrasing your question or ask about policies, benefits, or procedures.",
        sources: [],
        confidence: 0
      });
    }

    // 4. Generate answer with Gemini
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.3, // Lower temperature for more consistent answers
      }
    });

    const context = relevantTexts.join('\n\n');
    const prompt = `You are an AI assistant helping employees understand their company handbook. Based on the following excerpts from the employee handbook, provide a clear, comprehensive answer to the employee's question.

Employee Handbook Excerpts:
${context}

Employee Question: ${question}

Instructions:
- Provide specific, actionable information from the handbook
- Use bullet points or numbered lists when appropriate for clarity
- Be helpful and professional
- If information is incomplete, mention what sections might have more details
- Keep the answer concise but comprehensive

Answer:`;

    const result = await model.generateContent(prompt);
    const answer = result.response.text();

    console.log('✅ Generated answer');

    // Calculate average confidence score
    const avgConfidence = searchResults.matches?.length 
      ? searchResults.matches.reduce((sum, match) => sum + (match.score || 0), 0) / searchResults.matches.length
      : 0;

    return NextResponse.json({
      answer,
      sources: searchResults.matches?.map((match, index) => ({
        id: index,
        score: match.score,
        text: typeof match.metadata?.text === 'string' 
          ? match.metadata.text.substring(0, 300) + (match.metadata.text.length > 300 ? '...' : '')
          : 'No text available',
        relevance: Math.round((match.score || 0) * 100)
      })) || [],
      confidence: Math.round(avgConfidence * 100)
    });

  } catch (error) {
    console.error('❌ Error processing query:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process question. Please try again.',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Handle CORS for development
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}