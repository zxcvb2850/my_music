/**
 * Created by 大白胡子 on 2017/6/9.
 */
const config = {
    agent: "https://bird.ioliu.cn/v1?url=",
    method: "http://120.25.63.170:3000"
    /*agent: "",
    method: "http://localhost:3100"*/
};

export const API_ROOT = "".concat(config.agent, config.method);

export const ERR_OK = 200;
