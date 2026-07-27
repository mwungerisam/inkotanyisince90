import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const referenceId = searchParams.get('referenceId');

    if (!referenceId) {
      return NextResponse.json(
        { error: 'Missing referenceId' },
        { status: 400 }
      );
    }

    // MTN Mobile Money API Configuration
    const MTN_API_BASE = process.env.MTN_API_BASE || 'https://sandbox.momodeveloper.mtn.com';
    const MTN_API_KEY = process.env.MTN_API_KEY;
    const MTN_API_SECRET = process.env.MTN_API_SECRET;
    const MERCHANT_ID = process.env.MERCHANT_ID;

    if (!MTN_API_KEY || !MTN_API_SECRET || !MERCHANT_ID) {
      return NextResponse.json(
        { error: 'MTN payment credentials not configured' },
        { status: 500 }
      );
    }

    // In production, you would make an actual API call to MTN MoMo to check payment status
    // For now, return a mock response
    
    console.log('Payment status check for referenceId:', referenceId);

    return NextResponse.json({
      success: true,
      referenceId,
      status: 'pending', // pending, successful, failed
      message: 'Payment is being processed',
    });

  } catch (error) {
    console.error('Payment status check error:', error);
    return NextResponse.json(
      { error: 'Failed to check payment status' },
      { status: 500 }
    );
  }
}
