// requestUtils.js
import instance from '../plugins/axios';

const handleResponse = (response) => response.data;

const handleError = (error) => {
  console.error('HTTP Request Error:', error);
  throw error;
};

export const httpGet = async (url, config = {}) => {
  try {
    console.log("im here", url);
    const response = await instance.get(url, config);
    console.log(response);
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

export const httpPost = async (url, data = {}, config = {}) => {
  try {
    const response = await instance.post(url, data, config);
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

export const httpPut = async (url, data = {}, config = {}) => {
  try {
    const response = await instance.put(url, data, config);
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

export const httpDelete = async (url, config = {}) => {
  try {
    const response = await instance.delete(url, config);
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};
