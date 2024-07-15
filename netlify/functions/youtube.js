const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  const key = process.env.YOUTUBE_API_KEY;
  const videoID = event.queryStringParameters.videoID;
  const apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoID}&key=${key}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error fetching video data' }),
    };
  }
};
