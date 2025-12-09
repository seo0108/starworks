import axios from "axios";

console.log("================토큰 확보하고 axios 인스턴스 생성================")

const headers = {
    Accept: "application/json",
  }


const axiosInst = axios.create({
    baseURL: "http://localhost/rest",
    headers: headers,
    withCredentials: true
  });

// // 요청 인터셉터 추가하기
// axiosInst.interceptors.request.use(function (config) {
//     // 요청이 전달되기 전에 작업 수행
//     console.log("================토큰 확보================")
//     const token = localStorage.getItem("access_token")
//     if(token) {
//       config.headers ['Authorization'] = `Bearer ${token}`;
//     }
//     return config;
//   }, function (error) {
//     // 요청 오류가 있는 작업 수행
//     return Promise.reject(error);
//   });
  export default axiosInst;