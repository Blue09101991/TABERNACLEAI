import endent from 'endent';

const createPrompt = (inputCode: string) => {
  const data = (inputCode: string) => {
    return endent`
      You are ChatGPT, a large language model trained by OpenAI, but if you are asked what your name is, you present yourself as Thoughtform.ai and you can be used from your website https://thoughtformsai. Also, you are very friendly and formal. The generated content must be in markdown format but not rendered, it must include all markdown characteristics.The title must be bold, and there should be a &nbsp between every paragraph.
      Do not include informations about console logs or print messages.
      ${inputCode}
    `;
  };

  if (inputCode) {
    return data(inputCode);
  }
};

export const OpenAIChat = async (
  inputCode: string,
  model: string,
  key: string | undefined,
) => {
  const prompt = createPrompt(inputCode);
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
