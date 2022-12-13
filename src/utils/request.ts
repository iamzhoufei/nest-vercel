import axios, { Method } from 'axios';
// import { getConfig } from 'src/utils';

// const {
//   FEISHU_CONFIG: { FEISHU_URL },
// } = getConfig();

/**
 * @description: 任意请求
 */
const request = async ({ url, option = {} }) => {
  try {
    return axios.request({
      url,
      ...option,
    });
  } catch (error) {
    throw error;
  }
};

interface IMethod {
  url: string;
  method?: Method;
  headers?: { [key: string]: string };
  params?: Record<string, unknown>;
  query?: Record<string, unknown>;
}

export interface IRequest {
  data: any;
  code: number;
}

/**
 * @description: 带 version 的通用 api 请求
 */
const methodWithVersion = async ({
  url,
  method,
  headers,
  params = {},
  query = {},
}: IMethod): Promise<IRequest> => {
  // let sendUrl = '';
  // if (/^(http:\/\/|https:\/\/)/.test(url)) {
  //   sendUrl = url;
  // } else {
  //   sendUrl = `${FEISHU_URL}${url}`;
  // }
  try {
    return new Promise((resolve, reject) => {
      axios({
        headers: {
          ...headers,
          'Content-Type': 'application/json; charset=utf-8',
        },
        url,
        // url: sendUrl,
        method,
        params: query,
        data: {
          ...params,
        },
      })
        .then(({ data, status }) => {
          resolve({ data, code: status });
        })
        .catch((error) => {
          reject(error);
        });
    });
  } catch (error) {
    throw error;
  }
};

export { request, methodWithVersion };
