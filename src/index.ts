import { Reporter } from './core/reporter';

export default Reporter;

(<any>window).Aegis = Reporter; // 挂载window 暴露
