import Anthropic from "@anthropic-ai/sdk";

const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY as string;

export const anthropic = new Anthropic({
  apiKey: apiKey || "placeholder",
  dangerouslyAllowBrowser: true,
});
