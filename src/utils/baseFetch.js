import request from "./baseRequest";

/**
 * Melakukan permintaan HTTP menggunakan metode yang ditentukan dan mengelola kes alahan yang mungkin terjadi.
 *
 * @param {Object} data - Data untuk permintaan.
 * @param {string} data.url - URL untuk permintaan (required).
 * @param {string} data.method - Metode HTTP yang digunakan (required, contoh: 'GET', 'POST').
 * @param {Object} [data.payload={}] - Payload untuk permintaan, jika ada (default: {}).
 * @param {Object} [data.options] - Opsi tambahan untuk permintaan.
 * @param {Array<number>} [data.options.excludeShowErrorStatusCode] - Daftar status code yang tidak akan ditampilkan sebagai kesalahan.
 * @param {Array<number>} [data.options.returnDataWhenError] - Daftar status code yang akan mengembalikan data.
 * @returns {Promise<Object>} - Mengembalikan data dari respons.
 * @throws {Error} - Melempar kesalahan jika permintaan gagal.
 */
export const fetch = async (data) => {
  try {
    console.log(`Making ${data.method} request to ${data.url}`, data);
    const payload = data.payload || {};
    const response = await request[data.method.toLowerCase()](data.url, payload);
    console.log(`Response from ${data.url}:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error in fetch for ${data.url}:`, error);
    
    // Safe error handling with proper null checks
    const errorResponse = error.response;
    const errorData = errorResponse?.data;
    const errorMessage = errorData?.message || error.message || "Something went wrong!";
    const statusCode = errorResponse?.status;
    
    console.error('Error response:', errorData);
    console.error('Error status:', statusCode);

    if (
      data.options &&
      data.options.excludeShowErrorStatusCode &&
      !data.options.excludeShowErrorStatusCode.includes(statusCode)
    ) {
      //   toast.error("Error!", {
      //     description: errorMessage ? errorMessage : "Terjadi kesalahan",
      //   });
    }

    if (data.options && data.options.returnDataWhenError && data.options.returnDataWhenError.includes(statusCode)) {
      return errorResponse?.data;
    }

    // Return error object instead of throwing for better error handling upstream
    return {
      error: true,
      message: errorMessage,
      status: statusCode,
      data: error.response?.data
    };
  }
};
