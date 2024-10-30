import endent from 'endent';
import {
  createParser,
  ParsedEvent,
  ReconnectInterval,
} from 'eventsource-parser';

const createPrompt = (
  topic: string,
  toneOfVoice:
    | ''
    | 'Formal'
    | 'Informal'
    | 'Humorous'
    | 'Serious'
    | 'Optimistic'
    | 'Motivating'
    | 'Respectful'
    | 'Assertive'
    | 'Conversational',
  content: string,
) => {
  const data = (
    topic: string,
    toneOfVoice:
      | ''
      | 'Formal'
      | 'Informal'
      | 'Humorous'
      | 'Serious'
      | 'Optimistic'
      | 'Motivating'
      | 'Respectful'
      | 'Assertive'
      | 'Conversational',
    content: string,
  ) => {
    return endent`
      You are an expert at enhancing emails and making them compelling & high converting.
      You know very well how to enhance an email. Enchance the following email ${content} and make it for ${topic} topic with a ${toneOfVoice} tone of voice. 
      The generated content must be in markdown format but not rendered, it must include all markdown characteristics.The title must be bold, and there should be a &nbsp between every paragraph.
      Do not include informations about console logs or print messages.
    `;
  };

  if (topic) {
    return data(topic, toneOfVoice, content);
  }
};

export const OpenAIStream = async (
  topic: string,
  toneOfVoice:
    | ''
    | 'Formal'
    | 'Informal'
    | 'Humorous'
    | 'Serious'
    | 'Optimistic'
    | 'Motivating'
    | 'Respectful'
    | 'Assertive'
    | 'Conversational',
  content: string,
  model: string,
  apiKey: string,
): Promise<any> => {

  let headers: Record<string, string> = {};
  let endpoint: string = '';
  let body: any;

  const prompt = createPrompt(topic, toneOfVoice, content);

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