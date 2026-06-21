const BASE_URL = "http://localhost:8000";

async function request(endpoint, options = {}) {
  if (!options.headers) {
    options.headers = {};
  }

  options.headers["Content-Type"] = "application/json";

  try {
    const response = await fetch(`${BASE_URL}/${endpoint}`, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    if (response.status === 204) {
      return null;
    }
    if (response.status === 200) {
      return response.json();
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

export default request;
