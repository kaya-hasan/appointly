import request, { clearStoredToken, setStoredToken } from "./api";

async function register(data) {
  return request("auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

async function login(data) {
  const token = await request("auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
  setStoredToken(token.access_token);
  return token;
}

function logout() {
  clearStoredToken();
}

export default {
  register,
  login,
  logout,
};
