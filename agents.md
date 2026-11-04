This is the agents.md file for the internet.nl dashboard intended for codex. Do not ever alter the agents.md file without
specific instructions.

# Architecture
This frontend is a bootstrap-vue SPA application. It uses the Bootstrap-vue-next framework which is documented
here: https://bootstrap-vue-next.github.io/bootstrap-vue-next/. This set of components is built on
Vue3 and Bootstrap 5.

The frontend talks to a JSON API to the backend, documented here: http://localhost:8000/api/v1/openapi.json
Authentication is handled by Django Allauth, documented here: http://localhost:8000/api/v1/allauth/openapi.json

These json files will only be available if the internet.nl development backend is live. You can fetch a version from
dashboard.internet.nl on the same paths if need be.
