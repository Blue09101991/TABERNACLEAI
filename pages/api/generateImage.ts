// pages/api/generateImage.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import FormData from 'form-data';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  const { prompt, negative_prompt, aspect_ratio, model, seed, output_format, numberOfImages } = req.body;

  if (!prompt || !numberOfImages) {
    res.status(400).json({ error: 'Prompt and number of images are required' });
    return;
  }

  const apiKey = process.env.NEXT_PUBLIC_STABLEDIFFUSION_API;

  if (!apiKey) {
    res.status(500).json({ error: 'API key is not configured' });
    return;
  }

  try {
    const images: string[] = [];
    for (let i = 0; i < numberOfImages; i++) {
      const formData = new FormData();
      formData.append('prompt', prompt);
      formData.append('negative_prompt', negative_prompt || '');
      formData.append('aspect_ratio', aspect_ratio || '1:1');
      formData.append('model', model || 'sd3');
      formData.append('seed', seed?.toString() || '0');
      formData.append('output_format', output_format || 'jpeg');

      const response = await axios.post(
        'https://api.stability.ai/v2beta/stable-image/generate/sd3',
        formData,
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            Accept: 'image/*',
            ...formData.getHeaders(),
          },
          responseType: 'arraybuffer',
          timeout: 300000, // Set timeout to 5 minutes
        }
      );

      if (response.status === 200) {
        const base64Image = Buffer.from(response.data).toString('base64');
        images.push(`data:image/${output_format};base64,${base64Image}`);
      } else {
        throw new Error(`${response.status}: ${response.data.toString()}`);
      }
    }

    res.status(200).json({ images });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error generating images:', error.message);
      console.error('Error details:', error.response?.data);
      res.status(500).json({ error: error.message });
    } else {
      console.error('Unexpected error:', error);
      res.status(500).json({ error: 'An unexpected error occurred. Please try again.' });
    }
  }
}
