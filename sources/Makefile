.PHONY: build install test format lint lint-fix tsc deps update-deps update-deps-force ci help

.DEFAULT_GOAL := help

NPM_CMD := npm

## @description Install dependencies
## @usage make install
install:
	$(NPM_CMD) install

## @description Build the project
## @usage make build
build:
	$(NPM_CMD) run build

## @description Run tests
## @usage make test
test:
	$(NPM_CMD) run test

## @description Format code with Prettier
## @usage make format
format:
	$(NPM_CMD) run format

## @description Run ESLint
## @usage make lint
lint:
	$(NPM_CMD) run lint

## @description Fix ESLint issues
## @usage make lint-fix
lint-fix:
	$(NPM_CMD) run lint:fix

## @description Run TypeScript compiler check
## @usage make tsc
tsc:
	$(NPM_CMD) run tsc

## @description Run full CI pipeline (format, lint, type check, test)
## @usage make ci
ci:
	$(NPM_CMD) run ci

help:
	@printf "\n\033[33m📋 Available Commands:\033[0m\n\n"
	@awk 'BEGIN { description = ""; usage = ""; } \
		/^## @description/ { description = substr($$0, index($$0, $$3)); } \
		/^## @usage/ { usage = substr($$0, index($$0, $$3)); } \
		/^[a-zA-Z0-9_\-]+:/ { \
			helpCommand = $$1; \
			if (description != "") { \
				printf "  \033[32m%-30s\033[0m %s\n", helpCommand, description; \
				if (usage != "") { \
					printf "  \033[36m%-30s\033[0m %s%s\n\n", "", "▶️ ", usage; \
				} \
			} \
			description = ""; usage = ""; \
		}' $(MAKEFILE_LIST)

%:
	@:
