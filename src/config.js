export const config = {
  debugMode: false,
  apiKey: "",
};

export const fetchConfig = {
  baseUrl: "https://api.curseforge.com/",
  headers: {
    "x-api-key": config.apiKey,
    Accept: "application/json",
  },
};
