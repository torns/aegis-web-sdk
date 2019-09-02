// import { AegisConfig } from '../interface/config';
// import { ErrorMsg } from '../interface/log';

// // 之所以传config进来而不是beforeReport配置进来，是为了用户在后面重新setconfig的中修改beforeReport，也能被触发
// export default (config ?: AegisConfig) => {
//     return function(msg: ErrorMsg, success: Function, fail: Function) {
//         if (config.beforeReport) {
//             const result: any = config.beforeReport(msg);
//             if (result === false) {
//                 return fail();
//             }
//         }
//         success();
//     }
// }