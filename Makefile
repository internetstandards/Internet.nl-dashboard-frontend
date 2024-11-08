docker_image_name = internetstandards/dashboard-static

all: lint audit test

setup: vue-cli

lint:
	npm run lint

audit:
	npm audit

test:
	# TODO

vue-cli=node_modules/.bin/vue-cli-service
$(vue-cli):
	npm install
vue-cli: | $(vue-cli)

run: vue-cli ## only run the gui
	# the extra -- is because of hell and fail. https://github.com/vuejs/vue-cli/issues/1528
	# Because of a legacy stuff this flag needs to be set. This is also set in the deployed environment
	NODE_OPTIONS=--openssl-legacy-provider npm run serve -- --mode development

run-csp: vue-cli
	npm run serve -- --mode production

build-gui-staging: vue-cli
	npm run build -- --mode staging

build-gui-production: vue-cli
	npm run build -- --mode production

build-gui-deploy: vue-cli
	npm run build -- --mode deploy

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
