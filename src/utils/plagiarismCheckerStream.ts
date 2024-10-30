import endent from 'endent';
import {
  createParser,
  ParsedEvent,
  ReconnectInterval,
} from 'eventsource-parser';

const createPrompt = (content: string) => {
  const data = (content: string) => {
    return endent`
    You are an expert content plagiarism checker in all languages.
    You know very well what plagiarism of a content is. You know very well if a content is plagiarism-free or not. You will check all sources to verify if the given sentence or content is plagiarized or plagiarism-free. Is the following content: ${content}, plagiarism-free? Reply with "Your content is plagiarized!" if the content is plagiarized, and explain why and from where. Reply with "Your content is plagiarism-free!" if the content is plagiarism-free, and explain why.
    The generated response must be in markdown format but not rendered, it must include all markdown characteristics. The title must be bold, and there should be a &nbsp between every paragraph.
    Do not include informations about console logs or print messages.
    `;
  };

  if (content) {
    return data(content);
  }
};

export const OpenAIStream = async (
  content: string,
  model: string,
  apiKey: string,
): Promise<any> => {

  let headers: Record<string, string> = {};
  let endpoint: string = '';
  let body: any;

  const prompt = createPrompt(content);

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