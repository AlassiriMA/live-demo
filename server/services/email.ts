import axios from 'axios';

// Email configuration
const IMPROVMX_API_KEY = process.env.SENDGRID_API_KEY; // Using the SENDGRID_API_KEY env variable
const IMPROVMX_API_URL = 'https://app.improvmx.com/api/v3/forward';
const TARGET_EMAIL = 'alassirimail@gmail.com'; // The email to forward to

/**
 * Email service using ImprovMX for email handling
 * - Configured to forward contact form submissions to alassirimail@gmail.com
 * - Uses axios for API requests
 */
export interface EmailData {
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
  source?: string;
}

/**
 * Send an email using ImprovMX API
 * @param data Email data including sender, subject and message
 * @returns Response from the email API
 */
export async function sendEmail(data: EmailData): Promise<any> {
  if (!IMPROVMX_API_KEY) {
    throw new Error('IMPROVMX_API_KEY (set as SENDGRID_API_KEY) environment variable is not set');
  }
  
  try {
    // Log email attempt
    console.log(`Sending email from ${data.email} with subject: ${data.subject}`);
    
    // Format the message with all the form data
    const formattedMessage = `
      New message from your portfolio website:
      
      Name: ${data.name}
      Email: ${data.email}
      ${data.phone ? `Phone: ${data.phone}` : ''}
      ${data.source ? `Source: ${data.source}` : ''}
      
      Subject: ${data.subject}
      
      Message:
      ${data.message}
    `;
    
    // Prepare the request data
    const emailData = {
      from: 'contact@alassiri.nl', // Assuming you own this domain in ImprovMX
      to: TARGET_EMAIL,
      subject: `Portfolio Contact: ${data.subject}`,
      text: formattedMessage,
      replyTo: data.email // Enable direct reply to the sender
    };
    
    // Make API request to ImprovMX
    const response = await axios.post(IMPROVMX_API_URL, emailData, {
      headers: {
        'Authorization': `Bearer ${IMPROVMX_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Email sent successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to send email:', error);
    
    // Be careful not to expose API keys in error messages
    if (axios.isAxiosError(error)) {
      const sanitizedError = {
        message: error.message,
        response: error.response ? {
          status: error.response.status,
          data: error.response.data,
        } : undefined,
      };
      throw new Error(`Email sending failed: ${JSON.stringify(sanitizedError)}`);
    }
    
    throw error;
  }
}