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
export class HIDDB extends EventTarget {
    constructor(params: {
        key?: string;
        secret?: string;
        baseURL?: string;
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
    logout(): void;
    userRegister(email: string, password: string): Promise<unknown>;
    userUpdateVerify(userId: string, otp: string): Promise<unknown>;
    userResetPassword(email: string): Promise<unknown>;
    userUpdateResetPassword(userId: string, otp: string, password: string): Promise<unknown>;
    userLogin(email: string, password: string): Promise<void>;
    userRefresh(): Promise<void>;
    machineLogin(key: string, secret: string): Promise<void>;
    createMachineAccount(machineName: string, permission: "read" | "write" | "admin"): Promise<{
        machine_name: string;
        id: string;
        key: string;
        secret: string;
        permission: "write" | "read" | "admin";
    }>;
    getMachineAccounts(): Promise<{
        machines?: {
            machine_name: string;
            id: string;
            key: string;
            permission: "write" | "read" | "admin";
        }[];
    }>;
    deleteMachineAccount(machineId: string): Promise<unknown>;
    createDatabase(name: string, instances: [{
        type: "xs" | "s" | "m" | "l" | "xl";
        volume_size: number;
    }]): Promise<{
        id: string;
        database_name: string;
        organization_id: string;
        created_at: string;
        deleted_at: string;
        instances: {
            id: string;
            created_at: string;
            deleted_at: string;
            status: "awake" | "provisioning" | "asleep";
            type: "s" | "xs" | "m" | "l" | "xl";
            server: {
                id: string;
            };
            volume_size: number;
        }[];
    }>;
    listDatabases(): Promise<{
        databases: {
            id: string;
            database_name: string;
            organization_id: string;
            created_at: string;
            deleted_at: string;
            instances: {
                id: string;
                created_at: string;
                deleted_at: string;
                status: "awake" | "provisioning" | "asleep";
                type: "s" | "xs" | "m" | "l" | "xl";
                server: {
                    id: string;
                };
                volume_size: number;
            }[];
        }[];
    }>;
    getDatabase(id: string): Promise<{
        id: string;
        database_name: string;
        organization_id: string;
        created_at: string;
        deleted_at: string;
        instances: {
            id: string;
            created_at: string;
            deleted_at: string;
            status: "awake" | "provisioning" | "asleep";
            type: "s" | "xs" | "m" | "l" | "xl";
            server: {
                id: string;
            };
            volume_size: number;
        }[];
    }>;
    deleteDatabase(id: string): Promise<{
        id: string;
        database_name: string;
        organization_id: string;
        created_at: string;
        deleted_at: string;
        instances: {
            id: string;
            created_at: string;
            deleted_at: string;
            status: "awake" | "provisioning" | "asleep";
            type: "s" | "xs" | "m" | "l" | "xl";
            server: {
                id: string;
            };
            volume_size: number;
        }[];
    }>;
    createInstance(id: string, volume_size: number, type: "xs" | "s" | "m" | "l" | "xl"): Promise<{
        id: string;
        created_at: string;
        deleted_at: string;
        status: "awake" | "provisioning" | "asleep";
        type: "s" | "xs" | "m" | "l" | "xl";
        server: {
            id: string;
        };
        volume_size: number;
    }>;
    listInstances(): Promise<{
        instances: {
            id: string;
            created_at: string;
            deleted_at: string;
            status: "awake" | "provisioning" | "asleep";
            type: "s" | "xs" | "m" | "l" | "xl";
            server: {
                id: string;
            };
            volume_size: number;
        }[];
    }>;
    getInstance(id: string): Promise<{
        id: string;
        created_at: string;
        deleted_at: string;
        status: "awake" | "provisioning" | "asleep";
        type: "s" | "xs" | "m" | "l" | "xl";
        server: {
            id: string;
        };
        volume_size: number;
    }>;
    deleteInstance(id: string): Promise<{
        id: string;
        created_at: string;
        deleted_at: string;
        status: "awake" | "provisioning" | "asleep";
        type: "s" | "xs" | "m" | "l" | "xl";
        server: {
            id: string;
        };
        volume_size: number;
    }>;
    createCollection(databaseId: string, name: string): Promise<{
        collection_name: string;
    }>;
    listCollections(databaseId: string): Promise<{
        collections: {
            collection_name: string;
        }[];
    }>;
    getCollection(databaseId: string, name: string): Promise<{
        collection_name: string;
    }>;
    deleteCollection(databaseId: string, name: string): Promise<{
        collection_name: string;
    }>;
    createIndex(databaseId: string, collection_name: string, field_name: string, dimension: number): Promise<{
        collection_name: string;
        field_name: string;
        n_documents: number;
        distance_metric: "euclidean";
        dimension: number;
    }>;
    listIndices(databaseId: string, collection_name: string): Promise<{
        indices: {
            collection_name: string;
            field_name: string;
            n_documents: number;
            distance_metric: "euclidean";
            dimension: number;
        }[];
    }>;
    getIndex(databaseId: string, collection_name: string, index_name: string): Promise<{
        collection_name: string;
        field_name: string;
        n_documents: number;
        distance_metric: "euclidean";
        dimension: number;
    }>;
    deleteIndex(databaseId: string, collection_name: string, index_name: string): Promise<{
        collection_name: string;
        field_name: string;
        n_documents: number;
        distance_metric: "euclidean";
        dimension: number;
    }>;
    insertDocument(databaseId: string, collection_name: string, document: {
        id: string;
        [key: string]: string;
    }): Promise<unknown>;
    searchNearestDocuments(databaseId: string, collection_name: string, vector: [number], field_name: string, max_neighbors: number): Promise<{
        data?: string[][];
    }[]>;
    getDocument(databaseId: string, collection_name: string, id: string): Promise<{
        id: string;
        field?: number[];
    } & {
        [key: string]: unknown;
    }>;
    deleteDocument(databaseId: string, collection_name: string, id: string): Promise<{
        id: string;
        field?: number[];
    } & {
        [key: string]: unknown;
    }>;
}

//# sourceMappingURL=types.d.ts.map
