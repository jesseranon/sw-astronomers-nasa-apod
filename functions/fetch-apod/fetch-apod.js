const axios = require('axios');

const handler = async (event) => {
  const {date} = event.queryStringParameters;

  const API_SECRET = process.env.API_SECRET;
  const url = `https://api.nasa.gov/planetary/apod?api_key=${API_SECRET}&date=${date}`;
  try {
    const {data} = await axios.get(url);
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    }
  } catch (error) {
    const {status, statusText, headers, data} = error.response;
    return {
      statusCode: status,
      body: JSON.stringify({status, statusText, headers, data}),
    }
  }
}

module.exports = { handler }
