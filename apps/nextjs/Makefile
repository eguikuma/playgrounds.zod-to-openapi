.DEFAULT_GOAL := help

NPM_CMD := npm

## @description Set up the project (install dependencies and initialize database)
## @usage make install
install:
	@if [ ! -f .env ]; then cp .env.example .env; fi
	@echo ""
	@echo "\033[32mEnvironment file (.env) has been created. Review the configuration? [y/N]\033[0m"
	@read response; \
	case "$$response" in \
		[Yy]* ) \
			$(MAKE) up db && \
			$(MAKE) i && \
			$(MAKE) fresh && \
			$(MAKE) up && \
			$(MAKE) docs && \
			echo ""; \
			echo "\033[32m✅ Setup complete! Start the development server with:\033[0m"; \
			echo ""; \
			echo "\033[32m   make dev\033[0m"; \
			echo ""; \
			;; \
		* ) \
			echo "\033[31m❌ Setup cancelled\033[0m"; \
			echo ""; \
			;; \
	esac

## @description Reset project (remove all containers and reinstall)
## @usage make reset
reset:
	@make destroy
	@make install

## @description Launch specified containers (or all if none specified)
## @usage make up [container_name...]
up:
	@containers='$(filter-out $@,$(MAKECMDGOALS))'; \
	if [ ! -z "$$containers" ]; then \
		docker compose up -d $$containers; \
	else \
		docker compose up -d; \
	fi

## @description Stop specified containers (or all if none specified)
## @usage make down [container_name...]
down:
	@containers='$(filter-out $@,$(MAKECMDGOALS))'; \
	if [ ! -z "$$containers" ]; then \
		docker compose down $$containers; \
	else \
		docker compose down; \
	fi

## @description Restart specified containers (or all if none specified)
## @usage make restart [container_name...]
restart:
	@containers='$(filter-out $@,$(MAKECMDGOALS))'; \
	if [ ! -z "$$containers" ]; then \
		$(MAKE) down $$containers; \
		$(MAKE) up $$containers; \
	else \
		$(MAKE) down; \
		$(MAKE) up; \
	fi

## @description Display container status
## @usage make ps
ps:
	docker compose ps

## @description Remove all containers, volumes, and images
## @usage make destroy
destroy:
	docker compose down -v --remove-orphans --rmi all

## @description Verify environment configuration
## @usage make verify-env
verify-env:
	@if [ ! -f .env ]; then \
		echo "\033[31m❌ Environment file (.env) not found\033[0m"; \
		exit 1; \
	fi

## @description Start development server
## @usage make dev
dev: verify-env
	$(NPM_CMD) run dev

## @description Build for production
## @usage make build
build: verify-env
	$(NPM_CMD) run build

## @description Install dependencies
## @usage make i
i:
	$(NPM_CMD) install

## @description Run database migrations
## @usage make migrate
migrate: verify-env
	$(NPM_CMD) run prisma:migrate

## @description Seed database with initial data
## @usage make seed
seed: verify-env
	$(NPM_CMD) run prisma:seed

## @description Reset and recreate database
## @usage make fresh
fresh: verify-env
	$(NPM_CMD) run prisma:fresh

## @description Run linter
## @usage make lint
lint:
	$(NPM_CMD) run eslint:fix

## @description Format code
## @usage make format
format:
	$(NPM_CMD) run prettier:fix

## @description CI pipeline
## @usage make ci
ci:
	$(NPM_CMD) run ci

## @description Open database console
## @usage make db-sh
db-sh:
	@if ! docker compose ps db | grep -q "Up"; then \
		echo "\033[31m❌ Database container is not running\033[0m"; \
		exit 1; \
	fi
	docker compose exec db psql -U postgres -d local

## @description Generate API documentation
## @usage make docs
docs: verify-env
	$(NPM_CMD) run docs
	@make restart openapi

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
