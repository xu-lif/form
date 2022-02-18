// 数据仓库类
// 保存所有表单的数据(更新数据，获取数据)，表单数据的验证, 发起表单数据的更新
/**
 * rules : {
 *  [key]: {
 *    rule: (value) => boolean,
 *    msg: string
 * },
 * }
 *
 * errors: {
 *  [key]: msg
 * }
 */
import _ from "lodash";

class FormStore {
  constructor(initStore, rules) {
    this.values = initStore || {};
    this.rules = rules || [];
    this.errors = {};
    this.listeners = [];
    this.initValues = _.cloneDeep(initStore);
    this.validateValues();
  }
  // 获取数据
  getValues = (key) => {
    if (key) return this.values[key];
    return this.values;
  };
  // 设置数据
  // 设置单条数据，设置多条数据
  setValues = (key, value) => {
    if (typeof value === "undefined") return;
    if (typeof value !== "object") {
      this.values[key] = value;
    } else {
      Object.keys((keyVal) => {
        this.values[keyVal] = value[keyVal];
      });
    }
    // 验证数据是否合法
    this.validateValue(key, value);
    // 通知更新
    this.notify(key);
  };

  // 验证所有values
  validateValues = () => {
    // 表单field所有value验证
    Object.keys(this.values).forEach((key) => {
      this.validateValue(key, this.values[key]);
    });
  };

  // 验证数据
  validateValue = (key, value) => {
    const statusObj = {
      status: true
    };
    if (key && value) {
      // 单个表单field验证
      if (this.rules[key] && typeof this.rules[key].rule === "function") {
        const status = this.rules[key].rule(value);
        if (!status) {
          statusObj.status = false;
          statusObj.errMsg = this.rules[key].msg;
        }
      }
      if (!statusObj.status) {
        this.errors[key] = statusObj.errMsg;
      } else {
        this.errors[key] = "";
      }
    }
  };

  // 订阅更新
  subscribe = (listener) => {
    if (typeof listener === "function") {
      this.listeners.push(listener);
    }
    return () => {
      this.cancelSubscribe(listener);
    };
  };

  // 取消订阅
  cancelSubscribe = (listener) => {
    const lists = [];
    this.listeners.forEach((val) => {
      if (val !== listener) {
        lists.push(val);
      }
    });
    this.listener = lists;
  };
  // 通知表单更新数据
  notify = (key) => {
    this.listeners.forEach((listenerVal) => {
      listenerVal(key);
    });
  };
  // 重置数据
  reset = () => {
    this.values = this.initValues;
    this.notify("*");
  };
  // 设置初始化的值
  setInitValues = (data) => {
    this.values = data;
    this.initValues = _.cloneDeep(data);
    this.notify("*");
  };
}

export default FormStore;
