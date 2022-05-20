/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
  "/machine/login": {
    /** Machine login using access and secret token. */
    post: operations["machineLogin"];
  };
  "/machine": {
    /** Get all machines in organization */
    get: operations["getMachines"];
    /** Create a new machine account. */
    post: operations["createMachine"];
  };
  "/machine/{machine_id}": {
    /** Delete machine account */
    delete: operations["deleteMachine"];
    parameters: {
      path: {
        /** The ID of the machine */
        machine_id: string;
      };
    };
  };
  "/database": {
    /** Get information about databases */
    get: {
      responses: {
        /** successful operation */
        200: {
          content: {
            "application/json": {
              databases: {
                id: string;
                database_name: string;
                /** @example xxxxxxxxxxxxxxxxxx */
                organization_id: string;
                /** Format: date-time */
                created_at: string;
                /** Format: date-time */
                deleted_at: string | null;
                instances: {
                  id: string;
                  /** Format: date-time */
                  created_at: string;
                  /** Format: date-time */
                  deleted_at: string | null;
                  /** @enum {string} */
                  status: "awake" | "provisioning" | "wakingup" | "asleep";
                  /**
                   * @description Instance type
                   * @default s
                   * @example s
                   * @enum {string}
                   */
                  type: "xs" | "s" | "m" | "l" | "xl";
                  server: {
                    id?: string;
                  } | null;
                  /**
                   * @description Size of mounted and volume in gb
                   * @default 10
                   * @example 100
                   */
                  volume_size: number;
                  /**
                   * @description Physical instance location
                   * @enum {string}
                   */
                  location: "hel1" | "nbg1" | "fsn1";
                }[];
              }[];
            };
          };
        };
        /** error */
        default: {
          content: {
            "application/json": {
              error?: string;
            } & { [key: string]: unknown };
          };
        };
      };
    };
    /** Create new database */
    post: {
      responses: {
        /** successful operation */
        202: {
          content: {
            "application/json": {
              id: string;
              database_name: string;
              /** @example xxxxxxxxxxxxxxxxxx */
              organization_id: string;
              /** Format: date-time */
              created_at: string;
              /** Format: date-time */
              deleted_at: string | null;
              instances: {
                id: string;
                /** Format: date-time */
                created_at: string;
                /** Format: date-time */
                deleted_at: string | null;
                /** @enum {string} */
                status: "awake" | "provisioning" | "wakingup" | "asleep";
                /**
                 * @description Instance type
                 * @default s
                 * @example s
                 * @enum {string}
                 */
                type: "xs" | "s" | "m" | "l" | "xl";
                server: {
                  id?: string;
                } | null;
                /**
                 * @description Size of mounted and volume in gb
                 * @default 10
                 * @example 100
                 */
                volume_size: number;
                /**
                 * @description Physical instance location
                 * @enum {string}
                 */
                location: "hel1" | "nbg1" | "fsn1";
              }[];
            };
          };
        };
        /** error */
        default: {
          content: {
            "application/json": {
              error?: string;
            } & { [key: string]: unknown };
          };
        };
      };
      /** Newly created database. */
      requestBody: {
        content: {
          "application/json": {
            database_name: string;
            instances?: {
              /** @enum {string} */
              location?: "hel1" | "nbg1" | "fsn1";
              /** @enum {string} */
              type?: "xs" | "s" | "m" | "l" | "xl";
              /**
               * @description Size of mounted and volume in gb
               * @default 10
               * @example 100
               */
              volume_size?: number;
            }[];
          };
        };
      };
    };
  };
  "/database/{database_id}": {
    /** Get information about specific database */
    get: {
      parameters: {
        path: {
          /** The ID of the database */
          database_id: string;
        };
      };
      responses: {
        /** successful operation */
        200: {
          content: {
            "application/json": {
              id: string;
              database_name: string;
              /** @example xxxxxxxxxxxxxxxxxx */
              organization_id: string;
              /** Format: date-time */
              created_at: string;
              /** Format: date-time */
              deleted_at: string | null;
              instances: {
                id: string;
                /** Format: date-time */
                created_at: string;
                /** Format: date-time */
                deleted_at: string | null;
                /** @enum {string} */
                status: "awake" | "provisioning" | "wakingup" | "asleep";
                /**
                 * @description Instance type
                 * @default s
                 * @example s
                 * @enum {string}
                 */
                type: "xs" | "s" | "m" | "l" | "xl";
                server: {
                  id?: string;
                } | null;
                /**
                 * @description Size of mounted and volume in gb
                 * @default 10
                 * @example 100
                 */
                volume_size: number;
                /**
                 * @description Physical instance location
                 * @enum {string}
                 */
                location: "hel1" | "nbg1" | "fsn1";
              }[];
            };
          };
        };
        /** error */
        default: {
          content: {
            "application/json": {
              error?: string;
            } & { [key: string]: unknown };
          };
        };
      };
    };
    /** Delete a specific database */
    delete: {
      parameters: {
        path: {
          /** The ID of the database */
          database_id: string;
        };
      };
      responses: {
        /** successful operation */
        202: {
          content: {
            "application/json": {
              id: string;
              database_name: string;
              /** @example xxxxxxxxxxxxxxxxxx */
              organization_id: string;
              /** Format: date-time */
              created_at: string;
              /** Format: date-time */
              deleted_at: string | null;
              instances: {
                id: string;
                /** Format: date-time */
                created_at: string;
                /** Format: date-time */
                deleted_at: string | null;
                /** @enum {string} */
                status: "awake" | "provisioning" | "wakingup" | "asleep";
                /**
                 * @description Instance type
                 * @default s
                 * @example s
                 * @enum {string}
                 */
                type: "xs" | "s" | "m" | "l" | "xl";
                server: {
                  id?: string;
                } | null;
                /**
                 * @description Size of mounted and volume in gb
                 * @default 10
                 * @example 100
                 */
                volume_size: number;
                /**
                 * @description Physical instance location
                 * @enum {string}
                 */
                location: "hel1" | "nbg1" | "fsn1";
              }[];
            };
          };
        };
        /** error */
        default: {
          content: {
            "application/json": {
              error?: string;
            } & { [key: string]: unknown };
          };
        };
      };
    };
    parameters: {
      path: {
        /** The ID of the database */
        database_id: string;
      };
    };
  };
  "/instance": {
    /** Get information about instances */
    get: {
      responses: {
        /** successful operation */
        200: {
          content: {
            "application/json": {
              instances: {
                id: string;
                /** Format: date-time */
                created_at: string;
                /** Format: date-time */
                deleted_at: string | null;
                /** @enum {string} */
                status: "awake" | "provisioning" | "wakingup" | "asleep";
                /**
                 * @description Instance type
                 * @default s
                 * @example s
                 * @enum {string}
                 */
                type: "xs" | "s" | "m" | "l" | "xl";
                server: {
                  id?: string;
                } | null;
                /**
                 * @description Size of mounted and volume in gb
                 * @default 10
                 * @example 100
                 */
                volume_size: number;
                /**
                 * @description Physical instance location
                 * @enum {string}
                 */
                location: "hel1" | "nbg1" | "fsn1";
              }[];
            };
          };
        };
        /** error */
        default: {
          content: {
            "application/json": {
              error?: string;
            } & { [key: string]: unknown };
          };
        };
      };
    };
    /** Create new instance */
    post: {
      responses: {
        /** successful operation */
        202: {
          content: {
            "application/json": {
              id: string;
              /** Format: date-time */
              created_at: string;
              /** Format: date-time */
              deleted_at: string | null;
              /** @enum {string} */
              status: "awake" | "provisioning" | "wakingup" | "asleep";
              /**
               * @description Instance type
               * @default s
               * @example s
               * @enum {string}
               */
              type: "xs" | "s" | "m" | "l" | "xl";
              server: {
                id?: string;
              } | null;
              /**
               * @description Size of mounted and volume in gb
               * @default 10
               * @example 100
               */
              volume_size: number;
              /**
               * @description Physical instance location
               * @enum {string}
               */
              location: "hel1" | "nbg1" | "fsn1";
            };
          };
        };
        /** error */
        default: {
          content: {
            "application/json": {
              error?: string;
            } & { [key: string]: unknown };
          };
        };
      };
      /** Newly created Instance. */
      requestBody: {
        content: {
          "application/json": {
            /** @example xxxxxxxxxxxxxxxxxx */
            database_id: string;
            /**
             * @description Instance type
             * @default s
             * @example s
             * @enum {string}
             */
            type?: "xs" | "s" | "m" | "l" | "xl";
            /**
             * @description Size of mounted and volume in gb
             * @default 10
             * @example 100
             */
            volume_size?: number;
            /**
             * @description Physical instance location
             * @enum {string}
             */
            location?: "hel1" | "nbg1" | "fsn1";
          };
        };
      };
    };
  };
  "/instance/{instance_id}": {
    /** Get information about specific instance */
    get: {
      parameters: {
        path: {
          /** The ID of the instance */
          instance_id: string;
        };
      };
      responses: {
        /** successful operation */
        200: {
          content: {
            "application/json": {
              id: string;
              /** Format: date-time */
              created_at: string;
              /** Format: date-time */
              deleted_at: string | null;
              /** @enum {string} */
              status: "awake" | "provisioning" | "wakingup" | "asleep";
              /**
               * @description Instance type
               * @default s
               * @example s
               * @enum {string}
               */
              type: "xs" | "s" | "m" | "l" | "xl";
              server: {
                id?: string;
              } | null;
              /**
               * @description Size of mounted and volume in gb
               * @default 10
               * @example 100
               */
              volume_size: number;
              /**
               * @description Physical instance location
               * @enum {string}
               */
              location: "hel1" | "nbg1" | "fsn1";
            };
          };
        };
        /** error */
        default: {
          content: {
            "application/json": {
              error?: string;
            } & { [key: string]: unknown };
          };
        };
      };
    };
    /** Awake or put instance to sleep */
    put: {
      parameters: {
        path: {
          /** The ID of the instance */
          instance_id: string;
        };
      };
      responses: {
        /** successful operation */
        200: {
          content: {
            "application/json": {
              id: string;
              /** Format: date-time */
              created_at: string;
              /** Format: date-time */
              deleted_at: string | null;
              /** @enum {string} */
              status: "awake" | "provisioning" | "wakingup" | "asleep";
              /**
               * @description Instance type
               * @default s
               * @example s
               * @enum {string}
               */
              type: "xs" | "s" | "m" | "l" | "xl";
              server: {
                id?: string;
              } | null;
              /**
               * @description Size of mounted and volume in gb
               * @default 10
               * @example 100
               */
              volume_size: number;
              /**
               * @description Physical instance location
               * @enum {string}
               */
              location: "hel1" | "nbg1" | "fsn1";
            };
          };
        };
        /** error */
        default: {
          content: {
            "application/json": {
              error?: string;
            } & { [key: string]: unknown };
          };
        };
      };
      requestBody: {
        content: {
          "application/json": {
            /** @enum {string} */
            status: "awake" | "asleep";
          };
        };
      };
    };
    /** Delete a specific Instance */
    delete: {
      parameters: {
        path: {
          /** The ID of the instance */
          instance_id: string;
        };
      };
      responses: {
        /** successful operation */
        202: {
          content: {
            "application/json": {
              id: string;
              /** Format: date-time */
              created_at: string;
              /** Format: date-time */
              deleted_at: string | null;
              /** @enum {string} */
              status: "awake" | "provisioning" | "wakingup" | "asleep";
              /**
               * @description Instance type
               * @default s
               * @example s
               * @enum {string}
               */
              type: "xs" | "s" | "m" | "l" | "xl";
              server: {
                id?: string;
              } | null;
              /**
               * @description Size of mounted and volume in gb
               * @default 10
               * @example 100
               */
              volume_size: number;
              /**
               * @description Physical instance location
               * @enum {string}
               */
              location: "hel1" | "nbg1" | "fsn1";
            };
          };
        };
        /** error */
        default: {
          content: {
            "application/json": {
              error?: string;
            } & { [key: string]: unknown };
          };
        };
      };
    };
    parameters: {
      path: {
        /** The ID of the instance */
        instance_id: string;
      };
    };
  };
  "/collection": {
    /** Get information about collections */
    get: {
      responses: {
        /** successful operation */
        200: {
          content: {
            "application/json": {
              collections: {
                /** @example xxxxxxxxxxxxxxxxxx */
                collection_name: string;
              }[];
            };
          };
        };
        /** error */
        default: {
          content: {
            "application/json": {
              error?: string;
            } & { [key: string]: unknown };
          };
        };
      };
    };
    /** Create new collection */
    post: {
      responses: {
        /** successful operation */
        200: {
          content: {
            "application/json": {
              /** @example xxxxxxxxxxxxxxxxxx */
              collection_name: string;
            };
          };
        };
        /** error */
        default: {
          content: {
            "application/json": {
              error?: string;
            } & { [key: string]: unknown };
          };
        };
      };
      requestBody: {
        content: {
          "application/json": {
            /** @example xxxxxxxxxxxxxxxxxx */
            collection_name: string;
          };
        };
      };
    };
  };
  "/collection/{collection_name}": {
    /** Get information about a specific collection */
    get: {
      parameters: {
        path: {
          collection_name: string;
        };
      };
      responses: {
        /** successful operation */
        200: {
          content: {
            "application/json": {
              /** @example xxxxxxxxxxxxxxxxxx */
              collection_name: string;
            };
          };
        };
        /** error */
        default: {
          content: {
            "application/json": {
              error?: string;
            } & { [key: string]: unknown };
          };
        };
      };
    };
    /** Delete a specific collection */
    delete: {
      parameters: {
        path: {
          collection_name: string;
        };
      };
      responses: {
        /** successful operation */
        200: {
          content: {
            "application/json": {
              /** @example xxxxxxxxxxxxxxxxxx */
              collection_name: string;
            };
          };
        };
        /** error */
        default: {
          content: {
            "application/json": {
              error?: string;
            } & { [key: string]: unknown };
          };
        };
      };
    };
  };
  "/collection/{collection_name}/index": {
    /** Get information about an existing indices */
    get: {
      parameters: {
        path: {
          /** The ID of the collection */
          collection_name: string;
        };
      };
      responses: {
        /** successful operation */
        200: {
          content: {
            "application/json": {
              indices: {
                /** @example xxxxxxxxxxxxxxxxxx */
                collection_name: string;
                /** @example xxxxxxxxxxxxxxxxxx */
                field_name: string;
                /** Format: int64 */
                n_documents: number;
                /** @enum {string} */
                distance_metric: "euclidean";
                /** Format: int64 */
                dimension: number;
              }[];
            };
          };
        };
        /** error */
        default: {
          content: {
            "application/json": {
              error?: string;
            } & { [key: string]: unknown };
          };
        };
      };
    };
    /** Create new index in the specified collection */
    post: {
      parameters: {
        path: {
          /** The ID of the collection */
          collection_name: string;
        };
      };
      responses: {
        /** successful operation */
        200: {
          content: {
            "application/json": {
              /** @example xxxxxxxxxxxxxxxxxx */
              collection_name: string;
              /** @example xxxxxxxxxxxxxxxxxx */
              field_name: string;
              /** Format: int64 */
              n_documents: number;
              /** @enum {string} */
              distance_metric: "euclidean";
              /** Format: int64 */
              dimension: number;
            };
          };
        };
        /** error */
        default: {
          content: {
            "application/json": {
              error?: string;
            } & { [key: string]: unknown };
          };
        };
      };
      requestBody: {
        content: {
          "application/json": {
            /** @example xxxxxxxxxxxxxxxxxx */
            field_name: string;
            /** Format: int64 */
            dimension: number;
          };
        };
      };
    };
    parameters: {
      path: {
        /** The ID of the collection */
        collection_name: string;
      };
    };
  };
  "/collection/{collection_name}/index/{field_name}": {
    /** Get information about specific index */
    get: {
      parameters: {
        path: {
          /** The ID of the collection */
          collection_name: string;
          /** The ID of the index */
          field_name: string;
        };
      };
      responses: {
        /** successful operation */
        200: {
          content: {
            "application/json": {
              /** @example xxxxxxxxxxxxxxxxxx */
              collection_name: string;
              /** @example xxxxxxxxxxxxxxxxxx */
              field_name: string;
              /** Format: int64 */
              n_documents: number;
              /** @enum {string} */
              distance_metric: "euclidean";
              /** Format: int64 */
              dimension: number;
            };
          };
        };
        /** error */
        default: {
          content: {
            "application/json": {
              error?: string;
            } & { [key: string]: unknown };
          };
        };
      };
    };
    /** Delete index */
    delete: {
      parameters: {
        path: {
          /** The ID of the collection */
          collection_name: string;
          /** The ID of the index */
          field_name: string;
        };
      };
      responses: {
        /** successful operation */
        200: {
          content: {
            "application/json": {
              /** @example xxxxxxxxxxxxxxxxxx */
              collection_name: string;
              /** @example xxxxxxxxxxxxxxxxxx */
              field_name: string;
              /** Format: int64 */
              n_documents: number;
              /** @enum {string} */
              distance_metric: "euclidean";
              /** Format: int64 */
              dimension: number;
            };
          };
        };
        /** error */
        default: {
          content: {
            "application/json": {
              error?: string;
            } & { [key: string]: unknown };
          };
        };
      };
    };
    parameters: {
      path: {
        /** The ID of the collection */
        collection_name: string;
        /** The ID of the index */
        field_name: string;
      };
    };
  };
  "/collection/{collection_name}/document": {
    /** Insert document. The field "field_name" will be indexed by all existing indices */
    post: {
      parameters: {
        path: {
          /** The ID of the collection */
          collection_name: string;
        };
      };
      responses: {
        /** Insertion successful */
        200: unknown;
        /** error */
        default: {
          content: {
            "application/json": {
              error?: string;
            } & { [key: string]: unknown };
          };
        };
      };
      requestBody: {
        content: {
          "application/json": {
            documents: ({
              id: string;
              /** @example 1,2,3 */
              field?: number[];
            } & { [key: string]: unknown })[];
          };
        };
      };
    };
    parameters: {
      path: {
        /** The ID of the collection */
        collection_name: string;
      };
    };
  };
  "/collection/{collection_name}/document/search": {
    /** Search for nearest vectors to specified vector. Instead of specifying `vector: <array>` you can search for similar documents directly by setting `id: <document_id>` instead */
    post: {
      parameters: {
        path: {
          /** The ID of the collection */
          collection_name: string;
        };
      };
      responses: {
        /** Insertion successful */
        200: {
          content: {
            "application/json": {
              data: string[][];
            }[];
          };
        };
        /** error */
        default: {
          content: {
            "application/json": {
              error?: string;
            } & { [key: string]: unknown };
          };
        };
      };
      requestBody: {
        content: {
          "application/json": {
            /**
             * @description Get documents close to the specified document. Provide either `ids` or `vectors`
             * @example document1,document2,document3
             */
            ids?: string[];
            /**
             * @description Get documents close to the vector. The length of the vector must be equal to the dimension specified in the index
             * @example 1,2,3
             */
            vectors?: number[][];
            /**
             * @description Maximal number of neighbors to include in response
             * @default 20
             */
            max_neighbors: number;
            /**
             * @description This parameter specifies the index to perform the query in
             * @example xxxxxxxxxxxxxxxxxx
             */
            field_name: string;
          };
        };
      };
    };
    parameters: {
      path: {
        /** The ID of the collection */
        collection_name: string;
      };
    };
  };
  "/collection/{collection_name}/document/{document_id}": {
    /** Get document by ID */
    get: {
      parameters: {
        path: {
          /** The ID of the collection */
          collection_name: string;
          /** The ID of the index */
          document_id: string;
        };
      };
      responses: {
        /** Insertion successful */
        200: {
          content: {
            "application/json": {
              id: string;
              /** @example 1,2,3 */
              field?: number[];
            } & { [key: string]: unknown };
          };
        };
        /** error */
        default: {
          content: {
            "application/json": {
              error?: string;
            } & { [key: string]: unknown };
          };
        };
      };
    };
    /** COMING SOON! Remove document by ID. The corresponding indices will be updated */
    delete: {
      parameters: {
        path: {
          /** The ID of the collection */
          collection_name: string;
          /** The ID of the index */
          document_id: string;
        };
      };
      responses: {
        /** Insertion successful */
        200: {
          content: {
            "application/json": {
              id: string;
              /** @example 1,2,3 */
              field?: number[];
            } & { [key: string]: unknown };
          };
        };
        /** error */
        default: {
          content: {
            "application/json": {
              error?: string;
            } & { [key: string]: unknown };
          };
        };
      };
    };
    parameters: {
      path: {
        /** The ID of the collection */
        collection_name: string;
        /** The ID of the index */
        document_id: string;
      };
    };
  };
}

export interface components {}

export interface operations {
  /** Machine login using access and secret token. */
  machineLogin: {
    responses: {
      /** successful operation */
      200: {
        content: {
          "application/json": {
            access_token: string;
            /** @enum {string} */
            type: "Bearer";
          };
        };
      };
      /** error */
      default: {
        content: {
          "application/json": {
            error?: string;
          } & { [key: string]: unknown };
        };
      };
    };
    /** Exchange access and secret token for JSON web token (JWT). */
    requestBody: {
      content: {
        "application/json": {
          access_key: string;
          secret_key: string;
        };
      };
    };
  };
  /** Get all machines in organization */
  getMachines: {
    responses: {
      /** successful operation */
      200: {
        content: {
          "application/json": {
            machines: {
              machine_name: string;
              id: string;
              key: string;
              /** @enum {string} */
              permission: "write" | "read" | "admin";
            }[];
          };
        };
      };
      /** error */
      default: {
        content: {
          "application/json": {
            error?: string;
          } & { [key: string]: unknown };
        };
      };
    };
  };
  /** Create a new machine account. */
  createMachine: {
    responses: {
      /** successful operation */
      200: {
        content: {
          "application/json": {
            machine_name: string;
            id: string;
            key: string;
            secret: string;
            /** @enum {string} */
            permission: "write" | "read" | "admin";
          };
        };
      };
      /** error */
      default: {
        content: {
          "application/json": {
            error?: string;
          } & { [key: string]: unknown };
        };
      };
    };
    requestBody: {
      content: {
        "application/json": {
          machine_name: string;
          /** @enum {string} */
          permission: "write" | "read" | "admin";
        };
      };
    };
  };
  /** Delete machine account */
  deleteMachine: {
    parameters: {
      path: {
        /** The ID of the machine */
        machine_id: string;
      };
    };
    responses: {
      /** successful operation */
      200: unknown;
      /** error */
      default: {
        content: {
          "application/json": {
            error?: string;
          } & { [key: string]: unknown };
        };
      };
    };
  };
}

export interface external {}
