import { NextResponse } from 'next/server';
import { getSettings, updateSettings, getUserByToken } from '@/lib/db';

export async function GET() {
  try {
    const settings = getSettings();
    return NextResponse.json({
      success: true,
      settings: {
        adsenseClientId: settings.adsenseClientId || '',
        adsenseSlotId: settings.adsenseSlotId || '',
        adsEnabled: settings.adsEnabled,
        proPriceMonthlyNpr: settings.proPriceMonthlyNpr,
        proPriceYearlyNpr: settings.proPriceYearlyNpr,
        adminEsewaId: settings.adminEsewaId,
        fiscalYear: settings.fiscalYear,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '') || '';
    const user = getUserByToken(token);

    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized: Admin required' }, { status: 403 });
    }

    const updates = await request.json();
    const updated = updateSettings(updates);

    return NextResponse.json({
      success: true,
      settings: updated,
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
