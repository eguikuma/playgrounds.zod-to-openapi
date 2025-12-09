import fs from "fs";
import path from "path";

import chalk from "chalk";

import { ConfigError } from "../errors";

import type { ZodocsConfig } from "../definitions";
import type { RequiredDeep } from "type-fest";

const defaultConfig: RequiredDeep<ZodocsConfig> = {
  version: "1.0.0",
  title: "Generated API Document Title",
  description: "Generated API Document Description",
  servers: [],
  input: {
    directories: ["schema"],
    endpointFileName: "endpoint.ts",
    requestFileName: "request.ts",
    responseFileName: "response.ts",
    tags: {},
  },
  output: {
    directory: "",
    fileName: "openapi-docs.yml",
  },
};

export class ConfigLoader {
  private static readonly FILE_NAME = "zodocs.config.ts";

  constructor(private readonly rootDirectory: string) {}

  async load(): Promise<RequiredDeep<ZodocsConfig>> {
    const fromPath = path.join(this.rootDirectory, ConfigLoader.FILE_NAME);

    if (!fs.existsSync(fromPath)) {
      try {
        fs.writeFileSync(fromPath, this.createDefaultConfig(), "utf-8");
      } catch (_e) {
        throw new ConfigError(`Failed to write "${fromPath}"`);
      }

      console.log(
        chalk.green(`✨ Created ${chalk.bold(ConfigLoader.FILE_NAME)}\n`),
      );

      return defaultConfig;
    }

    let config: ZodocsConfig;
    try {
      const { default: imported } = await import(fromPath);

      config = imported;
    } catch (_e) {
      throw new ConfigError(`Failed to load "${fromPath}"`);
    }

    const merged = {
      ...defaultConfig,
      ...(config || {}),
      input: {
        ...defaultConfig.input,
        ...(config.input || {}),
      },
      output: {
        ...defaultConfig.output,
        ...(config.output || {}),
      },
    } as RequiredDeep<ZodocsConfig>;

    this.assertConfig(merged);

    return merged;
  }

  private createDefaultConfig(): string {
    return `import type { ZodocsConfig, ZodocsTags } from "zodocs";

export const Tags = {} as const satisfies ZodocsTags;

const config: ZodocsConfig = {
  version: "${defaultConfig.version}",
  title: "${defaultConfig.title}",
  description: "${defaultConfig.description}",
  servers: ${JSON.stringify(defaultConfig.servers, null, 2)},
  input: {
    directories: ${JSON.stringify(defaultConfig.input.directories)},
    endpointFileName: "${defaultConfig.input.endpointFileName}",
    requestFileName: "${defaultConfig.input.requestFileName}",
    responseFileName: "${defaultConfig.input.responseFileName}",
    tags: Tags,
  },
  output: {
    directory: "${defaultConfig.output.directory}",
    fileName: "${defaultConfig.output.fileName}",
  },
};

export default config;
`;
  }

  private assertConfig(config: RequiredDeep<ZodocsConfig>): void {
    if (!config.input.directories.length) {
      throw new ConfigError("Schema directories not specified");
    }

    if (
      !config.input.endpointFileName ||
      !config.input.requestFileName ||
      !config.input.responseFileName
    ) {
      throw new ConfigError("Schema file names not specified");
    }

    if (!config.output.fileName) {
      throw new ConfigError("Output file name not specified");
    }
  }
}
