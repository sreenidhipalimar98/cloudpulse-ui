const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function request(path) {
  const res = await fetch(`${API_BASE_URL}${path}`);
  if (!res.ok) {
    throw new ApiError(`Request to ${path} failed with status ${res.status}`, res.status);
  }
  return res.json();
}

export const api = {
  getHealth: () => request('/health'),
  getEc2Instances: async () => {
    const data = await request('/infrastructure/ec2');
    return data.instances || [];
  },
  getEcsServices: async () => {
    const data = await request('/infrastructure/ecs');
    return data.services || [];
  },
  getRdsInstances: async () => {
    const data = await request('/infrastructure/rds');
    return data.instances || [];
  },
  getPipelines: async () => {
    const data = await request('/pipelines/');
    return data.pipelines || [];
  },
  getAlerts: async () => {
    const data = await request('/alerts/');
    return data.alerts || [];
  },
};

export { ApiError };
