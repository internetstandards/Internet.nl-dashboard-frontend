docker_image_name = internetstandards/dashboard-static

all: lint audit test

setup: vue-cli

lint:
	pnpm run lint

audit:
	pnpm audit

test:
	# TODO

vue-cli=node_modules/.bin/vue-cli-service
$(vue-cli):
	pnpm install
vue-cli: | $(vue-cli)

run: vue-cli
	pnpm run dev

# This option takes the env.deploy file and applies it during build.
build: vue-cli
	pnpm run build --mode deploy

build-local: vue-cli
	pnpm run build --mode development

pull_image:
	# optimize build by caching previously build image
	-docker pull ${docker_image_name}

# do not build and push on arm due to incompatible architectures
push_image:
	docker push ${docker_image_name}

image build_image:
	docker buildx build --platform linux/amd64 --tag ${docker_image_name} .


promote_staging_to_live:
	docker pull ${docker_image_name}:latest
	docker tag ${docker_image_name}:latest ${docker_image_name}:live
	docker push ${docker_image_name}:live
