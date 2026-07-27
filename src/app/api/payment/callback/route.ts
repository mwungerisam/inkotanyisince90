import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // MTN Mobile Money will send a callback with payment status
    // The structure depends on MTN's API specification
    const { referenceId, status, transactionId, amount, phoneNumber } = body;

    console.log('Payment callback received:', {
      referenceId,
      status,
      transactionId,
      amount,
      phoneNumber,
    });

    // Validate the callback (in production, you should verify the signature)
    if (!referenceId || !status) {
      return NextResponse.json(
        { error: 'Invalid callback data' },
        { status: 400 }
      );
    }

    // Update payment status in your database
    // For now, we'll just log it. In production, you would:
    // 1. Find the order by referenceId
    // 2. Update the order status based on the callback
    // 3. Send confirmation email to customer
    // 4. Clear the cart if payment is successful

    if (status === 'successful') {
      console.log(`Payment successful for referenceId: ${referenceId}`);
      // Here you would:
      // - Update order status to 'paid'
      // - Send confirmation email
      // - Trigger order fulfillment
    } else if (status === 'failed') {
      console.log(`Payment failed for referenceId: ${referenceId}`);
      // Here you would:
      // - Update order status to 'failed'
      // - Notify customer of payment failure
    }

    // Return 200 to acknowledge receipt of callback
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Payment callback error:', error);
    return NextResponse.json(
      { error: 'Failed to process callback' },
      { status: 500 }
    );
  }
}
