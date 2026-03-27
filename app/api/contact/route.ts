import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

interface ContactPayload {
    name?: string;
    email?: string;
    message?: string;
}

const CONTACT_TO = process.env.CONTACT_TO_EMAIL || '29guerrero06@gmail.com';

function validatePayload(payload: ContactPayload): { ok: boolean; error?: string } {
    const name = payload.name?.trim() || '';
    const email = payload.email?.trim() || '';
    const message = payload.message?.trim() || '';

    if (!name) return { ok: false, error: 'El nombre es obligatorio' };
    if (!email) return { ok: false, error: 'El correo es obligatorio' };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, error: 'Correo inválido' };
    if (!message) return { ok: false, error: 'El mensaje es obligatorio' };

    return { ok: true };
}

function buildTransporter() {
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 587);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!host || !user || !pass) {
        return null;
    }

    return nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
    });
}

function getMissingSmtpVars(): string[] {
    const required = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS'] as const;
    return required.filter((key) => !process.env[key]?.trim());
}

export async function POST(req: Request) {
    try {
        const payload = (await req.json()) as ContactPayload;
        const validation = validatePayload(payload);
        if (!validation.ok) {
            return NextResponse.json({ error: validation.error }, { status: 400 });
        }

        const transporter = buildTransporter();
        if (!transporter) {
            const missing = getMissingSmtpVars();
            return NextResponse.json(
                {
                    error: `El formulario no está configurado en el servidor. Faltan: ${missing.join(', ')}.`,
                },
                { status: 500 }
            );
        }

        const safeName = payload.name!.trim();
        const safeEmail = payload.email!.trim();
        const safeMessage = payload.message!.trim();

        await transporter.sendMail({
            from: process.env.CONTACT_FROM_EMAIL || process.env.SMTP_USER,
            to: CONTACT_TO,
            replyTo: safeEmail,
            subject: `Nuevo mensaje desde formulario: ${safeName}`,
            text: `Nombre: ${safeName}\nCorreo: ${safeEmail}\n\nMensaje:\n${safeMessage}`,
            html: `
                <h2>Nuevo mensaje desde formulario web</h2>
                <p><strong>Nombre:</strong> ${safeName}</p>
                <p><strong>Correo:</strong> ${safeEmail}</p>
                <p><strong>Mensaje:</strong></p>
                <p>${safeMessage.replace(/\n/g, '<br/>')}</p>
            `,
        });

        return NextResponse.json({ ok: true });
    } catch {
        return NextResponse.json({ error: 'No se pudo procesar el formulario' }, { status: 500 });
    }
}
