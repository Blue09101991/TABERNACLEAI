import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

const baseUrl = "https://api.sunoaiapi.com/api/v1/gateway";
const apiKey = process.env.SUNOAI_API;

const headers = {
    "api-key": apiKey,
};

const queryClips = async (ids: string) => {
    console.log(`Querying clips with ids: ${ids}`);
    const response = await axios.get(`${baseUrl}/query?ids=${ids}`, { headers });
    console.log('Query response:', response.data);
    return response.data;
};

const generateGpt = async (prompt: string) => {
    console.log(`Generating GPT description with prompt: ${prompt}`);
    const data = {
        "gpt_description_prompt": prompt,
        "make_instrumental": false,
    };
    const response = await axios.post(`${baseUrl}/generate/gpt_desc`, data, { headers });
    console.log('Generate GPT response:', response.data);
    return response.data;
};

const pollClips = async (ids: string, interval: number = 5000) => {
    while (true) {
        const response = await queryClips(ids);
        const result = response;
        console.log(`Polling result:`, result);

        for (const clip of result) {
            if (clip.status === "complete") {
                console.log(`clip ${clip.id} is done`);
                console.log(clip);
            } else {
                console.log(`clip ${clip.id} is not done, status -> ${clip.status}`);
            }
        }

        const allComplete = result.every((clip: any) => clip.status === 'complete');
        if (allComplete) {
            return result;
        }

        await new Promise(resolve => setTimeout(resolve, interval));
    }
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { body, method } = req;
    console.log(`Received ${method} request with body:`, body);

    if (method === 'POST') {
        const { prompt } = body;
        try {
            // Step 1: Generate GPT
            const clipsData = await generateGpt(prompt);
            console.log('clips data ->', clipsData);

            // Step 2: Extract clip IDs
            const ids = clipsData.data.map((clip: any) => clip.song_id).join(',');
            console.log('ids ->', ids);

            // Step 3: Poll the clip status until all clips are complete
            const completedClips = await pollClips(ids);

            console.log('Completed clips:', completedClips);

            // Step 4: Respond with completed clips
            res.status(200).json(completedClips);
        } catch (error: any) {
            console.error('Error handling POST request:', error);
            res.status(500).json({ error: 'Internal Server Error', details: error.message });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
};
