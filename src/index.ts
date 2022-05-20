import axios, { AxiosInstance } from "axios";
import jwtDecode from 'jwt-decode';
import { paths } from "./hiddb";

export abstract class State {
  abstract get accessToken(): string | undefined;
  abstract get machineKey(): string | undefined;
  abstract get machineSecret(): string | undefined;

  abstract set accessToken(accessToken);
  protected abstract refreshToken(): Promise<void>;
}

export type JWT = {
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
  ({ type: 'login' } & CustomEvent<JWT>) |
  ({ type: 'logout' } & Event) |
  ({ type: 'databaseCreated' } & Event) |
  ({ type: 'databaseDeleted' } & Event) |
  ({ type: 'instanceCreated' } & Event) |
  ({ type: 'instanceDeleted' } & Event) |
  ({ type: 'collectionCreated' } & Event) |
  ({ type: 'collectionDeleted' } & Event) |
  ({ type: 'indexCreated' } & Event) |
  ({ type: 'indexDeleted' } & Event);

class MachineState extends State {
  private hiddb: HIDDB;
  private _accessToken?: string = '';
  private _decoded?: JWT;
  private _refresh?: number;

  private _key: string;
  private _secret: string;

  constructor(hiddb: HIDDB, key: string, secret: string) {
    super();
    this.hiddb = hiddb;
    this._key = key;
    this._secret = secret;
  }

  get accessToken() {
    return this._accessToken;
  }

  get machineKey() {
    return this._key;
  }

  get machineSecret() {
    return this._secret;
  }

  set accessToken(accessToken) {
    if (accessToken === undefined) {
      this._accessToken = accessToken;
      return;
    }

    this._decoded = jwtDecode(accessToken) as JWT;
    if (!this._accessToken && accessToken) {
      if (typeof CustomEvent !== 'undefined') {
        // @ts-expect-error
        this.hiddb.dispatchEvent(new CustomEvent('login', {
          detail: JSON.parse(JSON.stringify(this._decoded))
        }));
      }
    }
    this._accessToken = accessToken;

    if (typeof window !== 'undefined') {
      // try to refresh one minute before expiry
      if (this._refresh) window.clearTimeout(this._refresh);
      this._refresh = window.setTimeout(() => this.refreshToken(), this._decoded.exp * 1000 - Date.now() - 60000);
    } else {
      if (this._refresh) clearTimeout(this._refresh);
      this._refresh = setTimeout(() => this.refreshToken(), this._decoded.exp * 1000 - Date.now() - 60000);
    }
  }

  protected async refreshToken() {
    await this.hiddb.machineLogin(this.machineKey, this.machineSecret);
  }
}

export class HIDDB extends EventTarget {
  protected state: State;
  protected axios: AxiosInstance;
  protected client: AxiosInstance;
  protected dbDomain: string;

  constructor(params: { key: string, secret: string, apiDomain?: string, dbDomain?: string, secure?: boolean }) {
    super();
    this.state = new MachineState(this, params.key, params.secret);

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

    this.dbDomain = params.dbDomain ?? 'hiddb.io';

    this.client = axios.create({
      baseURL: `${params.secure ? 'https' : 'http'}://api.${params.apiDomain ?? 'hiddb.io'}`,
      timeout: 30000
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
  >(event: E): boolean {
    return super.dispatchEvent(event);
  }

  public addEventListener<
    T extends Events['type'],
    E extends Events & { type: T }
  >(type: T, callback: ((e: E) => void) | { handleEvent: (e: E) => void } | null): void {
    return super.addEventListener(type, callback as EventListenerOrEventListenerObject);
  }

  public removeEventListener(type: Events['type']) {
    super.removeEventListener(type, null)
  }

  isAuthenticated() {
    return Boolean(this.state.accessToken);
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
    this.state.accessToken = response.data.access_token;
  }

  async createMachineAccount(machineName: string, permission: "read" | "write" | "admin") {
    const path = "/machine" as const;
    const method = "post" as const;

    const body: paths[typeof path][typeof method]["requestBody"]["content"]["application/json"] =
    {
      machine_name: machineName,
      permission
    };

    const response = await this.client[method]<
      paths[typeof path][typeof method]["responses"]["200"]["content"]["application/json"]
    >(`/machine`, body);

    return response.data
  }

  async getMachineAccounts() {
    const path = "/machine" as const;
    const method = "get" as const;

    const response = await this.client[method]<
      paths[typeof path][typeof method]["responses"]["200"]["content"]["application/json"]
    >(`/machine`);

    return response.data
  }

  async deleteMachineAccount(machineId: string) {
    const path = "/machine/{machine_id}" as const;
    const method = "delete" as const;

    const response = await this.client[method]<
      paths[typeof path][typeof method]["responses"]["200"]
    >(`/machine/${machineId}`);

    return response.data
  }

  async createDatabase(name: string, instances: [{ type: "xs" | "s" | "m" | "l" | "xl", volume_size: number, location: "hel1" | "nbg1" | "fsn1" }]) {
    const path = "/database" as const;
    const method = "post" as const;
    const body: paths[typeof path][typeof method]["requestBody"]["content"]["application/json"] = {
      database_name: name,
      instances
    };

    const response = await this.client[method]<
      paths[typeof path][typeof method]["responses"]["202"]["content"]["application/json"]
    >(path, body);

    // @ts-expect-error
    this.dispatchEvent(new Event('databaseCreated'));

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
      paths['/database/{database_id}'][typeof method]["responses"]["202"]["content"]["application/json"]
    >(path);

    // @ts-expect-error
    this.dispatchEvent(new Event('databaseDeleted'));

    return response.data;
  }

  async createInstance(id: string, volume_size: number, type: "xs" | "s" | "m" | "l" | "xl", location: "hel1" | "nbg1" | "fsn1") {
    const path = "/instance" as const;
    const method = "post" as const;
    const body: paths[typeof path][typeof method]["requestBody"]["content"]["application/json"] = {
      database_id: id,
      volume_size,
      type,
      location
    };

    const response = await this.client[method]<
      paths[typeof path][typeof method]["responses"]["202"]["content"]["application/json"]
    >(path, body);

    // @ts-expect-error
    this.dispatchEvent(new Event('instanceCreated'));

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
      paths['/instance/{instance_id}'][typeof method]["responses"]["202"]["content"]["application/json"]
    >(path);

    // @ts-expect-error
    this.dispatchEvent(new Event('instanceDeleted'));

    return response.data;
  }


  async createCollection(databaseId: string, name: string) {
    const path = "/collection" as const;
    const method = "post" as const;
    const body: paths[typeof path][typeof method]["requestBody"]["content"]["application/json"] = {
      collection_name: name
    };

    const response = await this.axios[method]<
      paths[typeof path][typeof method]["responses"]["200"]["content"]["application/json"]
    >(`https://${databaseId}.${this.dbDomain}${path}`, body);

    // @ts-expect-error
    this.dispatchEvent(new Event('collectionCreated'));

    return response.data;
  }

  async listCollections(databaseId: string) {
    const path = "/collection" as const;
    const method = "get" as const;

    const response = await this.axios[method]<
      paths[typeof path][typeof method]["responses"]["200"]["content"]["application/json"]
    >(`https://${databaseId}.${this.dbDomain}${path}`);

    return response.data;
  }


  async getCollection(databaseId: string, name: string) {
    const path = `/collection/${name}` as const;
    const method = "get" as const;

    const response = await this.axios[method]<
      paths['/collection/{collection_name}'][typeof method]["responses"]["200"]["content"]["application/json"]
    >(`https://${databaseId}.${this.dbDomain}${path}`);

    return response.data;
  }

  async deleteCollection(databaseId: string, name: string) {
    const path = `/collection/${name}` as const;
    const method = "delete" as const;

    const response = await this.axios[method]<
      paths['/collection/{collection_name}'][typeof method]["responses"]["200"]["content"]["application/json"]
    >(`https://${databaseId}.${this.dbDomain}${path}`);

    // @ts-expect-error
    this.dispatchEvent(new Event('collectionDeleted'));

    return response.data;
  }

  async createIndex(databaseId: string, collection_name: string, field_name: string, dimension: number) {
    const rawPath = "/collection/{collection_name}/index" as const;
    const path = `/collection/${collection_name}/index` as const;
    const method = "post" as const;
    const body: paths[typeof rawPath][typeof method]["requestBody"]["content"]["application/json"] = {
      field_name: field_name,
      dimension
    };

    const response = await this.axios[method]<
      paths[typeof rawPath][typeof method]["responses"]["200"]["content"]["application/json"]
    >(`https://${databaseId}.${this.dbDomain}${path}`, body);

    // @ts-expect-error
    this.dispatchEvent(new Event('indexCreated'));

    return response.data;
  }

  async listIndices(databaseId: string, collection_name: string) {
    const rawPath = "/collection/{collection_name}/index" as const;
    const path = `/collection/${collection_name}/index` as const;
    const method = "get" as const;

    const response = await this.axios[method]<
      paths[typeof rawPath][typeof method]["responses"]["200"]["content"]["application/json"]
    >(`https://${databaseId}.${this.dbDomain}${path}`);

    return response.data;
  }


  async getIndex(databaseId: string, collection_name: string, index_name: string) {
    const rawPath = "/collection/{collection_name}/index/{field_name}" as const;
    const path = `/collection/${collection_name}/index/${index_name}` as const;
    const method = "get" as const;

    const response = await this.axios[method]<
      paths[typeof rawPath][typeof method]["responses"]["200"]["content"]["application/json"]
    >(`https://${databaseId}.${this.dbDomain}${path}`);

    return response.data;
  }

  async deleteIndex(databaseId: string, collection_name: string, index_name: string) {
    const rawPath = "/collection/{collection_name}/index/{field_name}" as const;
    const path = `/collection/${collection_name}/index/${index_name}` as const;
    const method = "delete" as const;

    const response = await this.axios[method]<
      paths[typeof rawPath][typeof method]["responses"]["200"]["content"]["application/json"]
    >(`https://${databaseId}.${this.dbDomain}${path}`);

    // @ts-expect-error
    this.dispatchEvent(new Event('indexDeleted'));

    return response.data;
  }


  async insertDocument(databaseId: string, collection_name: string, document: { id: string, [key: string]: string }) {
    const rawPath = "/collection/{collection_name}/document" as const;
    const path = `/collection/${collection_name}/document` as const;
    const method = "post" as const;
    const body: paths[typeof rawPath][typeof method]["requestBody"]["content"]["application/json"] = {
      documents: [document]
    };

    const response = await this.axios[method]<
      paths[typeof rawPath][typeof method]["responses"]["200"]
    >(`https://${databaseId}.${this.dbDomain}${path}`, body);

    return response.data;
  }

  async searchNearestDocuments(databaseId: string, collection_name: string, vector: [number], field_name: string, max_neighbors: number) {
    const rawPath = "/collection/{collection_name}/document/search" as const;
    const path = `/collection/${collection_name}/document/search` as const;
    const method = "post" as const;
    const body: paths[typeof rawPath][typeof method]["requestBody"]["content"]["application/json"] = {
      vectors: [vector],
      field_name: field_name,
      max_neighbors: max_neighbors
    };

    const response = await this.axios[method]<
      paths[typeof rawPath][typeof method]["responses"]["200"]["content"]["application/json"]
    >(`https://${databaseId}.${this.dbDomain}${path}`, body);

    return response.data;
  }

  async getDocument(databaseId: string, collection_name: string, id: string) {
    const rawPath = "/collection/{collection_name}/document/{document_id}" as const;
    const path = `/collection/${collection_name}/document/${id}` as const;
    const method = "get" as const;

    const response = await this.axios[method]<
      paths[typeof rawPath][typeof method]["responses"]["200"]["content"]["application/json"]
    >(`https://${databaseId}.${this.dbDomain}${path}`);

    return response.data;
  }

  async deleteDocument(databaseId: string, collection_name: string, id: string) {
    const rawPath = "/collection/{collection_name}/document/{document_id}" as const;
    const path = `/collection/${collection_name}/document/${id}` as const;
    const method = "delete" as const;

    const response = await this.axios[method]<
      paths[typeof rawPath][typeof method]["responses"]["200"]["content"]["application/json"]
    >(`https://${databaseId}.${this.dbDomain}${path}`);

    return response.data;
  }
}
