import { NextRequest, NextResponse } from 'next/server';
import type { Order } from '@/types';
import {
  getMissingPaymentConfigFields,
  requestToPay,
  validatePhoneNumber,
} from '@/lib/payment';
import { saveServerOrder } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, phoneNumber, cartItems, customerInfo } = body;

    if (!amount || !phoneNumber || !customerInfo || !Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json(
        { error: 'Missing required checkout details' },
        { status: 400 }
      );
    }

    if (!validatePhoneNumber(phoneNumber)) {
      return NextResponse.json(
        { error: 'Enter a valid Rwanda MTN phone number' },
        { status: 400 }
      );
    }

    const missingFields = getMissingPaymentConfigFields();

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          error: `MTN sandbox credentials are incomplete. Missing: ${missingFields.join(', ')}`,
          code: 'PAYMENT_CONFIG_MISSING',
        },
        { status: 500 }
      );
    }

    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const externalId = orderId;

    const payment = await requestToPay({
      amount,
      phoneNumber,
      externalId,
      payerMessage: `Payment for ${customerInfo.firstName || 'customer'} ${customerInfo.lastName || ''}`.trim(),
      payeeNote: 'INKOTANYISINCE90 order payment',
    });

    const isSandbox = payment.environment === 'sandbox';

    const serverOrder: Order = {
      id: orderId,
      externalId,
      referenceId: payment.referenceId,
      items: cartItems,
      total: amount,
      customer: {
        name: `${customerInfo.firstName || ''} ${customerInfo.lastName || ''}`.trim(),
        phone: customerInfo.phone,
        email: customerInfo.email,
        address: [customerInfo.address, customerInfo.apartment, customerInfo.city, customerInfo.country, customerInfo.postalCode]
          .filter(Boolean)
          .join(', '),
      },
      paymentMethod: 'mtn',
      status: payment.status === 'successful' ? 'completed' : payment.status === 'failed' ? 'cancelled' : 'processing',
      createdAt: new Date(),
    };

    try {
      await saveServerOrder(serverOrder);
    } catch (serverError) {
      console.error('Server order persistence failed:', serverError);
    }

    return NextResponse.json({
      success: true,
      orderId,
      externalId,
      referenceId: payment.referenceId,
      status: payment.status,
      message: isSandbox
        ? 'Payment request created in MTN sandbox. Sandbox does not send a real MoMo PIN prompt to a phone, so verify the transaction through payment status.'
        : 'Payment initiated. Please check your phone and authorize the payment with your MoMo PIN.',
      amount,
      currency: payment.currency,
      phoneNumber,
      environment: payment.environment,
    });
  } catch (error) {
    console.error('Payment initiation error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to initiate payment',
      },
      { status: 500 }
    );
  }
}
