/**
 * Created by 大白胡子 on 2017/6/9.
 */
const config = {
  //agent: "https://bird.ioliu.cn/v1?url=",
  agent: "",
  method: "http://localhost:3000"
};

if (process.env.NODE_ENV === 'development') {
  config.agent = "";
  config.method = "/api"
}

export const API_ROOT = "".concat(config.agent, config.method);

export const ERR_OK = 200;
