import { NextRequest, NextResponse } from 'next/server';
import { getPaymentConfig, getRequestToPayStatus, mapMomoStatus } from '@/lib/payment';
import { updateServerOrderByReference } from '@/lib/db';

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

    const paymentConfig = getPaymentConfig();

    if (!paymentConfig.apiUser || !paymentConfig.apiKey || !paymentConfig.subscriptionKey) {
      return NextResponse.json(
        {
          error: 'MTN sandbox credentials are incomplete. Configure API user, API key, and subscription key.',
          code: 'PAYMENT_CONFIG_MISSING',
        },
        { status: 500 }
      );
    }

    const paymentStatus = await getRequestToPayStatus(referenceId);
    const mappedStatus = mapMomoStatus(paymentStatus.raw?.status as string);

    try {
      await updateServerOrderByReference(referenceId, {
        status: mappedStatus === 'successful' ? 'completed' : mappedStatus === 'failed' ? 'cancelled' : 'processing',
      });
    } catch (error) {
      console.error('Failed to update server order status:', error);
    }

    return NextResponse.json({
      success: true,
      referenceId,
      status: paymentStatus.status,
      message: paymentStatus.message,
      environment: paymentConfig.targetEnvironment,
      data: paymentStatus.raw,
    });
  } catch (error) {
    console.error('Payment status check error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to check payment status',
      },
      { status: 500 }
    );
  }
}
