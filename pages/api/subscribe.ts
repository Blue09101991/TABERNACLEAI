import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

type Data = {
  message: string;
  error?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    console.log(req.body);
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, name, message } = req.body;
  const url = `https://${process.env.MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${process.env.MAILCHIMP_LIST_ID}/members`;

  try {
    await axios.post(url, {
      email_address: email,
      status: 'subscribed',
      merge_fields: { FNAME: name, MESSAGE: message }
    }, {
      auth: { username: 'Jason LaBossiere', password: process.env.MAILCHIMP_API_KEY! }
    });

    res.status(200).json({ message: 'Subscription successful' });
  } catch (error: any) {
    console.error('Mailchimp subscription error:', error.response?.data);
    res.status(500).json({ message: 'Subscription failed', error: error.message || 'An unknown error occurred' });
  }
}
