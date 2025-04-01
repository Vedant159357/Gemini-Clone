const API_BASE_URL = import.meta.env.VITE_API_URL;

export const sendMessage = async (prompt) => {
  try {
    const response = await fetch(`${API_BASE_URL}/chat`, {
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
    const response = await fetch(`${API_BASE_URL}/test`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Test Connection Error:", error);
    throw error;
  }
};
