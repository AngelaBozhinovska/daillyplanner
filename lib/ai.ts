const OPENROUTER_API_KEY = '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';

export async function generatePlan(prompt: string): Promise<string> {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://stackblitz.com',
        'X-Title': 'Day Planner App'
      },
      body: JSON.stringify({
        model: 'google/gemma-3-27b-it',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful AI assistant that helps people plan their day effectively. Provide concise, actionable advice.'
          },
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response format from API');
    }

    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating plan:', error);
    throw new Error('Failed to generate plan. Please try again.');
  }
}