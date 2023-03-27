const copy = (val: string) => {
  const copyEl = document.getElementById("csu-design-copy-input-textarea-element") as HTMLTextAreaElement;
  copyEl.value = val;
  copyEl.select();
  const res = document.execCommand('copy');
  return Promise.resolve(res);
}

export default copy;