// Try ports 5000 through 5004
const findActivePort = async () => {
  for (let port = 5000; port <= 5004; port++) {
    try {
      const response = await fetch(`http://localhost:${port}/api/test`);
      if (response.ok) {
        return port;
      }
    } catch (error) {
      continue;
    }
  }
  throw new Error("No active server found on ports 5000-5004");
};

let API_BASE_URL = null;

const getApiUrl = async () => {
  if (!API_BASE_URL) {
    const port = await findActivePort();
    API_BASE_URL = `http://localhost:${port}/api`;
  }
  return API_BASE_URL;
};

export const sendMessage = async (prompt) => {
  try {
    const apiUrl = await getApiUrl();

    const response = await fetch(`${apiUrl}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();
    console.log("API Response:", data);

    if (!response.ok) {
      return {
        response:
          data.response || "An error occurred while processing your request.",
        error: true,
      };
    }

    return {
      response: data.response,
      error: false,
    };
  } catch (error) {
    console.error("API Error:", error);
    return {
      response: "An error occurred while processing your request.",
      error: true,
    };
  }
};

export const testConnection = async () => {
  try {
    const apiUrl = await getApiUrl();
    const response = await fetch(`${apiUrl}/test`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Test Connection Error:", error);
    throw error;
  }
};
