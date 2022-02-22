import axios, { AxiosInstance } from "axios";
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
  organization: string,
  iat: number,
  exp: number,
};

type Events = 
  { type: 'login', data: JWT } |
  { type: 'logout' } | 
  { type: 'databaseCreated' } | 
  { type: 'databaseDeleted' } |
  { type: 'instanceCreated' } | 
  { type: 'instanceDeleted' } |
  { type: 'collectionCreated' } | 
  { type: 'collectionDeleted' } |
  { type: 'indexCreated' } | 
  { type: 'indexDeleted' };

class State {
  private hiddb: HIDDB;
  private _accessToken?: string = '';
  private _decoded?: JWT;
  private _refresh?: number;

  constructor(hiddb: HIDDB) {
    this.hiddb = hiddb;
  }

  get accessToken() {
    return this._accessToken;
  }

  set accessToken(accessToken) {
    if (accessToken === undefined) {
      this.accessToken = accessToken;
      return;
    }

    this._decoded = jwtDecode(accessToken) as JWT;
    if (!this._accessToken && accessToken) {
      // @ts-expect-error
      this.hiddb.dispatchEvent(new CustomEvent('login', JSON.parse(JSON.stringify(this._decoded))));
    }
    this._accessToken = accessToken;
    
    // try to refresh one minute before expiry
    if (this._refresh) window.clearTimeout(this._refresh);
    this._refresh = window.setTimeout(() => this.hiddb.userRefresh(), this._decoded.exp * 1000 - Date.now() - 60000);
  }
}

class HIDDB extends EventTarget {
  private state: State = new State(this);
  private axios: AxiosInstance;
  private client: AxiosInstance;

  constructor() {
    super();

    this.axios = axios.create();
    this.axios.defaults.headers.post['Content-Type'] = 'application/json';
    this.axios.interceptors.request.use(
      (config) => {
        return {
          ...config,
          headers: this.state.accessToken ? {
            ...(config.headers ?? {}),
            Authorization: `Bearer ${this.state.accessToken}`,
          } : config.headers,
        };
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.client = axios.create({
      baseURL: "https://api.hiddb.io/",
      timeout: 30000,
    });
    this.client.defaults.headers.post['Content-Type'] = 'application/json';
    this.client.interceptors.request.use(
      (config) => {
        return {
          ...config,
          headers: this.state.accessToken ? {
            ...(config.headers ?? {}),
            Authorization: `Bearer ${this.state.accessToken}`,
          } : config.headers,
        };
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  public dispatchEvent<
  T extends Events['type'],
  E extends Events & { type: T }
  >(event: Event & E): boolean {
    return super.dispatchEvent(event);
  }

  public addEventListener<
    T extends Events['type'],
    E extends Events & { type: T }
  >(type: T, callback: ((e: Event & E) => void) | { handleEvent: (e: Event & E) => void} | null): void {
    return super.addEventListener(type, callback as EventListenerOrEventListenerObject);
  }

  public removeEventListener(type: Events['type']) {
    super.removeEventListener(type, null)
  }

  isAuthenticated() {
    return Boolean(this.state.accessToken);
  }
  
  logout() {
    this.state.accessToken = undefined;
    Cookies.remove('refresh_token');
    
    // @ts-expect-error
    this.hiddb.dispatchEvent(new Event('logout'));
  }

  async userRegister(email: string, password: string) {
    const path = "/user/register" as const;
    const method = "post" as const;
  
    const body: paths[typeof path][typeof method]["requestBody"]["content"]["application/json"] =
    {
      email,
      password,
    };
  
    const response = await this.client[method]<
      paths[typeof path][typeof method]["responses"]["200"]
    >(path, body);
  
    return response.data
  }
  
  async userUpdateVerify(userId: string, otpId: string) {
    const path = "/user/update/verify" as const;
    const method = "post" as const;
  
    const body: paths[typeof path][typeof method]["requestBody"]["content"]["application/json"] =
    {
      user_id: userId,
      otp_id: otpId,
    };
  
    const response = await this.client[method]<
      paths[typeof path][typeof method]["responses"]["200"]
    >(path, body);
  
    return response.data
  }
  
  async userResetPassword(email: string) {
    const path = "/user/reset" as const;
    const method = "post" as const;
  
    const body: paths[typeof path][typeof method]["requestBody"]["content"]["application/json"] =
    {
      email,
    };
  
    const response = await this.client[method]<
      paths[typeof path][typeof method]["responses"]["200"]
    >(path, body);
  
    return response.data
  }
  
  async userUpdateResetPassword(userId: string, otpId: string, password: string) {
    const path = "/user/update/reset" as const;
    const method = "post" as const;
  
    const body: paths[typeof path][typeof method]["requestBody"]["content"]["application/json"] =
    {
      user_id: userId,
      otp_id: otpId,
      password
    };
  
    const response = await this.client[method]<
      paths[typeof path][typeof method]["responses"]["200"]
    >(path, body);
    return response.data
  }
  
  
  async userLogin(email: string, password: string) {
    const path = "/user/login" as const;
    const method = "post" as const;
  
    const body: paths[typeof path][typeof method]["requestBody"]["content"]["application/json"] =
    {
      email,
      password,
    };
  
    const response = await this.client[method]<
      paths[typeof path][typeof method]["responses"]["200"]["content"]["application/json"]
    >(path, body);
  
    // update accessToken
    this.state.accessToken = response.data;
  }
  
  async userRefresh() {
    const path = "/user/refresh" as const;
    const method = "post" as const;
  
    const response = await this.client[method]<
      paths[typeof path][typeof method]["responses"]["200"]["content"]["application/json"]
    >(path, {});
  
    // update accessToken
    this.state.accessToken = response.data;
  }
  
  async machineLogin(key: string, secret: string) {
    const path = "/machine/login" as const;
    const method = "post" as const;
  
    const body: paths[typeof path][typeof method]["requestBody"]["content"]["application/json"] =
    {
      access_key: key,
      secret_key: secret,
    };
  
    const response = await this.client[method]<
      paths[typeof path][typeof method]["responses"]["200"]["content"]["application/json"]
    >(path, body);
  
    // update accessToken
    this.state.accessToken = response.data;
  }
  
  async createMachineAccount(organizationId: string, permission: "read" | "write") {
    const path = "/organization/{organization_id}/machine" as const;
    const method = "post" as const;
  
    const body: paths[typeof path][typeof method]["requestBody"]["content"]["application/json"] =
    {
      permission
    };
  
    const response = await this.client[method]<
      paths[typeof path][typeof method]["responses"]["200"]["content"]["application/json"]
    >(`/organization/${organizationId}/machine`, body);
  
    return response.data
  }
  
  async deleteMachineAccount(organizationId: string) {
    const path = "/organization/{organization_id}/machine" as const;
    const method = "delete" as const;
  
    const response = await this.client[method]<
      paths[typeof path][typeof method]["responses"]["200"]
    >(`/organization/${organizationId}/machine`);
  
    return response.data
  }
  
  async createDatabase(name: string) {
    const path = "/database" as const;
    const method = "post" as const;
    const body: paths[typeof path][typeof method]["requestBody"]["content"]["application/json"] = {
      database_name: name
    };
  
    const response = await this.client[method]<
      paths[typeof path][typeof method]["responses"]["200"]["content"]["application/json"]
    >(path, body);
  
    // @ts-expect-error
    this.hiddb.dispatchEvent(new Event('databaseCreated'));
  
    return response.data;
  }
  
  async listDatabases() {
    const path = "/database" as const;
    const method = "get" as const;
  
    const response = await this.client[method]<
      paths[typeof path][typeof method]["responses"]["200"]["content"]["application/json"]
    >(path);
  
    return response.data;
  }
  
  async getDatabase(id: string) {
    const path = `/database/${id}` as const;
    const method = "get" as const;
  
    const response = await this.client[method]<
      paths['/database/{database_id}'][typeof method]["responses"]["200"]["content"]["application/json"]
    >(path);
  
    return response.data;
  }
  
  async deleteDatabase(id: string) {
    const path = `/database/${id}` as const;
    const method = "delete" as const;
  
    const response = await this.client[method]<
      paths['/database/{database_id}'][typeof method]["responses"]["200"]["content"]["application/json"]
    >(path);
  
    // @ts-expect-error
    this.hiddb.dispatchEvent(new Event('databaseDeleted'));
  
    return response.data;
  }
  
  async createInstance(id: string, volume_size: number, type: "s" | "m" | "l" | "free") {
    const path = "/instance" as const;
    const method = "post" as const;
    const body: paths[typeof path][typeof method]["requestBody"]["content"]["application/json"] = {
      database_id: id,
      volume_size,
      type
    };
  
    const response = await this.client[method]<
      paths[typeof path][typeof method]["responses"]["200"]["content"]["application/json"]
    >(path, body);
  
    // @ts-expect-error
    this.hiddb.dispatchEvent(new Event('instanceCreated'));
  
    return response.data;
  }
  
  async listInstances() {
    const path = "/instance" as const;
    const method = "get" as const;
  
    const response = await this.client[method]<
      paths[typeof path][typeof method]["responses"]["200"]["content"]["application/json"]
    >(path);
  
    return response.data;
  }
  
  
  async getInstance(id: string) {
    const path = `/instance/${id}` as const;
    const method = "get" as const;
  
    const response = await this.client[method]<
      paths['/instance/{instance_id}'][typeof method]["responses"]["200"]["content"]["application/json"]
    >(path);
  
    return response.data;
  }
  
  async deleteInstance(id: string) {
    const path = `/database/${id}` as const;
    const method = "delete" as const;
  
    const response = await this.client[method]<
      paths['/instance/{instance_id}'][typeof method]["responses"]["200"]["content"]["application/json"]
    >(path);
    
    // @ts-expect-error
    this.hiddb.dispatchEvent(new Event('instanceDeleted'));
  
    return response.data;
  }
  
  
  async createCollection(databaseId: string, name: string) {
    const path = "/collection" as const;
    const method = "post" as const;
    const body: paths[typeof path][typeof method]["requestBody"]["content"]["application/json"] = {
      collection_id: name
    };
  
    const response = await this.axios[method]<
      paths[typeof path][typeof method]["responses"]["200"]["content"]["application/json"]
    >(`https://${databaseId}.hiddb.io${path}`, body);
  
    // @ts-expect-error
    this.hiddb.dispatchEvent(new Event('collectionCreated'));
  
    return response.data;
  }
  
  async listCollections(databaseId: string) {
    const path = "/collection" as const;
    const method = "get" as const;
  
    const response = await this.client[method]<
      paths[typeof path][typeof method]["responses"]["200"]["content"]["application/json"]
    >(`https://${databaseId}.hiddb.io${path}`);
  
    return response.data;
  }
  
  
  async getCollection(databaseId: string, name: string) {
    const path = `/collection/${name}` as const;
    const method = "get" as const;
  
    const response = await this.client[method]<
      paths['/collection/{collection_id}'][typeof method]["responses"]["200"]["content"]["application/json"]
    >(`https://${databaseId}.hiddb.io${path}`);
  
    return response.data;
  }
  
  async deleteCollection(databaseId: string, name: string) {
    const path = `/collection/${name}` as const;
    const method = "delete" as const;
  
    const response = await this.client[method]<
      paths['/collection/{collection_id}'][typeof method]["responses"]["200"]["content"]["application/json"]
    >(`https://${databaseId}.hiddb.io${path}`);
    
    // @ts-expect-error
    this.hiddb.dispatchEvent(new Event('collectionDeleted'));
  
    return response.data;
  }
  
  async createIndex(databaseId: string, field_name: string, dimension: number) {
    const path = "/collection/{collection_id}/index" as const;
    const method = "post" as const;
    const body: paths[typeof path][typeof method]["requestBody"]["content"]["application/json"] = {
      field_id: field_name,
      dimension
    };
  
    const response = await this.client[method]<
      paths[typeof path][typeof method]["responses"]["200"]
    >(`https://${databaseId}.hiddb.io${path}`, body);
    
    // @ts-expect-error
    this.hiddb.dispatchEvent(new Event('indexCreated'));
  
    return response.data;
  }
  
  async listIndices(databaseId: string) {
    const path = "/collection/{collection_id}/index" as const;
    const method = "get" as const;
  
    const response = await this.client[method]<
      paths[typeof path][typeof method]["responses"]["200"]["content"]["application/json"]
    >(`https://${databaseId}.hiddb.io${path}`);
  
    return response.data;
  }
  
  
  async getIndex(databaseId: string, name: string) {
    const path = `/collection/{collection_id}/index/${name}` as const;
    const method = "get" as const;
  
    const response = await this.client[method]<
      paths['/collection/{collection_id}/index/{index_id}'][typeof method]["responses"]["200"]["content"]["application/json"]
    >(`https://${databaseId}.hiddb.io${path}`);
  
    return response.data;
  }
  
  async deleteIndex(databaseId: string, name: string) {
    const path = `/collection/{collection_id}/index/${name}` as const;
    const method = "delete" as const;
  
    const response = await this.client[method]<
      paths['/collection/{collection_id}/index/{index_id}'][typeof method]["responses"]["200"]["content"]["application/json"]
    >(`https://${databaseId}.hiddb.io${path}`);
    
    // @ts-expect-error
    this.hiddb.dispatchEvent(new Event('indexDeleted'));
  
    return response.data;
  }
  
  
  async insertDocument(databaseId: string, document: { [key: string]: string }) {
    const path = "/collection/{collection_id}/document" as const;
    const method = "post" as const;
    const body: paths[typeof path][typeof method]["requestBody"]["content"]["application/json"] = {
      documents: [document]
    };
  
    const response = await this.client[method]<
      paths[typeof path][typeof method]["responses"]["200"]
    >(`https://${databaseId}.hiddb.io${path}`, body);
  
    return response.data;
  }
  
  async searchNearestDocuments(databaseId: string) {
    const path = "/collection/{collection_id}/document/search" as const;
    const method = "post" as const;
  
    const response = await this.client[method]<
      paths[typeof path][typeof method]["responses"]["200"]["content"]["application/json"]
    >(`https://${databaseId}.hiddb.io${path}`);
  
    return response.data;
  }
  
  
  async getDocument(databaseId: string, id: string) {
    const path = `/collection/{collection_id}/document/${id}` as const;
    const method = "get" as const;
  
    const response = await this.client[method]<
      paths['/collection/{collection_id}/index/{index_id}'][typeof method]["responses"]["200"]["content"]["application/json"]
    >(`https://${databaseId}.hiddb.io${path}`);
  
    return response.data;
  }
  
  async deleteDocument(databaseId: string, id: string) {
    const path = `/collection/{collection_id}/document/${id}` as const;
    const method = "delete" as const;
  
    const response = await this.client[method]<
      paths['/collection/{collection_id}/index/{index_id}'][typeof method]["responses"]["200"]["content"]["application/json"]
    >(`https://${databaseId}.hiddb.io${path}`);
  
    return response.data;
  }
}

export default new HIDDB();