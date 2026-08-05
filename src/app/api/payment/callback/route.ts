import { NextRequest, NextResponse } from 'next/server';
import { getPaymentConfig, mapMomoStatus } from '@/lib/payment';
import { updateServerOrderByReference } from '@/lib/db';

export async function POST(request: NextRequest) {
  const config = getPaymentConfig();
  const providedSecret = request.nextUrl.searchParams.get('secret');

  if (config.callbackSecret && providedSecret !== config.callbackSecret) {
    console.error('Invalid callback secret provided');
    return NextResponse.json(
      { error: 'Unauthorized callback request' },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { referenceId, status, transactionId, amount, phoneNumber } = body;

    if (!referenceId || !status) {
      return NextResponse.json(
        { error: 'Invalid callback data' },
        { status: 400 }
      );
    }

    const mappedStatus = mapMomoStatus(status);
    const orderStatus = mappedStatus === 'successful' ? 'completed' : mappedStatus === 'failed' ? 'cancelled' : 'processing';

    const updatedOrder = await updateServerOrderByReference(referenceId, {
      status: orderStatus,
    });

    console.log('Payment callback received:', {
      referenceId,
      status,
      mappedStatus,
      updatedOrderExists: Boolean(updatedOrder),
      transactionId,
      amount,
      phoneNumber,
    });

    return NextResponse.json({
      success: true,
      referenceId,
      received: true,
      status,
      updatedOrderExists: Boolean(updatedOrder),
    });
  } catch (error) {
    console.error('Payment callback error:', error);
    return NextResponse.json(
      { error: 'Failed to process callback' },
      { status: 500 }
    );
  }
}
