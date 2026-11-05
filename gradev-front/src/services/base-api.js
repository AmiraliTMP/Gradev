import axios from "axios";

const baseApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Centralized error handler
const handleApiError = (error) => {
  if (!error.response) {
    if (error.code === "ECONNABORTED") {
      throw {
        status: 408,
        message: "Request timeout. Please try again.",
      };
    }

    throw {
      status: 0,
      message: "Network error. Please check your connection.",
    };
  }

  const { status, data } = error.response;

  let message = data?.message || "An unexpected error occurred.";

  switch (status) {
    case 400:
      message = data?.message || "Bad request. Please check your input.";
      break;

    case 401:
      message = data?.message || "Unauthorized. Please log in.";
      break;

    case 403:
      message = data?.message || "You do not have permission.";
      break;

    case 404:
      message = data?.message || "The requested resource was not found.";
      break;

    case 409:
      message = data?.message || "A conflict occurred.";
      break;

    case 422:
      message = data?.message || "Validation failed.";
      break;

    case 429:
      message = data?.message || "Too many requests. Please try again later.";
      break;

    case 500:
      message = data?.message || "Internal server error.";
      break;

    case 502:
      message = "Bad gateway. The server is temporarily unavailable.";
      break;

    case 503:
      message = "Service unavailable. Please try again later.";
      break;

    default:
      message = data?.message || "Something went wrong.";
  }

  throw {
    status,
    message,
    data,
  };
};

// Centralized HTTP methods
export const get = async (url, config = {}) => {
  try {
    const { data } = await baseApi.get(url, config);
    return data;
  } catch (error) {
    handleApiError(error);
  }
};

export const post = async (url, body, config = {}) => {
  try {
    const { data } = await baseApi.post(url, body, config);
    return data;
  } catch (error) {
    handleApiError(error);
  }
};

export const put = async (url, body, config = {}) => {
  try {
    const { data } = await baseApi.put(url, body, config);
    return data;
  } catch (error) {
    handleApiError(error);
  }
};

export const patch = async (url, body, config = {}) => {
  try {
    const { data } = await baseApi.patch(url, body, config);
    return data;
  } catch (error) {
    handleApiError(error);
  }
};

export const del = async (url, config = {}) => {
  try {
    const { data } = await baseApi.delete(url, config);
    return data;
  } catch (error) {
    handleApiError(error);
  }
};

export default baseApi;
