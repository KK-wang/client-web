const selectOptions = [{ value: "BBO", label: "BBO" }, { value: "GA", label: "GA" }];

const tableData: ITableData[] = [
  {
    key: 1,
    image: "docker",
    calcMetrics: "2134",
    githubUrl: "https://github.com/KK-wang",
    isChecked: false,
  },
  {
    key: 2,
    image: "kubernates",
    calcMetrics: "3192",
    githubUrl: "https://github.com/KK-wang",
    isChecked: false,
  },
  {
    key: 3,
    image: "nginx",
    calcMetrics: "1023",
    githubUrl: "https://github.com/KK-wang",
    isChecked: false,
  },
];

export {
  selectOptions,
  tableData,
  ITableData,
}

interface ITableData {
  key: number,
  image: string,
  calcMetrics: string,
  githubUrl: string,
  isChecked: boolean,
}