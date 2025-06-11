import { NextResponse } from 'next/server';

export async function GET() {
    try {
        return NextResponse.json({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            service: 'ProspectPulse API',
            version: '1.0.0',
            environment: process.env.NODE_ENV || 'development'
        });
    } catch (error) {
        return NextResponse.json(
            { 
                status: 'error', 
                message: 'Health check failed',
                timestamp: new Date().toISOString()
            },
            { status: 500 }
        );
    }
}
