import axios from "axios";

const baseApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Centralized error handler
const handleApiError = (error) => {
  if (!error.response) {
    if (error.code === "ECONNABORTED") {
      throw Object.assign(new Error("Request timeout. Please try again."), {
        status: 408,
      });
    }

    throw Object.assign(
      new Error("Network error. Please check your connection."),
      { status: 0 },
    );
  }

  const { status, data } = error.response;

  const messages = {
    400: "Bad request. Please check your input.",
    401: "Unauthorized. Please log in.",
    403: "You do not have permission.",
    404: "The requested resource was not found.",
    409: "A conflict occurred.",
    422: "Validation failed.",
    429: "Too many requests. Please try again later.",
    500: "Internal server error.",
    502: "Bad gateway. The server is temporarily unavailable.",
    503: "Service unavailable. Please try again later.",
  };

  const message = data?.message || messages[status] || "Something went wrong.";

  throw Object.assign(new Error(message), {
    status,
    data,
  });
};

// GET
export const get = async (url, config = {}) => {
  try {
    const { data } = await baseApi.get(url, config);
    return data;
  } catch (error) {
    handleApiError(error);
  }
};

// POST
export const post = async (url, body, config = {}) => {
  try {
    const { data } = await baseApi.post(url, body, config);
    return data;
  } catch (error) {
    handleApiError(error);
  }
};

// PUT
export const put = async (url, body, config = {}) => {
  try {
    const { data } = await baseApi.put(url, body, config);
    return data;
  } catch (error) {
    handleApiError(error);
  }
};

// PATCH
export const patch = async (url, body, config = {}) => {
  try {
    const { data } = await baseApi.patch(url, body, config);
    return data;
  } catch (error) {
    handleApiError(error);
  }
};

// DELETE
export const del = async (url, config = {}) => {
  try {
    const { data } = await baseApi.delete(url, config);
    return data;
  } catch (error) {
    handleApiError(error);
  }
};

export default baseApi;
