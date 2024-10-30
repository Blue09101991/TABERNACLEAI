// export type OpenAIModel = 'gpt-3.5-turbo' | 'gpt-4';
export type OpenAIModel = 'gpt-3.5-turbo' | 'gpt-4' | 'limited' | 'plus' | 'pro' | 'uncensored' | 'premium';

export interface EssayBody {
  topic: string;
  paragraphs: 3 | 4 | 5;
  essayType:
  | ''
  | 'Argumentative'
  | 'Classic'
  | 'Persuasive'
  | 'Memoir'
  | 'Critique'
  | 'Compare/Contrast';
  model: OpenAIModel;
  apiKey?: string | undefined;
  apiKeyRepeater?: string | undefined;
}
export interface ChatBody {
  inputCode: string;
  model: OpenAIModel;
  apiKey?: string | undefined;
  responseLength: string;
}
export interface GenerateAI {
  inputCode: string;
  model: OpenAIModel;
  apiKey?: string | undefined;
  responseLength: string;
}
export interface SimplifierBody {
  content: string;
  model: OpenAIModel;
  apiKey?: string | undefined;
  apiKeyRepeater?: string | undefined;
  baseprompt: string;
}
export interface ProductDescriptionBody {
  name: string;
  keyBenefitsFeatures: string;
  model: OpenAIModel;
  apiKey?: string | undefined;
  apiKeyRepeater?: string | undefined;
}
export interface EmailEnhancerBody {
  topic: string;
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
  | 'Conversational';
  content: string;
  model: OpenAIModel;
  apiKey?: string | undefined;
  apiKeyRepeater?: string | undefined;
}
export interface LinkedinBody {
  topic: string;
  audience: string;
  model: OpenAIModel;
  apiKey?: string | undefined;
  apiKeyRepeater?: string | undefined;
}
export interface CaptionBody {
  topic: string;
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
  | 'Conversational';
  description: string;
  model: OpenAIModel;
  apiKey?: string | undefined;
  apiKeyRepeater?: string | undefined;
}
export interface FaqBody {
  topic: string;
  productType: string;
  model: OpenAIModel;
  apiKey?: string | undefined;
  apiKeyRepeater?: string | undefined;
}
export interface NameGeneratorBody {
  topic: string;
  productType: string;
  model: OpenAIModel;
  apiKey?: string | undefined;
  apiKeyRepeater?: string | undefined;
}
export interface SeoKeywordsBody {
  name: string;
  topics: string;
  model: OpenAIModel;
  apiKey?: string | undefined;
  apiKeyRepeater?: string | undefined;
}
export interface ReviewResponderBody {
  review: string;
  name: string;
  model: OpenAIModel;
  apiKey?: string | undefined;
  apiKeyRepeater?: string | undefined;
}
export interface BusinessGeneratorBody {
  topic:
  | ''
  | 'Art and Entertainment'
  | 'Business Equipment and Supplies'
  | 'Clothing and Accessories'
  | 'Food and Drink'
  | 'Hardware and Automotive'
  | 'Health and Beauty'
  | 'Home and Garden'
  | 'Internet and Technology'
  | 'Pet supplies'
  | 'Sports and Recreation'
  | 'Toys and Games'
  | 'Travel & Hospitality';
  productType: '' | 'Physical' | 'Digital' | 'Service';
  budget:
  | ''
  | 'Under $500'
  | '$500-$1000'
  | '$1000-$5000'
  | '$5000-$20,000'
  | '$20,000+';
  model: OpenAIModel;
  apiKey?: string | undefined;
  apiKeyRepeater?: string | undefined;
}
export interface ArticleBody {
  topic: string;
  title: string;
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
  | 'German';
  words: 200 | 300 | 400 | 500 | 600;
  model: OpenAIModel;
  apiKey?: string | undefined;
  apiKeyRepeater?: string | undefined;
}

export interface PlagiarismCheckerBody {
  content: string;
  model: OpenAIModel;
  apiKey?: string | undefined;
  apiKeyRepeater?: string | undefined;
}

export interface HashtagsGeneratorBody {
  content: string;
  model: OpenAIModel;
  apiKey?: string | undefined;
  apiKeyRepeater?: string | undefined;
}

export interface PetNameGeneratorBody {
  type: string;
  traits:
  | ''
  | 'Friendly'
  | 'Playful'
  | 'Energetic'
  | 'Intelligent'
  | 'Loyal'
  | 'Curious'
  | 'Affectionate'
  | 'Independent'
  | 'Calm'
  | 'Protective';
  gender: '' | 'Male' | 'Female' | 'Neutral';
  model: OpenAIModel;
  apiKey?: string | undefined;
  apiKeyRepeater?: string | undefined;
}

export interface TranslatorBody {
  content: string;
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
  | 'German';
  model: OpenAIModel;
  apiKey?: string | undefined;
  apiKeyRepeater?: string | undefined;
}

export interface DomainNameGeneratorBody {
  keywords: string;
  industry:
  | ''
  | 'Art and Entertainment'
  | 'Business Equipment and Supplies'
  | 'Clothing and Accessories'
  | 'Food and Drink'
  | 'Hardware and Automotive'
  | 'Health and Beauty'
  | 'Home and Garden'
  | 'Internet and Technology'
  | 'Pet supplies'
  | 'Sports and Recreation'
  | 'Toys and Games'
  | 'Travel & Hospitality';
  model: OpenAIModel;
  apiKey?: string | undefined;
  apiKeyRepeater?: string | undefined;
}

export interface BootstrapToTailwindConverterBody {
  content: string;
  model: OpenAIModel;
  apiKey?: string | undefined;
}
