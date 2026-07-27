import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, phoneNumber, cartItems, customerInfo } = body;

    // Validate required fields
    if (!amount || !phoneNumber || !customerInfo) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // MTN Mobile Money API Configuration
    const MTN_API_BASE = process.env.MTN_API_BASE || 'https://sandbox.momodeveloper.mtn.com';
    const MTN_API_KEY = process.env.MTN_API_KEY;
    const MTN_API_SECRET = process.env.MTN_API_SECRET;
    const MERCHANT_ID = process.env.MERCHANT_ID;
    const CALLBACK_URL = process.env.CALLBACK_URL || `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/callback`;

    if (!MTN_API_KEY || !MTN_API_SECRET || !MERCHANT_ID) {
      return NextResponse.json(
        { error: 'MTN payment credentials not configured' },
        { status: 500 }
      );
    }

    // Generate reference ID
    const referenceId = `REF-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // MTN Mobile Money API call to initiate payment
    // Note: This is a simplified implementation. You'll need to implement the actual MTN MoMo API
    // according to their documentation: https://momodeveloper.mtn.com/

    const paymentPayload = {
      amount: amount.toString(),
      currency: 'RWF',
      externalId: referenceId,
      payer: {
        partyIdType: 'MSISDN',
        partyId: phoneNumber,
      },
      payeeNote: 'Payment for Inkotanyi Since 90',
      payerMessage: 'Thank you for your purchase',
    };

    // For now, return a mock response since we don't have actual MTN credentials
    // In production, you would make an actual API call to MTN MoMo here
    
    console.log('Payment initiation request:', {
      referenceId,
      amount,
      phoneNumber,
      cartItems,
      customerInfo,
    });

    return NextResponse.json({
      success: true,
      referenceId,
      message: 'Payment initiated. Please check your phone to authorize the payment.',
      amount,
      currency: 'RWF',
      phoneNumber,
    });

  } catch (error) {
    console.error('Payment initiation error:', error);
    return NextResponse.json(
      { error: 'Failed to initiate payment' },
      { status: 500 }
    );
  }
}
