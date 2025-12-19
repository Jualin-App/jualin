export class ApiError extends Error {
  constructor(message, statusCode, originalError) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.originalError = originalError;
  }
}

export const handleApiError = (error) => {
  if (typeof window === 'undefined') return;

  const statusCode = error.response?.status;

  if (statusCode === 401) {
    localStorage.removeItem('token');
    window.location.href = '/auth/login';
  }

  console.error('API Error:', {
    message: error.message,
    statusCode,
    data: error.response?.data,
  });
};

export const parseApiError = (error) => {
  if (error.response) {
    const message = error.response.data?.message || error.message;
    return new ApiError(message, error.response.status, error);
  }

  if (error instanceof Error) {
    return new ApiError(error.message, undefined, error);
  }

  return new ApiError('An unknown error occurred', undefined, error);
};
