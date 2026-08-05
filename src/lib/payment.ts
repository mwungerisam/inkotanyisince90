export type PaymentStatus = 'pending' | 'processing' | 'successful' | 'failed';

export interface PaymentInitiationResult {
  success: boolean;
  referenceId: string;
  status: PaymentStatus;
  message: string;
  amount: number;
  currency: string;
  phoneNumber: string;
  environment: string;
}

interface MomoTokenResponse {
  access_token: string;
  token_type?: string;
  expires_in?: number;
}

interface MomoRequestToPayStatusResponse {
  status?: 'PENDING' | 'SUCCESSFUL' | 'FAILED';
  reason?: string;
  financialTransactionId?: string;
  amount?: string;
  currency?: string;
  externalId?: string;
  payer?: {
    partyIdType?: string;
    partyId?: string;
  };
}

export function getPaymentEnvironment() {
  return process.env.MTN_TARGET_ENVIRONMENT || 'sandbox';
}

export function getPaymentConfig() {
  const baseCallbackUrl =
    process.env.CALLBACK_URL ||
    (process.env.NEXT_PUBLIC_BASE_URL
      ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/callback`
      : null);

  const callbackSecret = process.env.MTN_CALLBACK_SECRET;
  const callbackUrl = callbackSecret && baseCallbackUrl
    ? `${baseCallbackUrl}${baseCallbackUrl.includes('?') ? '&' : '?'}secret=${encodeURIComponent(callbackSecret)}`
    : baseCallbackUrl;

  const targetEnvironment = getPaymentEnvironment();
  const defaultApiBase =
    targetEnvironment === 'live'
      ? 'https://momodeveloper.mtn.com'
      : 'https://sandbox.momodeveloper.mtn.com';

  return {
    apiBase: process.env.MTN_API_BASE || defaultApiBase,
    apiUser: process.env.MTN_API_USER || process.env.MERCHANT_ID,
    apiKey: process.env.MTN_API_KEY,
    subscriptionKey: process.env.MTN_SUBSCRIPTION_KEY,
    merchantPhoneNumber: process.env.MERCHANT_PHONE_NUMBER || null,
    targetEnvironment,
    currency: process.env.MTN_CURRENCY || 'EUR',
    callbackUrl,
    callbackSecret,
  };
}

export function getMissingPaymentConfigFields() {
  const config = getPaymentConfig();
  const missingFields: string[] = [];

  if (!config.apiUser) {
    missingFields.push('MTN_API_USER or MERCHANT_ID');
  }

  if (!config.apiKey) {
    missingFields.push('MTN_API_KEY');
  }

  if (!config.subscriptionKey) {
    missingFields.push('MTN_SUBSCRIPTION_KEY');
  }

  if (!config.callbackUrl) {
    missingFields.push('CALLBACK_URL or NEXT_PUBLIC_BASE_URL');
  }

  return missingFields;
}

export function getPaymentConfigPresence() {
  const config = getPaymentConfig();

  return {
    apiBase: config.apiBase,
    hasApiUser: Boolean(config.apiUser),
    hasApiKey: Boolean(config.apiKey),
    hasSubscriptionKey: Boolean(config.subscriptionKey),
    hasMerchantPhoneNumber: Boolean(config.merchantPhoneNumber),
    hasCallbackUrl: Boolean(config.callbackUrl),
    hasCallbackSecret: Boolean(config.callbackSecret),
    targetEnvironment: config.targetEnvironment,
    currency: config.currency,
    callbackUrl: config.callbackUrl,
  };
}

export function validatePhoneNumber(phoneNumber: string) {
  const normalized = phoneNumber.replace(/\s+/g, '');
  return /^\+?2507\d{8}$/.test(normalized) || /^07\d{8}$/.test(normalized);
}

export function normalizePhoneNumber(phoneNumber: string) {
  const normalized = phoneNumber.replace(/\s+/g, '');
  if (normalized.startsWith('+')) {
    return normalized.slice(1);
  }
  if (/^07\d{8}$/.test(normalized)) {
    return `250${normalized.slice(1)}`;
  }
  return normalized;
}

export function createReferenceId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `ref-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function getBasicAuthHeader(apiUser: string, apiKey: string) {
  const credentials = Buffer.from(`${apiUser}:${apiKey}`).toString('base64');
  return `Basic ${credentials}`;
}

export async function getMomoAccessToken() {
  const config = getPaymentConfig();

  if (!config.apiUser || !config.apiKey || !config.subscriptionKey) {
    throw new Error('MTN payment credentials not configured');
  }

  const response = await fetch(`${config.apiBase}/collection/token/`, {
    method: 'POST',
    headers: {
      Authorization: getBasicAuthHeader(config.apiUser, config.apiKey),
      'Ocp-Apim-Subscription-Key': config.subscriptionKey,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorText = await response.text();
    if (response.status === 401) {
      throw new Error(
        'MTN authentication failed: the Collections subscription key is invalid for this product or environment. Set the correct value in MTN_SUBSCRIPTION_KEY.'
      );
    }

    throw new Error(`Failed to obtain MTN access token: ${errorText || response.statusText}`);
  }

  return response.json() as Promise<MomoTokenResponse>;
}

export async function requestToPay(params: {
  amount: number;
  phoneNumber: string;
  externalId: string;
  payerMessage: string;
  payeeNote: string;
}) {
  const config = getPaymentConfig();

  if (!config.subscriptionKey || !config.callbackUrl) {
    throw new Error('MTN callback URL or subscription key not configured');
  }

  const token = await getMomoAccessToken();
  const referenceId = createReferenceId();

  const response = await fetch(`${config.apiBase}/collection/v1_0/requesttopay`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token.access_token}`,
      'X-Reference-Id': referenceId,
      'X-Target-Environment': config.targetEnvironment,
      'X-Callback-Url': config.callbackUrl,
      'Ocp-Apim-Subscription-Key': config.subscriptionKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: params.amount.toString(),
      currency: config.currency,
      externalId: params.externalId,
      payer: {
        partyIdType: 'MSISDN',
        partyId: normalizePhoneNumber(params.phoneNumber),
      },
      payerMessage: params.payerMessage,
      payeeNote: params.payeeNote,
    }),
    cache: 'no-store',
  });

  if (!response.ok && response.status !== 202) {
    const errorText = await response.text();

    if (errorText.includes('INVALID_CURRENCY') || errorText.includes('Currency not supported')) {
      throw new Error(
        'MTN request-to-pay failed: currency not supported for this sandbox setup. Set MTN_CURRENCY to the currency enabled for your MTN environment, commonly EUR in sandbox.'
      );
    }

    throw new Error(`MTN request-to-pay failed: ${errorText || response.statusText}`);
  }

  return {
    referenceId,
    status: 'processing' as PaymentStatus,
    environment: config.targetEnvironment,
    currency: config.currency,
  };
}

export async function getRequestToPayStatus(referenceId: string) {
  const config = getPaymentConfig();

  if (!config.subscriptionKey) {
    throw new Error('MTN subscription key not configured');
  }

  const token = await getMomoAccessToken();
  const response = await fetch(`${config.apiBase}/collection/v1_0/requesttopay/${referenceId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token.access_token}`,
      'X-Target-Environment': config.targetEnvironment,
      'Ocp-Apim-Subscription-Key': config.subscriptionKey,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`MTN payment status check failed: ${errorText || response.statusText}`);
  }

  const data = (await response.json()) as MomoRequestToPayStatusResponse;

  return {
    raw: data,
    status: mapMomoStatus(data.status),
    message: getMomoStatusMessage(data.status, data.reason),
  };
}

export function mapMomoStatus(status?: string): PaymentStatus {
  switch (status) {
    case 'SUCCESSFUL':
      return 'successful';
    case 'FAILED':
      return 'failed';
    case 'PENDING':
      return 'processing';
    default:
      return 'processing';
  }
}

function getMomoStatusMessage(status?: string, reason?: string) {
  if (status === 'SUCCESSFUL') {
    return 'Payment has been completed successfully.';
  }

  if (status === 'FAILED') {
    return reason || 'Payment was declined or could not be completed.';
  }

  return reason || 'Payment is still being processed.';
}
