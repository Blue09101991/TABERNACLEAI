type RowObj = {
  prompt: string;
  template: string;
  date: string | Date;
  words: number;
  edit: string;
};

const tableDataCheck: RowObj[] = [
  {
    prompt: 'Artificial intelligence, commonly used',
    words: 563,
    template: '📝 Write an Essay',
    date: 'May 24, 2023',
    edit: 'false',
  },
  {
    prompt: 'Bitcoin is a special kind of online',
    words: 429,
    template: '👶 Content Simplifier',
    date: 'May 23, 2023',
    edit: 'false',
  },
  {
    prompt: 'Horizon AI Prompt Template is an product',
    words: 296,
    template: '🎯 Product Description',
    date: 'May 21, 2023',
    edit: 'true',
  },
  {
    prompt: 'Elevate your customer communi',
    words: 508,
    template: '📧 Email Enhancer',
    date: 'May 20, 2023',
    edit: 'true',
  },
  {
    prompt: 'Hello, Marcus! As a developer',
    words: 702,
    template: '💬 LinkedIn Message',
    date: 'May 20, 2023',
    edit: 'false',
  },
  {
    prompt: '"AI Prompt Template" is a tool',
    words: 443,
    template: '👶 Content Simplifier',
    date: 'May 18, 2023',
    edit: 'true',
  },
];

export default tableDataCheck;
