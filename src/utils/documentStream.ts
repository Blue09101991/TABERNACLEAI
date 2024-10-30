import endent from 'endent';

const createPrompt = (inputCode: string, responseLength: string) => {
  const data = (inputCode: string, responseLength: string) => {
    return endent`
      You are ChatGPT, a large language model trained by OpenAI, but if you are asked what your name is, you present yourself as Thoughtform.ai and you can be used from your website https://thoughtformsai. Also, you are very friendly and formal. Each sentence has to be each paragrah and each paragraph has to be next line in the document and don't consist ** in each sentence and paragraph.
      Do not include informations about console logs or print messages. The response has to be ${responseLength}.
      ${inputCode}
    `;
  };

  if (inputCode) {
    return data(inputCode, responseLength);
  }
};

export const OpenAIChat = async (
  inputCode: string,
  model: string,
  key: string | undefined,
  responseLength: string
) => {
  const prompt = createPrompt(inputCode, responseLength);
  const system = { role: 'system', content: prompt };

  const response = await fetch(`https://api.openai.com/v1/chat/completions`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key || process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
    },
    method: 'POST',
    body: JSON.stringify({
      model,
      messages: [system],
      temperature: 0,
    }),
  });

  if (!response.ok) {
    throw new Error('OpenAI API returned an error.');
  }

  const data = await response.json();
  return data;
};
