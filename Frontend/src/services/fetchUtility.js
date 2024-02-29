import axios from 'axios';
import Cookie from 'js-cookie';

const fetchUtility = async (method, url, payload = {}, headers = {}, options = {}) =>
  axios({
    method,
    url,
    data: payload,
    headers: {
      Authorization: `${Cookie.get('token')}`,
      ...headers
    },
    ...options
  });

export default fetchUtility;
