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
  getEc2Instances: () => request('/infrastructure/ec2'),
  getEcsServices: () => request('/infrastructure/ecs'),
  getRdsInstances: () => request('/infrastructure/rds'),
  getPipelines: () => request('/pipelines/'),
  getAlerts: () => request('/alerts/'),
};

export { ApiError };
