import $hgUW1$axios from "axios";
import $hgUW1$jwtdecode from "jwt-decode";



class $149c1bd638913645$var$State {
    constructor(hiddb, key, secret){
        this._accessToken = '';
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
        this._decoded = $hgUW1$jwtdecode(accessToken);
        if (!this._accessToken && accessToken) {
            if (typeof CustomEvent !== 'undefined') // @ts-expect-error
            this.hiddb.dispatchEvent(new CustomEvent('login', {
                detail: JSON.parse(JSON.stringify(this._decoded))
            }));
        }
        this._accessToken = accessToken;
        if (typeof window !== 'undefined') {
            // try to refresh one minute before expiry
            if (this._refresh) window.clearTimeout(this._refresh);
            this._refresh = window.setTimeout(()=>this.refreshToken()
            , this._decoded.exp * 1000 - Date.now() - 60000);
        } else {
            if (this._refresh) clearTimeout(this._refresh);
            this._refresh = setTimeout(()=>this.refreshToken()
            , this._decoded.exp * 1000 - Date.now() - 60000);
        }
    }
    async refreshToken() {
        if (this.machineKey && this.machineSecret) {
            await this.hiddb.machineLogin(this.machineKey, this.machineSecret);
            return;
        }
        await this.hiddb.userRefresh();
    }
}
class $149c1bd638913645$export$5192b5e175132710 extends EventTarget {
    constructor(params){
        super();
        this.state = new $149c1bd638913645$var$State(this, params.key, params.secret);
        this.axios = $hgUW1$axios.create();
        this.axios.defaults.headers.post['Content-Type'] = 'application/json';
        this.axios.interceptors.request.use((config)=>{
            return {
                ...config,
                headers: this.state.accessToken ? {
                    ...config.headers ?? {
                    },
                    Authorization: `Bearer ${this.state.accessToken}`
                } : config.headers
            };
        }, (error)=>{
            return Promise.reject(error);
        });
        this.dbDomain = params.dbDomain;
        this.client = $hgUW1$axios.create({
            baseURL: `${params.secure ? 'https' : 'http'}://api.${params.apiDomain}`,
            timeout: 30000
        });
        this.client.defaults.headers.post['Content-Type'] = 'application/json';
        this.client.interceptors.request.use((config)=>{
            return {
                ...config,
                headers: this.state.accessToken ? {
                    ...config.headers ?? {
                    },
                    Authorization: `Bearer ${this.state.accessToken}`
                } : config.headers
            };
        }, (error)=>{
            return Promise.reject(error);
        });
    }
    dispatchEvent(event) {
        return super.dispatchEvent(event);
    }
    addEventListener(type, callback) {
        return super.addEventListener(type, callback);
    }
    removeEventListener(type) {
        super.removeEventListener(type, null);
    }
    isAuthenticated() {
        return Boolean(this.state.accessToken);
    }
    async logout() {
        this.state.accessToken = undefined;
        if (!this.state.machineKey || !this.state.machineSecret) {
            const path = "/user/logout";
            const method = "post";
            await this.client[method](path, undefined, {
                withCredentials: true
            });
        }
        // @ts-expect-error
        this.dispatchEvent(new Event('logout'));
    }
    async userRegister(email, password) {
        const path = "/user/register";
        const method = "post";
        const body = {
            email: email,
            password: password
        };
        const response = await this.client[method](path, body);
        return response.data;
    }
    async userUpdateVerify(userId, otp) {
        const path = "/user/update/verify";
        const method = "post";
        const body = {
            user_id: userId,
            otp: otp
        };
        const response = await this.client[method](path, body);
        return response.data;
    }
    async userResetPassword(email) {
        const path = "/user/reset";
        const method = "post";
        const body = {
            email: email
        };
        const response = await this.client[method](path, body);
        return response.data;
    }
    async userUpdateResetPassword(userId, otp, password) {
        const path = "/user/update/reset";
        const method = "post";
        const body = {
            user_id: userId,
            otp: otp,
            password: password
        };
        const response = await this.client[method](path, body);
        return response.data;
    }
    async userLogin(email, password) {
        const path = "/user/login";
        const method = "post";
        const body = {
            email: email,
            password: password
        };
        const response = await this.client[method](path, body, {
            withCredentials: true
        });
        // update accessToken
        this.state.accessToken = response.data.access_token;
    }
    async userRefresh() {
        const path = "/user/refresh";
        const method = "post";
        const response = await this.client[method](path, {
        }, {
            withCredentials: true
        });
        // update accessToken
        this.state.accessToken = response.data.access_token;
    }
    async machineLogin(key, secret) {
        const path = "/machine/login";
        const method = "post";
        const body = {
            access_key: key,
            secret_key: secret
        };
        const response = await this.client[method](path, body);
        // update accessToken
        this.state.accessToken = response.data.access_token;
    }
    async createMachineAccount(machineName, permission) {
        const path = "/machine";
        const method = "post";
        const body = {
            machine_name: machineName,
            permission: permission
        };
        const response = await this.client[method](`/machine`, body);
        return response.data;
    }
    async getMachineAccounts() {
        const path = "/machine";
        const method = "get";
        const response = await this.client[method](`/machine`);
        return response.data;
    }
    async deleteMachineAccount(machineId) {
        const path = "/machine/{machine_id}";
        const method = "delete";
        const response = await this.client[method](`/machine/${machineId}`);
        return response.data;
    }
    async createDatabase(name, instances) {
        const path = "/database";
        const method = "post";
        const body = {
            database_name: name,
            instances: instances
        };
        const response = await this.client[method](path, body);
        // @ts-expect-error
        this.dispatchEvent(new Event('databaseCreated'));
        return response.data;
    }
    async listDatabases() {
        const path = "/database";
        const method = "get";
        const response = await this.client[method](path);
        return response.data;
    }
    async getDatabase(id) {
        const path = `/database/${id}`;
        const method = "get";
        const response = await this.client[method](path);
        return response.data;
    }
    async deleteDatabase(id) {
        const path = `/database/${id}`;
        const method = "delete";
        const response = await this.client[method](path);
        // @ts-expect-error
        this.dispatchEvent(new Event('databaseDeleted'));
        return response.data;
    }
    async createInstance(id, volume_size, type) {
        const path = "/instance";
        const method = "post";
        const body = {
            database_id: id,
            volume_size: volume_size,
            type: type
        };
        const response = await this.client[method](path, body);
        // @ts-expect-error
        this.dispatchEvent(new Event('instanceCreated'));
        return response.data;
    }
    async listInstances() {
        const path = "/instance";
        const method = "get";
        const response = await this.client[method](path);
        return response.data;
    }
    async getInstance(id) {
        const path = `/instance/${id}`;
        const method = "get";
        const response = await this.client[method](path);
        return response.data;
    }
    async deleteInstance(id) {
        const path = `/database/${id}`;
        const method = "delete";
        const response = await this.client[method](path);
        // @ts-expect-error
        this.dispatchEvent(new Event('instanceDeleted'));
        return response.data;
    }
    async createCollection(databaseId, name) {
        const path = "/collection";
        const method = "post";
        const body = {
            collection_name: name
        };
        const response = await this.axios[method](`https://${databaseId}.${this.dbDomain}${path}`, body);
        // @ts-expect-error
        this.dispatchEvent(new Event('collectionCreated'));
        return response.data;
    }
    async listCollections(databaseId) {
        const path = "/collection";
        const method = "get";
        const response = await this.axios[method](`https://${databaseId}.${this.dbDomain}${path}`);
        return response.data;
    }
    async getCollection(databaseId, name) {
        const path = `/collection/${name}`;
        const method = "get";
        const response = await this.axios[method](`https://${databaseId}.${this.dbDomain}${path}`);
        return response.data;
    }
    async deleteCollection(databaseId, name) {
        const path = `/collection/${name}`;
        const method = "delete";
        const response = await this.axios[method](`https://${databaseId}.${this.dbDomain}${path}`);
        // @ts-expect-error
        this.dispatchEvent(new Event('collectionDeleted'));
        return response.data;
    }
    async createIndex(databaseId, collection_name, field_name, dimension) {
        const rawPath = "/collection/{collection_name}/index";
        const path = `/collection/${collection_name}/index`;
        const method = "post";
        const body = {
            field_name: field_name,
            dimension: dimension
        };
        const response = await this.axios[method](`https://${databaseId}.${this.dbDomain}${path}`, body);
        // @ts-expect-error
        this.dispatchEvent(new Event('indexCreated'));
        return response.data;
    }
    async listIndices(databaseId, collection_name) {
        const rawPath = "/collection/{collection_name}/index";
        const path = `/collection/${collection_name}/index`;
        const method = "get";
        const response = await this.axios[method](`https://${databaseId}.${this.dbDomain}${path}`);
        return response.data;
    }
    async getIndex(databaseId, collection_name, index_name) {
        const rawPath = "/collection/{collection_name}/index/{field_name}";
        const path = `/collection/${collection_name}/index/${index_name}`;
        const method = "get";
        const response = await this.axios[method](`https://${databaseId}.${this.dbDomain}${path}`);
        return response.data;
    }
    async deleteIndex(databaseId, collection_name, index_name) {
        const rawPath = "/collection/{collection_name}/index/{field_name}";
        const path = `/collection/${collection_name}/index/${index_name}`;
        const method = "delete";
        const response = await this.axios[method](`https://${databaseId}.${this.dbDomain}${path}`);
        // @ts-expect-error
        this.dispatchEvent(new Event('indexDeleted'));
        return response.data;
    }
    async insertDocument(databaseId, collection_name, document) {
        const rawPath = "/collection/{collection_name}/document";
        const path = `/collection/${collection_name}/document`;
        const method = "post";
        const body = {
            documents: [
                document
            ]
        };
        const response = await this.axios[method](`https://${databaseId}.${this.dbDomain}${path}`, body);
        return response.data;
    }
    async searchNearestDocuments(databaseId, collection_name, vector, field_name, max_neighbors) {
        const rawPath = "/collection/{collection_name}/document/search";
        const path = `/collection/${collection_name}/document/search`;
        const method = "post";
        const body = {
            vectors: [
                vector
            ],
            field_name: field_name,
            max_neighbors: max_neighbors
        };
        const response = await this.axios[method](`https://${databaseId}.${this.dbDomain}${path}`, body);
        return response.data;
    }
    async getDocument(databaseId, collection_name, id) {
        const rawPath = "/collection/{collection_name}/document/{document_id}";
        const path = `/collection/${collection_name}/document/${id}`;
        const method = "get";
        const response = await this.axios[method](`https://${databaseId}.${this.dbDomain}${path}`);
        return response.data;
    }
    async deleteDocument(databaseId, collection_name, id) {
        const rawPath = "/collection/{collection_name}/document/{document_id}";
        const path = `/collection/${collection_name}/document/${id}`;
        const method = "delete";
        const response = await this.axios[method](`https://${databaseId}.${this.dbDomain}${path}`);
        return response.data;
    }
}


export {$149c1bd638913645$export$5192b5e175132710 as HIDDB};
//# sourceMappingURL=module.js.map
