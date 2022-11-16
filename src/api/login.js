import request from "@/services";

export function login(parameter) {
  return request.post("/auth/login", parameter);
}

export function updateUser() {
  return request.put("/user/update");
}

export function logout() {
  return request.post("/auth/logout");
}
