const axios = require('axios');

/**
 * Log a prompt details to the Notion database.
 * @param {Object} params
 * @param {string} params.name - Descriptive name of the prompt
 * @param {string} params.prompt - Exact prompt sent to LLM
 * @param {string} params.quality - Quality rating: '🟢 Excellent', '🟡 Good', '🟠 Fair', '🔴 Poor'
 * @param {string} params.suggestion - Actionable suggestions/improvements
 * @param {string[]} params.agents - Array of agent/component tags (e.g. ['Resume Builder'])
 */
const logPromptToNotion = async ({ name, prompt, quality = '🟢 Excellent', suggestion = '', agents = [] }) => {
  const token = process.env.NOTION_API_KEY || 'ntn_m28498838765gez91Z1Y2p7zkLZjPhC3CuCu5PmqDkr57a';
  const databaseId = process.env.NOTION_DATABASE_ID || '3980a9dd-c6e4-8078-a29b-fa33d457a070';

  if (!token || !databaseId) {
    console.warn('Notion API key or Database ID is missing. Skipping prompt logging.');
    return;
  }

  try {
    const payload = {
      parent: { database_id: databaseId },
      properties: {
        Name: {
          title: [
            {
              text: {
                content: name,
              },
            },
          ],
        },
        Prompt: {
          rich_text: [
            {
              text: {
                content: prompt.substring(0, 2000), // Notion rich text character limit limit check
              },
            },
          ],
        },
        'Prompt Quality': {
          select: {
            name: quality,
          },
        },
        Suggestion: {
          rich_text: [
            {
              text: {
                content: suggestion.substring(0, 2000),
              },
            },
          ],
        },
      },
    };

    // If Agent / Component property needs to be logged, add it if present
    if (agents && agents.length > 0) {
      payload.properties['Agent / Component'] = {
        multi_select: agents.map((agent) => ({ name: agent })),
      };
    }

    // Add logged date
    payload.properties['Date Logged'] = {
      date: {
        start: new Date().toISOString(),
      },
    };

    const response = await axios.post('https://api.notion.com/v1/pages', payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
    });

    console.log(`Successfully logged prompt "${name}" to Notion. Page ID: ${response.data.id}`);
    return response.data;
  } catch (error) {
    const errMsg = error.response ? JSON.stringify(error.response.data) : error.message;
    console.error(`Failed to log prompt "${name}" to Notion: ${errMsg}`);
  }
};

module.exports = {
  logPromptToNotion,
};
