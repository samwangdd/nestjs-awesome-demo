// 下划线转驼峰
export function toHump(name) {
  return name.replace(/\_(\w)/g, (_, letter) => letter.toUpperCase());
}

// 驼峰转下划线
export function toUnderscore(name) {
  return name.replace(/([A-Z])/g, '_$1').toLowerCase();
}

/**
 * 批量转换键名
 *
 * @export
 * @param {*} obj
 * @param {*} filter
 * @param {*} [whiteList=[]] 白名单，不会被转换
 * @return {*}
 */
export function replaceKeys(obj, filter, whiteList = []) {
  return Object.keys(obj).reduce((acc, cur) => {
    if (whiteList.indexOf(cur) > -1) {
      acc[cur] = obj[cur];
    } else {
      const key = filter(cur);
      acc[key] = obj[cur];
    }

    return acc;
  }, {});
}

const isObject = (obj) => typeof obj === 'object' && obj !== null;

/**
 * 深层转换对象名转换为驼峰
 *
 * @export
 * @param {*} obj
 * @return {*}  {*}
 */
export function deepTransformToHump(obj): any {
  if (Array.isArray(obj)) {
    return obj.map((item) => deepTransformToHump(item));
  } else {
    return Object.keys(obj).reduce((acc, cur) => {
      const key = toHump(cur);
      if (isObject(obj[cur])) {
        acc[key] = deepTransformToHump(obj[cur]);
      } else {
        acc[key] = obj[cur];
      }

      return acc;
    }, {});
  }
}
