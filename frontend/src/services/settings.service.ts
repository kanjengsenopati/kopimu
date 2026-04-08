import axios from 'axios';

const API_URL = 'http://localhost:3000/settings';

export interface SHUConfig {
  key: string;
  percentage: number;
}

export interface Permission {
  id: string;
  code: string;
  description: string;
}

export interface Role {
  id: string;
  name: string;
  isAdmin: boolean;
  permissions: {
    permissionId: string;
    scope: string;
  }[];
}

export const settingsService = {
  async getGlobalConfig() {
    return axios.get(`${API_URL}/config`).then(res => res.data);
  },

  async updateSystemConfig(configs: { key: string; value: string }[]) {
    return axios.post(`${API_URL}/config`, configs).then(res => res.data);
  },

  async getSHUConfig(): Promise<SHUConfig[]> {
    return axios.get(`${API_URL}/shu`).then(res => res.data);
  },

  async updateSHUConfig(configs: SHUConfig[]) {
    return axios.put(`${API_URL}/shu`, configs).then(res => res.data);
  },

  async getRoles(): Promise<Role[]> {
    return axios.get(`${API_URL}/roles`).then(res => res.data);
  },

  async getPermissions(): Promise<Permission[]> {
    return axios.get(`${API_URL}/permissions`).then(res => res.data);
  },

  async updateRolePermissions(roleId: string, permissions: { permissionId: string; scope: string }[]) {
    return axios.put(`${API_URL}/roles/${roleId}/permissions`, permissions).then(res => res.data);
  }
};
