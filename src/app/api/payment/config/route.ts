import { NextResponse } from 'next/server';
import { getMissingPaymentConfigFields, getPaymentConfig, getPaymentConfigPresence } from '@/lib/payment';

export async function GET() {
  const config = getPaymentConfig();
  const missingFields = getMissingPaymentConfigFields();
  const isLive = config.targetEnvironment === 'live';

  return NextResponse.json({
    success: true,
    environment: config.targetEnvironment,
    isLive,
    callbackUrl: config.callbackUrl,
    hasCallbackSecret: Boolean(config.callbackSecret),
    missingFields,
    missingLiveFields: isLive ? missingFields : [],
    config: getPaymentConfigPresence(),
    message: isLive
      ? 'Live mode is enabled. Verify that your MTN live credentials and public callback URL are correct.'
      : 'Sandbox mode is enabled. Switch MTN_TARGET_ENVIRONMENT to live for production payments.',
  });
}
