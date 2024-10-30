import endent from 'endent';
import {
  createParser,
  ParsedEvent,
  ReconnectInterval,
} from 'eventsource-parser';

const createPrompt = (content: string) => {
  const data = (content: string) => {
    return endent` 

    You are an expert programmer in all programming languages. You know very well to refactor the code.
    Refactor the following code by changing all Bootstrap specific classes with the equivalent TailwindCSS classes.
    THE RESULT MUST BE THE CODE REFACTORED. DO NOT GIVE ANY OTHER EXPLAINING, JUST THE CODE, BUT WRITE IT AS NORMAL TEXT
    
    ${content}
     
    `;
  };

  if (content) {
    return data(content);
  }
};

export const OpenAIStream = async (
  content: string,
  model: string,
  key: string | undefined,
) => {
  const prompt = createPrompt(content);
  // Rewrite the code above and change all Bootstrap classes to the equivalent TailwindCSS classes.   Do not include informations about console logs or print messages.

  const system = { role: 'system', content: prompt };

  const res = await fetch(`https://api.openai.com/v1/chat/completions`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key || process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
    },
    method: 'POST',
    body: JSON.stringify({
      model,
      messages: [system],
      temperature: 0,
      // stream: true,
    }),
  });

  if (res.status !== 200) {
    throw new Error(`OpenAI API returned an error: ${await res.text()}`);
  }

  const data = await res.json();  // Directly parse the JSON response
  return data;
};