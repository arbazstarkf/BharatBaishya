import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, phone, email, date, time, location, reason } = body;

    // Create transporter (configure with your SMTP settings)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_EMAIL || 'drbharatbaishya@gmail.com',
        pass: process.env.SMTP_PASSWORD || '',
      },
    });

    // Email to doctor
    const doctorMail = {
      from: `"Dr. Bharat Baishya Website" <${process.env.SMTP_EMAIL || 'noreply@drbharatassam.com'}>`,
      to: 'drbharatbaishya@gmail.com',
      subject: `New Appointment Request from ${name}`,
      html: `
        <div style="font-family: 'Poppins', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #0d9488, #1e40af); padding: 20px; border-radius: 12px 12px 0 0; color: white;">
            <h2 style="margin: 0;">🩺 New Appointment Request</h2>
          </div>
          <div style="background: #f8fafc; padding: 24px; border: 1px solid #e2e8f0; border-radius: 0 0 12px 12px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; font-weight: 600; color: #475569;">Patient Name:</td><td style="padding: 8px 0;">${name}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: 600; color: #475569;">Phone:</td><td style="padding: 8px 0;"><a href="tel:${phone}">${phone}</a></td></tr>
              ${email ? `<tr><td style="padding: 8px 0; font-weight: 600; color: #475569;">Email:</td><td style="padding: 8px 0;">${email}</td></tr>` : ''}
              <tr><td style="padding: 8px 0; font-weight: 600; color: #475569;">Preferred Date:</td><td style="padding: 8px 0;">${date}</td></tr>
              ${time ? `<tr><td style="padding: 8px 0; font-weight: 600; color: #475569;">Preferred Time:</td><td style="padding: 8px 0;">${time}</td></tr>` : ''}
              <tr><td style="padding: 8px 0; font-weight: 600; color: #475569;">Location:</td><td style="padding: 8px 0;">${location}</td></tr>
              ${reason ? `<tr><td style="padding: 8px 0; font-weight: 600; color: #475569;">Reason:</td><td style="padding: 8px 0;">${reason}</td></tr>` : ''}
            </table>
          </div>
        </div>
      `,
    };

    // Confirmation email to patient (if email provided)
    const patientMail = email ? {
      from: `"Dr. Bharat Baishya" <${process.env.SMTP_EMAIL || 'noreply@drbharatassam.com'}>`,
      to: email,
      subject: 'Appointment Request Received - Dr. Bharat Baishya',
      html: `
        <div style="font-family: 'Poppins', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #0d9488, #1e40af); padding: 20px; border-radius: 12px 12px 0 0; color: white; text-align: center;">
            <h2 style="margin: 0;">Appointment Request Received</h2>
          </div>
          <div style="background: #f8fafc; padding: 24px; border: 1px solid #e2e8f0; border-radius: 0 0 12px 12px;">
            <p>Dear ${name},</p>
            <p>Thank you for requesting an appointment with <strong>Dr. Bharat Baishya</strong>.</p>
            <p>We have received your request for <strong>${date}</strong> at <strong>${location}</strong>.</p>
            <p>Our team will contact you shortly on <strong>${phone}</strong> to confirm your appointment.</p>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
            <p style="color: #64748b; font-size: 14px;">
              📞 Phone: +91 9854004813<br>
              📧 Email: drbharatbaishya@gmail.com<br>
              📍 Rangia, Kamrup, Assam
            </p>
          </div>
        </div>
      `,
    } : null;

    // Send emails
    if (process.env.SMTP_PASSWORD) {
      await transporter.sendMail(doctorMail);
      if (patientMail) {
        await transporter.sendMail(patientMail);
      }
    }

    return Response.json({ success: true, message: 'Appointment request submitted successfully' });
  } catch (error) {
    console.error('Appointment API error:', error);
    return Response.json(
      { success: false, message: 'Failed to process appointment request' },
      { status: 500 }
    );
  }
}
