## Axios Instance/Helper for SPA Vuejs/ReactJS

This Axios Instance/helper simplifies making API calls in Vue.js by handling session timeouts, auto-logout, and error handling, keeping your user sessions secure and API calls manageable.

> **Note:** This Instance/helper will automatically log out users after 20 minutes of inactivity.

---

## Features

- **Automatic Session Timeout**: Logs users out after a configurable period of inactivity.
- **Error Handling**: Handles 401, 403, and 404 error codes with user-friendly redirects.
- **Authorization Header**: Automatically includes the authorization token in each request.
- **Reset Timeout on Activity**: Prevents user logout during active use by resetting the timeout after every successful API call.

---

## Getting Started

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/your-repo/axios-helper.git
```
### Installing Axios

Install axios package

```bash
npm i axios@latest
```
### Configuration

Set your API base URL in your .env file

```bash
VITE_API_BASE_URL=https://your-api-url.com/api
```

Import the Axios instance into any component where you need to make API calls

```bash
import axiosInstance from '@/helpers/axios-instance';
```

Example API Call

```bash
axiosInstance.get('/your-endpoint')
  .then(response => {
    console.log(response); // Handle successful response
  })
  .catch(error => {
    console.error(error); // Handle errors
  });
```

Source Code /Axios Helper /Axios Instance / Axios Instance for API

```bash
import axios from 'axios';
import { useLogin, useLogout } from '@/composables/useAuth';
import { globalRouter } from '@/helpers/globalRouter';

let timeoutId;

function resetTimeout() {
  // Clear the previous timeout, if any
  clearTimeout(timeoutId);
  // Set a new timeout to trigger the logout action after 20 minutes of inactivity
  timeoutId = setTimeout(() => {
    // Call the useLogout() function to log out the user
    useLogout();
    // Redirect the user to the login page
    globalRouter.router.push({ name: 'Login' });
  }, 30 * 60 * 1000); // 20 minutes in milliseconds
}

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_FRONTEND_URL,
});

const _addAuthorizationHeader = (request) => {
  request.headers && (request.headers.Accept = 'application/json');

  //Check login user and his information
  const authUser = useLogin();
  if (authUser.token) {
    request.headers && (request.headers.Authorization = `Bearer ${authUser.token}`);
  }
  // Call the resetTimeout() function to reset the timeout
  resetTimeout();

  // if (import.meta.env.DEV) {
  //   console.debug(`${request.method.toUpperCase()} ${request.baseURL + request.url}`);
  // }

  // Important: request interceptors **must** return the request.
  return request;
};

const _handleResponse = ({ data }) => {
  // Call the resetTimeout() function to reset the timeout
  resetTimeout();

  return data;
};

const _handleHttpError = (error) => {
  //handle response errors codes
  if (error?.response?.status === 401) {
    useLogout();
    globalRouter.router.push({ name: 'Login' });
  } else if (error?.response.status === 403) {
    globalRouter.router.push({ name: 'HttpForbidden' });
  } else if (error?.response.status === 404) {
    globalRouter.router.push({ name: 'NotFound' });
  }

  // Call the resetTimeout() function to reset the timeout
  resetTimeout();

  // Important: request interceptors **must** return the request.
  return Promise.reject(error?.response.data);
};

axiosInstance.interceptors.request.use(_addAuthorizationHeader, _handleHttpError);
axiosInstance.interceptors.response.use(_handleResponse, _handleHttpError);

export default axiosInstance;

```
---
## About Programmers Beats

**Programmers Beats**is a community for tech enthusiasts, developers, and future programmers. On our social media platforms, we deliver:
- **Tutorials & Tips**: Get quick coding tips and tutorials on the latest tech tools.
- **Product Reviews**: Discover honest reviews of trending development tools and platforms.
- **Developer Stories**: Gain insights from experienced developers
- **Coding Challenges**: Participate in coding challenges to sharpen your skills.
- **Open Source**: Best Free Platform for Open Source Code and Programming Solutions
Stay connected with Programmers Beats on social media to beat the rhythm of coding together!
---


## License

> **Note:** © 2024 Ameer Hamza/ Programmers Beats .

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
- The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
- THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
---
