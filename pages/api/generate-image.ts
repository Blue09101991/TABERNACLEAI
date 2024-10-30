// pages/api/generate-image.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import FormData from 'form-data';

const STABILITY_API_URL = 'https://api.stability.ai/v2beta/stable-image/generate/sd3';

const startImageGeneration = async (image: Buffer, prompt: string, strength: number, style: string, apiKey: string) => {
  const formData = new FormData();
  formData.append('image', image, 'image.png'); // Assuming image is PNG for example
  formData.append('prompt', `Based this input image, A highly detailed and dramatic scene featuring a ${prompt}. The character is standing in a ${prompt}, illuminated by a subtle light source that highlights their ${prompt}. The overall atmosphere is ${prompt}, emphasizing the character's ${prompt}. The image style has to be ${style}.`);
  formData.append('strength', strength.toString());
  // formData.append('style', style);
  formData.append('mode', 'image-to-image');
  formData.append('output_format', 'png');

  const response = await axios.post(STABILITY_API_URL, formData, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: 'image/*',
      ...formData.getHeaders(),
    },
    responseType: 'arraybuffer',
  });

  return response;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  const { image, prompt, strength, style } = req.body;
  // console.log(image, prompt, strength, style);
  const apiKey = process.env.NEXT_PUBLIC_STABLEDIFFUSION_API;

  if (!apiKey) {
    res.status(500).json({ error: 'API key is not configured' });
    return;
  }

  try {
    const imageBuffer = Buffer.from(image.split(',')[1], 'base64'); // Decode base64 image

    const response = await startImageGeneration(imageBuffer, prompt, strength, style, apiKey);

    if (response.status === 200) {
      const base64Image = Buffer.from(response.data).toString('base64');
      res.status(200).json(`data:image/png;base64,${base64Image}`);
      console.log("Image has been generated!");
    } else {
      console.error(`Error: ${response.status}`, response.data);
      res.status(response.status).json({ error: response.data });
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error generating image:', error.message);
      res.status(500).json({ error: error.message });
    } else {
      console.error('Unexpected error:', error);
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }
}
