import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';

export async function POST(req: Request) {
    try {
        const { username, password } = await req.json();

        if (!username || !password) {
            return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
        }

        // Allow login with email or username
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { username: username },
                    { email: username }
                ]
            }
        });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY || 'super-secret-key-change-in-production');
        const token = await new SignJWT({ username: user.username, email: user.email })
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('24h')
            .sign(secret);

        return NextResponse.json({
            message: 'Login successful',
            access_token: token,
            user: { username: user.username, email: user.email }
        });
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
}
