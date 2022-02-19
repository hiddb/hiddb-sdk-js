import axios from "axios";
import { paths } from "./hiddb";

let accessToken: string;

// Make sure that the current accessToken is always included in requests
axios.interceptors.request.use(
  function (config) {
    return {
      ...config,
      headers: accessToken ? {
        ...(config.headers ?? {}),
        Authorization: `Bearer ${accessToken}`,
      }: config.headers,
    };
  },
  function (error) {
    return Promise.reject(error);
  }
);

const client = axios.create({
  baseURL: "https://api.hiddb.io/",
  timeout: 30000,
});

export async function userLogin(email: string, password: string) {
  const path = "/user/login" as const;
  const method = "post" as const;

  const body: paths[typeof path][typeof method]["requestBody"]["content"]["application/json"] =
    {
      email,
      password,
    };

  const response = await client[method]<
    paths[typeof path][typeof method]["responses"]["200"]["content"]["application/json"]
  >(path, body);

  // update accessToken
  accessToken = response.data;
}

export async function listDatabases() {
  const path = "/database" as const;
  const method = "get" as const;

  const response = await client[method]<
    paths[typeof path][typeof method]["responses"]["200"]["content"]["application/json"]
  >(path);

  return response.data;
}
