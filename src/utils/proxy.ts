// 将驼峰命名法转化为中划线命名法。

function convert(target: any) {
  return new Proxy(target, {
    get(target, prop: string) {
      const hyphenProp = prop.replace(/([A-Z])/g, '-$1').toLowerCase();
      return target[hyphenProp];
    }
  });
}

export default convert;