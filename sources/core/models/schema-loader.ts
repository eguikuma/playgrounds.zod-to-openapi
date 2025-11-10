import fs from "fs";
import path from "path";

import { SchemaError } from "../errors";

export class SchemaLoader {
  constructor(private readonly rootDirectory: string) {}

  async load(endpointFileName: string, directories: string[]): Promise<void> {
    const schemaDirectories = await this.findSchemaDirectories(directories);

    for (const schemaDirectory of schemaDirectories) {
      const endpointFile = path.join(schemaDirectory, endpointFileName);

      if (fs.existsSync(endpointFile)) {
        try {
          await import(path.resolve(endpointFile));
        } catch (_e) {
          throw new SchemaError(`Failed to load "${endpointFile}"`);
        }
      }
    }
  }

  private async findSchemaDirectories(
    targetDirectories: string[],
  ): Promise<string[]> {
    const foundDirectories: string[] = [];

    const search = async (directory: string, targets: string[]) => {
      let entries: fs.Dirent[];
      try {
        entries = await fs.promises.readdir(directory, {
          withFileTypes: true,
        });
      } catch (_e) {
        throw new SchemaError(`Failed to read "${directory}"`);
      }

      for (const entry of entries) {
        const currentPath = path.join(directory, entry.name);

        if (entry.isDirectory()) {
          if (targets.includes(entry.name)) {
            foundDirectories.push(currentPath);
          } else {
            await search(currentPath, targets);
          }
        }
      }
    };

    await search(this.rootDirectory, targetDirectories);

    return foundDirectories;
  }
}
