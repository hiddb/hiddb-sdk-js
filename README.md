# HIDDB SDK for Typescript & Javascript

The official SDK for the [HIDDB](https://hiddb.com) vector database.

## Installation

To install the SDK type

```bash
npm install hiddb
```

Example usage:

```typescript
import { HIDDB } from 'hiddb';

async function main() {
    const hiddb = new HIDDB();
    await hiddb.machineLogin("<key>", "<secret>")

    // ...
}
```

We are working on more examples 🔨
Meanwhile have a look at our [API documentation](https://docs.hiddb.com).

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.
