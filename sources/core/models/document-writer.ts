import fs from "fs";
import path from "path";

import yaml from "yaml";

import { DocumentError } from "../errors";
import { zodocs } from "./document-generator";

import type { ZodocsConfig } from "../definitions";
import type { RequiredDeep } from "type-fest";

export class DocumentWriter {
  async write(config: RequiredDeep<ZodocsConfig>): Promise<string> {
    await this.syncOutputDirectory(config.output.directory);

    const toPath = path.join(config.output.directory, config.output.fileName);

    const content = this.toYaml(config);

    try {
      fs.writeFileSync(toPath, content, { encoding: "utf-8" });
    } catch (_e) {
      throw new DocumentError(`Failed to write "${toPath}"`);
    }

    return toPath;
  }

  private async syncOutputDirectory(directory: string): Promise<void> {
    if (directory && !fs.existsSync(directory)) {
      try {
        fs.mkdirSync(directory, { recursive: true });
      } catch (_e) {
        throw new DocumentError(`Failed to create "${directory}"`);
      }
    }
  }

  private toYaml(config: RequiredDeep<ZodocsConfig>): string {
    return yaml.stringify(zodocs.generate(config));
  }
}
