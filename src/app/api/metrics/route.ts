
// app/api/metrics/route.ts

import { Registry, collectDefaultMetrics } from 'prom-client';
import { NextResponse } from 'next/server';

const register = new Registry();
collectDefaultMetrics({ register });

export async function GET() {
  const metrics = await register.metrics();
  return new NextResponse(metrics, {
    status: 200,
    headers: {
      'Content-Type': register.contentType,
    },
  });
}
