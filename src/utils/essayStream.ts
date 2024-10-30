import endent from 'endent';
import {
  createParser,
  ParsedEvent,
  ReconnectInterval,
} from 'eventsource-parser';

// import fetch from 'node-fetch';

const createPrompt = (topic: string, paragraphs: number, essayType: string) => {
  const data = (topic: any, paragraphs: number, essayType: string) => {
    return endent`
      You are an expert formal essay writer and generator.
      You know very well all types of essays. Generate an formal ${essayType} essay about ${topic}, which has a number of ${paragraphs} paragraphs. 
      The essay must be in markdown format but not rendered, it must include all markdown characteristics.The title must be bold, and there should be a &nbsp between every paragraph.
      Do not include informations about console logs or print messages.
    `;
  };

  if (essayType) {
    return data(topic, paragraphs, essayType);
  }
};

export const OpenAIStream = async (
  topic: string,
  essayType: string,
  paragraphs: number,
  model: string,
  apiKey: string,
): Promise<any> => {

  let headers: Record<string, string> = {};
  let endpoint: string = '';
  let body: any;

  const prompt = createPrompt(topic, paragraphs, essayType);
  const system = { role: 'system', content: prompt };

  console.log(model);

  const backendApiUrl = process.env.BACKEND_API_URL;

  if (!backendApiUrl) {
    throw new Error('The CUSTOM_API_URL is not defined in your environment.');
  }

  if (model === 'gpt-3.5-turbo') {
    headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    };
    endpoint = `https://api.openai.com/v1/chat/completions`;
    body = JSON.stringify({
      model,
      messages: [system],
      // max_tokens: 500,
      temperature: 0,

    });
  } else if (model === 'limited' || model === 'plus') {
    headers = {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
    };
    endpoint = `${backendApiUrl}/generate0`;
    body = JSON.stringify({ prompt: prompt });
  } else if (model === 'pro' || model === 'premium') {
    headers = {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
    };
    endpoint = `${backendApiUrl}/generate1`;
    body = JSON.stringify({ prompt: prompt });
  } else if (model === 'uncensored') {
    headers = {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
    };
    endpoint = `${backendApiUrl}/generate2`;
    body = JSON.stringify({ prompt: prompt });
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: headers,
    body: body,
  });

  if (!response.ok) {
    throw new Error(`API call failed with status ${response.status}: ${await response.text()}`);
  }

  const data = await response.json();

  if (model === 'limited' || model === 'plus' || model === 'pro' || model === 'premium' || model === 'uncensored' && data.generated_text) {
    // Remove the prompt from the response
    data.generated_text = data.generated_text.replace(prompt, '').trim();
  }

  return data;
};