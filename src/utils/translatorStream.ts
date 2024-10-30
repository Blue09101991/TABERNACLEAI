import endent from 'endent';
import {
  createParser,
  ParsedEvent,
  ReconnectInterval,
} from 'eventsource-parser';

const createPrompt = (
  content: string,
  language:
    | ''
    | 'English'
    | 'Chinese'
    | 'Spanish'
    | 'Arabic'
    | 'Hindi'
    | 'Italian'
    | 'Portuguese'
    | 'Russian'
    | 'Japanese'
    | 'Romanian'
    | 'German',
) => {
  const data = (
    content: string,
    language:
      | ''
      | 'English'
      | 'Chinese'
      | 'Spanish'
      | 'Arabic'
      | 'Hindi'
      | 'Italian'
      | 'Portuguese'
      | 'Russian'
      | 'Japanese'
      | 'Romanian'
      | 'German',
  ) => {
    return endent`
      You are an expert translator.
      You know very well all languages and to translate the content you receive. Translate in ${language} language the following content: ${content}.
      The content must be in markdown format but not rendered, it must include all markdown characteristics. There should be a &nbsp between every paragraph.
      Do not include informations about console logs or print messages.
    `;
  };

  if (content) {
    return data(content, language);
  }
};

export const OpenAIStream = async (
  content: string,
  language:
    | ''
    | 'English'
    | 'Chinese'
    | 'Spanish'
    | 'Arabic'
    | 'Hindi'
    | 'Italian'
    | 'Portuguese'
    | 'Russian'
    | 'Japanese'
    | 'Romanian'
    | 'German',
  model: string,
  apiKey: string,
): Promise<any> => {

  let headers: Record<string, string> = {};
  let endpoint: string = '';
  let body: any;

  const prompt = createPrompt(content, language);

  const system = { role: 'system', content: prompt };

  console.log(model);

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
    endpoint = 'https://71hyxnzmktbdyi-5000.proxy.runpod.net/generate0';
    body = JSON.stringify({ prompt: prompt });
  } else if (model === 'pro' || model === 'premium') {
    headers = {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
    };
    endpoint = 'https://71hyxnzmktbdyi-5000.proxy.runpod.net/generate1';
    body = JSON.stringify({ prompt: prompt });
  } else if (model === 'uncensored') {
    headers = {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
    };
    endpoint = 'https://71hyxnzmktbdyi-5000.proxy.runpod.net/generate2';
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