export const getApiBaseUrl = () => {
  return process.env.NODE_ENV === "development"
    ? "http://localhost:8080/api"
    : "https://api.geekstack.dev/api";
};
