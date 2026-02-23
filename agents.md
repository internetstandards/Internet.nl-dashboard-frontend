This is the agents.md file for the internet.nl dashboard intended for codex.

# Architecture
This is a bootstrap-vue SPA application. It uses the Bootstrap-vue-next framework which is documented
here: https://bootstrap-vue-next.github.io/bootstrap-vue-next/. This set of components is built on
Vue3 and Bootstrap 5. Various components inside the frontend are special cases for Vue3.

The frontend talks to a JSON API to the backend. Authentication works using sessions and JSON calls
to another endpoint provided by Django Allauth. 

The API specification of the dashboard with all calls can be found in /openapi/dashboard.openapi.json.


# Authentication

Authentication happens via Django Allauth. The components inside of /src/components/allauth are based
on the React SPA example application. The application is documented here: 
https://codeberg.org/allauth/django-allauth/src/branch/main/examples/react-spa. 

The location of the sources of the original react SPA are inside /src/components/allauth-react. 
You can write your pages and components to /src/components/allauth/.

I've already copied the router from another project, which is located in router/accounts.ts.

The store for all auth is not defined yet. You can make a new one called allauthStore.js and place it next to
dashboardStore.js.

The goal is to convert the react framework spa to pages and components inside this vue3 app.

The existing calls for authentication in the dashboard are super lightweight, as everything was outsourced to
django prior to this migration. It stays that way with django-allauth-headless. There is a call to 
"/api/v1/session/status" which tells the frontend what the current session is and with what privileges.
 The result is: 
```json 
{
  "is_authenticated": true,
  "is_superuser": true,
  "second_factor_enabled": false,
  "account_name": "string",
  "account_id": 0
}
```

A new login page is needed. And when the users is authentication a new authentication page is needed where they can do 
all the functions that are in the example app.

Can you investigate the project and see what needs to be done and if there are any open ends i need to address?

1: The old /account/ stuff can be moved to /profile/ i'll re-integrate settings if need be.
2: it needs to be full parity, including passkeys, session and social because people will use identity providers and passkeys.
3: No backwards compatibility is needed, unless it's just a redirect, that is fine.
4: yes.

You can do this in steps, of course but you need to guide me.

