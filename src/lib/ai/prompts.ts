/**
 * Configurable Prompt Registry for AR AI Image Generation
 *
 * This file centralizes all prompts used for transforming standard product images
 * into high-end augmented-reality (AR) luxury presentation images.
 */

export interface ArPromptConfig {
  basePrompt: string;
  lightingInstructions: string;
  environmentInstructions: string;
  preservationConstraints: string;
}

export const DEFAULT_AR_PROMPT_CONFIG: ArPromptConfig = {
  basePrompt:
    "Transform the provided handcrafted jewelry product image into a high-end, photorealistic augmented-reality (AR) 3D luxury presentation.",
  preservationConstraints:
    "Strictly preserve the exact identity, geometry, silver engravings, gemstones, colors, proportions, and craftsmanship of the original jewelry piece. Do NOT alter the stone color, metal finish, or intrinsic design.",
  environmentInstructions:
    "Place the piece floating or resting elegantly upon a minimalist luxury pedestal crafted from Nero Marquina black marble with subtle gold foil accents, or suspended in a spatial AR showcase environment with soft atmospheric ambient occlusion.",
  lightingInstructions:
    "Utilize cinematic ray-traced jewelry studio lighting with crisp specular reflections on the 925 sterling silver, deep natural contact shadows, rich refraction through the gemstone, and subtle depth-of-field blur. It should look like an ultra-crisp augmented reality spatial visualization.",
};

/**
 * Builds the complete unified prompt sent to Google Gemini Nano Banana
 */
export function buildArGenerationPrompt(customPrompt?: string): string {
  if (customPrompt && customPrompt.trim().length > 0) {
    return customPrompt.trim();
  }

  const { basePrompt, preservationConstraints, environmentInstructions, lightingInstructions } =
    DEFAULT_AR_PROMPT_CONFIG;

  return `${basePrompt} ${preservationConstraints} ${environmentInstructions} ${lightingInstructions}`.trim();
}
