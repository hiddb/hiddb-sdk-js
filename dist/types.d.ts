type JWT = {
    sub: string;
    amr: [string];
    scope: string;
    email: string;
    email_verified: boolean;
    role: string;
    plan: string;
    organization: string;
    iat: number;
    exp: number;
};
type Events = ({
    type: 'login';
} & CustomEvent<JWT>) | ({
    type: 'logout';
} & Event) | ({
    type: 'databaseCreated';
} & Event) | ({
    type: 'databaseDeleted';
} & Event) | ({
    type: 'instanceCreated';
} & Event) | ({
    type: 'instanceDeleted';
} & Event) | ({
    type: 'collectionCreated';
} & Event) | ({
    type: 'collectionDeleted';
} & Event) | ({
    type: 'indexCreated';
} & Event) | ({
    type: 'indexDeleted';
} & Event);
declare class State {
    constructor(hiddb: HIDDB, key?: string, secret?: string);
    get accessToken(): string;
    get machineKey(): string;
    get machineSecret(): string;
    set accessToken(accessToken: string);
}
export class HIDDB extends EventTarget {
    state: State;
    constructor(params: {
        key?: string;
        secret?: string;
        apiDomain?: string;
        dbDomain?: string;
        secure?: boolean;
    });
    dispatchEvent<T extends Events['type'], E extends Events & {
        type: T;
    }>(event: E): boolean;
    addEventListener<T extends Events['type'], E extends Events & {
        type: T;
    }>(type: T, callback: ((e: E) => void) | {
        handleEvent: (e: E) => void;
    } | null): void;
    removeEventListener(type: Events['type']): void;
    isAuthenticated(): boolean;
    machineLogin(key: string, secret: string): Promise<void>;
    createMachineAccount(machineName: string, permission: "read" | "write" | "admin"): Promise<{
        machine_name?: string;
        id?: string;
        key?: string;
        secret?: string;
        permission?: "write" | "read" | "admin";
    }>;
    getMachineAccounts(): Promise<{
        machines?: {
            machine_name?: string;
            id?: string;
            key?: string;
            permission?: "write" | "read" | "admin";
        }[];
    }>;
    deleteMachineAccount(machineId: string): Promise<unknown>;
    createDatabase(name: string, instances: [{
        type: "xs" | "s" | "m" | "l" | "xl";
        volume_size: number;
    }]): Promise<{
        id?: string;
        database_name?: string;
        organization_id?: string;
        created_at?: string;
        deleted_at?: string;
        instances?: {
            id?: string;
            created_at?: string;
            deleted_at?: string;
            status?: "awake" | "provisioning" | "wakingup" | "asleep";
            type?: "s" | "xs" | "m" | "l" | "xl";
            server?: {
                id?: string;
            };
            volume_size?: number;
            location?: "hel1" | "nbg1" | "fsn1";
        }[];
    }>;
    listDatabases(): Promise<{
        databases?: {
            id?: string;
            database_name?: string;
            organization_id?: string;
            created_at?: string;
            deleted_at?: string;
            instances?: {
                id?: string;
                created_at?: string;
                deleted_at?: string;
                status?: "awake" | "provisioning" | "wakingup" | "asleep";
                type?: "s" | "xs" | "m" | "l" | "xl";
                server?: {
                    id?: string;
                };
                volume_size?: number;
                location?: "hel1" | "nbg1" | "fsn1";
            }[];
        }[];
    }>;
    getDatabase(id: string): Promise<{
        id?: string;
        database_name?: string;
        organization_id?: string;
        created_at?: string;
        deleted_at?: string;
        instances?: {
            id?: string;
            created_at?: string;
            deleted_at?: string;
            status?: "awake" | "provisioning" | "wakingup" | "asleep";
            type?: "s" | "xs" | "m" | "l" | "xl";
            server?: {
                id?: string;
            };
            volume_size?: number;
            location?: "hel1" | "nbg1" | "fsn1";
        }[];
    }>;
    deleteDatabase(id: string): Promise<{
        id?: string;
        database_name?: string;
        organization_id?: string;
        created_at?: string;
        deleted_at?: string;
        instances?: {
            id?: string;
            created_at?: string;
            deleted_at?: string;
            status?: "awake" | "provisioning" | "wakingup" | "asleep";
            type?: "s" | "xs" | "m" | "l" | "xl";
            server?: {
                id?: string;
            };
            volume_size?: number;
            location?: "hel1" | "nbg1" | "fsn1";
        }[];
    }>;
    createInstance(id: string, volume_size: number, type: "xs" | "s" | "m" | "l" | "xl"): Promise<{
        id?: string;
        created_at?: string;
        deleted_at?: string;
        status?: "awake" | "provisioning" | "wakingup" | "asleep";
        type?: "s" | "xs" | "m" | "l" | "xl";
        server?: {
            id?: string;
        };
        volume_size?: number;
        location?: "hel1" | "nbg1" | "fsn1";
    }>;
    listInstances(): Promise<{
        instances: {
            id?: string;
            created_at?: string;
            deleted_at?: string;
            status?: "awake" | "provisioning" | "wakingup" | "asleep";
            type?: "s" | "xs" | "m" | "l" | "xl";
            server?: {
                id?: string;
            };
            volume_size?: number;
            location?: "hel1" | "nbg1" | "fsn1";
        }[];
    }>;
    getInstance(id: string): Promise<{
        id?: string;
        created_at?: string;
        deleted_at?: string;
        status?: "awake" | "provisioning" | "wakingup" | "asleep";
        type?: "s" | "xs" | "m" | "l" | "xl";
        server?: {
            id?: string;
        };
        volume_size?: number;
        location?: "hel1" | "nbg1" | "fsn1";
    }>;
    deleteInstance(id: string): Promise<{
        id?: string;
        created_at?: string;
        deleted_at?: string;
        status?: "awake" | "provisioning" | "wakingup" | "asleep";
        type?: "s" | "xs" | "m" | "l" | "xl";
        server?: {
            id?: string;
        };
        volume_size?: number;
        location?: "hel1" | "nbg1" | "fsn1";
    }>;
    createCollection(databaseId: string, name: string): Promise<{
        collection_name?: string;
    }>;
    listCollections(databaseId: string): Promise<{
        collections?: {
            collection_name?: string;
        }[];
    }>;
    getCollection(databaseId: string, name: string): Promise<{
        collection_name?: string;
    }>;
    deleteCollection(databaseId: string, name: string): Promise<{
        collection_name?: string;
    }>;
    createIndex(databaseId: string, collection_name: string, field_name: string, dimension: number): Promise<{
        collection_name?: string;
        field_name?: string;
        n_documents?: number;
        distance_metric?: "euclidean";
        dimension?: number;
    }>;
    listIndices(databaseId: string, collection_name: string): Promise<{
        indices?: {
            collection_name?: string;
            field_name?: string;
            n_documents?: number;
            distance_metric?: "euclidean";
            dimension?: number;
        }[];
    }>;
    getIndex(databaseId: string, collection_name: string, index_name: string): Promise<{
        collection_name?: string;
        field_name?: string;
        n_documents?: number;
        distance_metric?: "euclidean";
        dimension?: number;
    }>;
    deleteIndex(databaseId: string, collection_name: string, index_name: string): Promise<{
        collection_name?: string;
        field_name?: string;
        n_documents?: number;
        distance_metric?: "euclidean";
        dimension?: number;
    }>;
    insertDocument(databaseId: string, collection_name: string, document: {
        id: string;
        [key: string]: string;
    }): Promise<unknown>;
    searchNearestDocuments(databaseId: string, collection_name: string, vector: [number], field_name: string, max_neighbors: number): Promise<{
        data?: string[][];
    }[]>;
    getDocument(databaseId: string, collection_name: string, id: string): Promise<{
        id?: string;
        field?: number[];
    } & {
        [key: string]: unknown;
    }>;
    deleteDocument(databaseId: string, collection_name: string, id: string): Promise<{
        id?: string;
        field?: number[];
    } & {
        [key: string]: unknown;
    }>;
}

//# sourceMappingURL=types.d.ts.map
