import axios from "axios";
import Cookies from 'js-cookie';
import jwtDecode from 'jwt-decode';
import { paths } from "./hiddb";

type JWT = {
  sub: string,
  amr: [string],  // possible values: password, refresh_token, otp
  scope: string,
  email: string,
  email_verified: boolean,
  role: string,
  plan: string,
  organization: string
};

let loginCallback: (jwt: JWT) => void;
let logoutCallback: () => void;

const state = {
  _accessToken: '',
  _decoded: {},
  _refresh: undefined,

  get accessToken() {
    return this._accessToken;
  },
  set accessToken(accessToken) {
    this._decoded = jwtDecode(accessToken);
    if (loginCallback && typeof loginCallback === 'function' && !this._accessToken && accessToken) {
      try {
        loginCallback(this._decoded);
      } catch (_error) { }
    }
    this._accessToken = accessToken;
    // try to refresh one minute before expiry
    if (this._refresh) clearTimeout(this._refresh);
    this._refresh = setTimeout(() => userRefresh(), this._decoded.exp * 1000 - Date.now() - 60000);
  }
};

// ------------------------------------------
// Helpers
// ------------------------------------------
export function isAuthenticated() {
  return Boolean(state.accessToken);
}

export function onLogin(callback: () => typeof loginCallback) {
  loginCallback = callback;
}

export function onLogout(callback: () => typeof logoutCallback) {
  logoutCallback = callback;
}

export function logout() {
  state._accessToken = undefined;
  Cookies.remove('refresh_token');
  if (logoutCallback && typeof logoutCallback === 'function') {
    try {
      logoutCallback();
    } catch (_error) { }
  }
}

// ------------------------------------------


axios.interceptors.request.use(
  function (config) {
    return {
      ...config,
      headers: state.accessToken ? {
        ...(config.headers ?? {}),
        Authorization: `Bearer ${state.accessToken}`,
      } : config.headers,
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

// Make sure that the current accessToken is always included in requests
client.interceptors.request.use(
  function (config) {
    return {
      ...config,
      headers: state.accessToken ? {
        ...(config.headers ?? {}),
        Authorization: `Bearer ${state.accessToken}`,
      } : config.headers,
    };
  },
  function (error) {
    return Promise.reject(error);
  }
);

userRefresh().catch(error => {
  if (error?.response?.status != 401) {
    console.error(error);
  }
});

export async function userRegister(email: string, password: string) {
  const path = "/user/register" as const;
  const method = "post" as const;

  const body: paths[typeof path][typeof method]["requestBody"]["content"]["application/json"] =
  {
    email,
    password,
  };

  const response = await client[method]<
    paths[typeof path][typeof method]["responses"]["200"]
  >(path, body);

  return response.data
}

export async function userUpdateVerify(userId: string, otpId: string) {
  const path = "/user/update/verify" as const;
  const method = "post" as const;

  const body: paths[typeof path][typeof method]["requestBody"]["content"]["application/json"] =
  {
    user_id: userId,
    otp_id: otpId,
  };

  const response = await client[method]<
    paths[typeof path][typeof method]["responses"]["200"]
  >(path, body);

  return response.data
}

export async function userResetPassword(email: string) {
  const path = "/user/reset" as const;
  const method = "post" as const;

  const body: paths[typeof path][typeof method]["requestBody"]["content"]["application/json"] =
  {
    email,
  };

  const response = await client[method]<
    paths[typeof path][typeof method]["responses"]["200"]
  >(path, body);

  return response.data
}

export async function userUpdateResetPassword(userId: string, otpId: string, password: string) {
  const path = "/user/update/reset" as const;
  const method = "post" as const;

  const body: paths[typeof path][typeof method]["requestBody"]["content"]["application/json"] =
  {
    user_id: userId,
    otp_id: otpId,
    password
  };

  const response = await client[method]<
    paths[typeof path][typeof method]["responses"]["200"]
  >(path, body);
  return response.data
}


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
  state.accessToken = response.data;
}

export async function userRefresh() {
  const path = "/user/refresh" as const;
  const method = "post" as const;

  const response = await client[method]<
    paths[typeof path][typeof method]["responses"]["200"]["content"]["application/json"]
  >(path);

  // update accessToken
  state.accessToken = response.data;
}

export async function machineLogin(key: string, secret: string) {
  const path = "/machine/login" as const;
  const method = "post" as const;

  const body: paths[typeof path][typeof method]["requestBody"]["content"]["application/json"] =
  {
    access_key: key,
    secret_key: secret,
  };

  const response = await client[method]<
    paths[typeof path][typeof method]["responses"]["200"]["content"]["application/json"]
  >(path, body);

  // update accessToken
  state.accessToken = response.data;
}

export async function createMachineAccount(organizationId: string, permission: "read" | "write") {
  const path = "/organization/{organization_id}/machine" as const;
  const method = "post" as const;

  const body: paths[typeof path][typeof method]["requestBody"]["content"]["application/json"] =
  {
    permission
  };

  const response = await client[method]<
    paths[typeof path][typeof method]["responses"]["200"]["content"]["application/json"]
  >(`/organization/${organizationId}/machine`, body);

  return response.data
}

export async function deleteMachineAccount(organizationId: string) {
  const path = "/organization/{organization_id}/machine" as const;
  const method = "delete" as const;

  const response = await client[method]<
    paths[typeof path][typeof method]["responses"]["200"]
  >(`/organization/${organizationId}/machine`);

  return response.data
}


export async function createDatabase(name: string) {
  const path = "/database" as const;
  const method = "post" as const;
  const body: paths[typeof path][typeof method]["requestBody"]["content"]["application/json"] = {
    database_name: name
  };

  const response = await client[method]<
    paths[typeof path][typeof method]["responses"]["200"]["content"]["application/json"]
  >(path, body);

  return response.data;
}

export async function listDatabases() {
  const path = "/database" as const;
  const method = "get" as const;

  const response = await client[method]<
    paths[typeof path][typeof method]["responses"]["200"]["content"]["application/json"]
  >(path);

  return response.data;
}

export async function getDatabase(id: string) {
  const path = `/database/${id}` as const;
  const method = "get" as const;

  const response = await client[method]<
    paths['/database/{database_id}'][typeof method]["responses"]["200"]["content"]["application/json"]
  >(path);

  return response.data;
}

export async function deleteDatabase(id: string) {
  const path = `/database/${id}` as const;
  const method = "delete" as const;

  const response = await client[method]<
    paths['/database/{database_id}'][typeof method]["responses"]["200"]["content"]["application/json"]
  >(path);

  return response.data;
}

export async function createInstance(id: string, volume_size: number, type: "s" | "m" | "l" | "free") {
  const path = "/instance" as const;
  const method = "post" as const;
  const body: paths[typeof path][typeof method]["requestBody"]["content"]["application/json"] = {
    database_id: id,
    volume_size,
    type
  };

  const response = await client[method]<
    paths[typeof path][typeof method]["responses"]["200"]["content"]["application/json"]
  >(path, body);

  return response.data;
}

export async function listInstances() {
  const path = "/instance" as const;
  const method = "get" as const;

  const response = await client[method]<
    paths[typeof path][typeof method]["responses"]["200"]["content"]["application/json"]
  >(path);

  return response.data;
}


export async function getInstance(id: string) {
  const path = `/instance/${id}` as const;
  const method = "get" as const;

  const response = await client[method]<
    paths['/instance/{instance_id}'][typeof method]["responses"]["200"]["content"]["application/json"]
  >(path);

  return response.data;
}

export async function deleteInstance(id: string) {
  const path = `/database/${id}` as const;
  const method = "delete" as const;

  const response = await client[method]<
    paths['/instance/{instance_id}'][typeof method]["responses"]["200"]["content"]["application/json"]
  >(path);

  return response.data;
}


export async function createCollection(databaseId: string, name: string) {
  const path = "/collection" as const;
  const method = "post" as const;
  const body: paths[typeof path][typeof method]["requestBody"]["content"]["application/json"] = {
    collection_id: name
  };

  const response = await axios[method]<
    paths[typeof path][typeof method]["responses"]["200"]["content"]["application/json"]
  >(`https://${databaseId}.hiddb.io${path}`, body);

  return response.data;
}

export async function listCollections(databaseId: string) {
  const path = "/collection" as const;
  const method = "get" as const;

  const response = await client[method]<
    paths[typeof path][typeof method]["responses"]["200"]["content"]["application/json"]
  >(`https://${databaseId}.hiddb.io${path}`);

  return response.data;
}


export async function getCollection(databaseId: string, name: string) {
  const path = `/collection/${name}` as const;
  const method = "get" as const;

  const response = await client[method]<
    paths['/collection/{collection_id}'][typeof method]["responses"]["200"]["content"]["application/json"]
  >(`https://${databaseId}.hiddb.io${path}`);

  return response.data;
}

export async function deleteCollection(databaseId: string, name: string) {
  const path = `/collection/${name}` as const;
  const method = "delete" as const;

  const response = await client[method]<
    paths['/collection/{collection_id}'][typeof method]["responses"]["200"]["content"]["application/json"]
  >(`https://${databaseId}.hiddb.io${path}`);

  return response.data;
}

export async function createIndex(databaseId: string, field_name: string, dimension: number) {
  const path = "/collection/{collection_id}/index" as const;
  const method = "post" as const;
  const body: paths[typeof path][typeof method]["requestBody"]["content"]["application/json"] = {
    field_id: field_name,
    dimension
  };

  const response = await client[method]<
    paths[typeof path][typeof method]["responses"]["200"]
  >(`https://${databaseId}.hiddb.io${path}`, body);

  return response.data;
}

export async function listIndices(databaseId: string) {
  const path = "/collection/{collection_id}/index" as const;
  const method = "get" as const;

  const response = await client[method]<
    paths[typeof path][typeof method]["responses"]["200"]["content"]["application/json"]
  >(`https://${databaseId}.hiddb.io${path}`);

  return response.data;
}


export async function getIndex(databaseId: string, name: string) {
  const path = `/collection/{collection_id}/index/${name}` as const;
  const method = "get" as const;

  const response = await client[method]<
    paths['/collection/{collection_id}/index/{index_id}'][typeof method]["responses"]["200"]["content"]["application/json"]
  >(`https://${databaseId}.hiddb.io${path}`);

  return response.data;
}

export async function deleteIndex(databaseId: string, name: string) {
  const path = `/collection/{collection_id}/index/${name}` as const;
  const method = "delete" as const;

  const response = await client[method]<
    paths['/collection/{collection_id}/index/{index_id}'][typeof method]["responses"]["200"]["content"]["application/json"]
  >(`https://${databaseId}.hiddb.io${path}`);

  return response.data;
}


export async function insertDocument(databaseId: string, document: { [key: string]: string }) {
  const path = "/collection/{collection_id}/document" as const;
  const method = "post" as const;
  const body: paths[typeof path][typeof method]["requestBody"]["content"]["application/json"] = {
    documents: [document]
  };

  const response = await client[method]<
    paths[typeof path][typeof method]["responses"]["200"]
  >(`https://${databaseId}.hiddb.io${path}`, body);

  return response.data;
}

export async function searchNearestDocuments(databaseId: string) {
  const path = "/collection/{collection_id}/document/search" as const;
  const method = "post" as const;

  const response = await client[method]<
    paths[typeof path][typeof method]["responses"]["200"]["content"]["application/json"]
  >(`https://${databaseId}.hiddb.io${path}`);

  return response.data;
}


export async function getDocument(databaseId: string, id: string) {
  const path = `/collection/{collection_id}/document/${id}` as const;
  const method = "get" as const;

  const response = await client[method]<
    paths['/collection/{collection_id}/index/{index_id}'][typeof method]["responses"]["200"]["content"]["application/json"]
  >(`https://${databaseId}.hiddb.io${path}`);

  return response.data;
}

export async function deleteDocument(databaseId: string, id: string) {
  const path = `/collection/{collection_id}/document/${id}` as const;
  const method = "delete" as const;

  const response = await client[method]<
    paths['/collection/{collection_id}/index/{index_id}'][typeof method]["responses"]["200"]["content"]["application/json"]
  >(`https://${databaseId}.hiddb.io${path}`);

  return response.data;
}