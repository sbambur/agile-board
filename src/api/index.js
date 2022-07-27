import qs from "query-string";

export const DOMAIN = "http://localhost:3001";

class ApiCall {
  constructor(domain) {
    this.domain = domain;
  }

  async preform(url, data, config) {
    const request = await fetch(`${this.domain}/${url}`, {
      ...config,
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json",
      },
    });

    return await request.json();
  }

  async get(path, searchParams = {}) {
    return await this.preform(`${path}?${qs.stringify(searchParams)}`);
  }

  async post(path, payload) {
    return await this.preform(path, payload, {
      method: "POST",
    });
  }

  async put(path, payload) {
    return await this.preform(path, payload, {
      method: "PUT",
    });
  }

  async delete(path) {
    return await this.preform(path, {
      method: "DELETE",
    });
  }
}

export default new ApiCall(DOMAIN);
