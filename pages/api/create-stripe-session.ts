// pages/api/create-stripe-session.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { firestore } from '../../config/firebase';
import { doc, getDoc } from "firebase/firestore";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { amount, userEmail } = req.body; // Include userEmail in the request body

    // Convert the amount to cents and ensure it's a valid number
    const unit_amount = Number(amount) * 100;
    if (!unit_amount || !userEmail) {
      res.status(400).json({ error: 'Invalid amount provided or userEmail missing.' });
      return;
    }

    try {
      const docRef = doc(firestore, 'price', 'paymentmethod');
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        res.status(500).json({ error: 'Stripe secret key not found.' });
        return;
      }

      const data = docSnap.data();
      const stripeSecretKey = data.STRIPE_SECRET_KEY;

      if (!stripeSecretKey) {
        res.status(500).json({ error: 'Stripe secret key not found.' });
        return;
      }

      const stripe = new Stripe(stripeSecretKey, {
        apiVersion: '2023-10-16',
      });

      // Calculate the number of tokens based on the amount, or directly use the amount
      const tokensToAdd = calculateTokens(unit_amount); // Implement this function based on your logic

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Credits Purchase',
              // Optionally, add more product details here
            },
            unit_amount,
          },
          quantity: 1,
        }],
        mode: 'payment',
        success_url: `${req.headers.origin}/my-plan?success=true&session_id={CHECKOUT_SESSION_ID}&chosenPrice=${unit_amount / 100}`,
        cancel_url: `${req.headers.origin}/my-plan`,
        metadata: {
          userEmail,
          tokensToAdd: tokensToAdd.toString(), // Store as string in metadata
        },
      });

      res.status(200).json({ sessionId: session.id });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ statusCode: 500, message: error.message });
      } else {
        res.status(500).json({ statusCode: 500, message: 'An unknown error occurred' });
      }
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}

function calculateTokens(amountInCents: number): number {
  // Example calculation, adjust based on your pricing model
  return amountInCents / 100; // 1 token per cent for example
}
