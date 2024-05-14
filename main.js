import {HumanMessage} from '@langchain/core/messages';
import {ChatGoogleGenerativeAI} from '@langchain/google-genai';
import {HarmBlockThreshold, HarmCategory} from '@google/generative-ai';
import MarkdownIt from 'markdown-it';
import {maybeShowApiKeyBanner} from './gemini-api-banner';
import './style.css';

const form = document.querySelector('form');
const promptArea = document.querySelector('textarea');
const output = document.querySelector('.output');

form.onsubmit = async ev => {
  ev.preventDefault();
  output.textContent = 'Generating...';

  try {
    const contents = [
      new HumanMessage({
        content: [
          {
            type: 'text',
            text:  `Give me a dish that I can cook with the ingidents: ${promptArea.value}`,
          },
        ],
      }),
    ];

    // Call the gemini-pro-vision model, and get a stream of results
    const model = new ChatGoogleGenerativeAI({
      modelName: 'gemini-pro',
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
      ],
    });

    // Multi-modal streaming
    const streamRes = await model.stream(contents);

    // Read from the stream and interpret the output as markdown
    const buffer = [];
    const md = new MarkdownIt();

    for await (const chunk of streamRes) {
      buffer.push(chunk.content);
      output.innerHTML = md.render(buffer.join(''));
    }
  } catch (e) {
    output.innerHTML += '<hr>' + e;
  }
};

// You can delete this once you've filled out an API key
maybeShowApiKeyBanner(process.env.GOOGLE_API_KEY, `enter it in your <code>.env</code> file.`);

