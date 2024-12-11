// SPDX-License-Identifier: Apache-2.0
import axios from "axios";

// https://stackoverflow.com/questions/39254562/csrf-with-django-reactredux-using-axios
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.withXSRFToken = true;
axios.defaults.withCredentials = true;

export default axios.create({
  // todo:
  baseURL: `${import.meta.env.VITE_VUE_APP_DJANGO_PATH}/`,
  headers: {
    "Content-type": "application/json",
    'Accept': 'application/json',
  }
});
