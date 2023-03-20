const selectOptions = [{ value: "BBO", label: "BBO" }];

const tableData: ITableData[] = [
  {
    key: 0,
    image: "docker",
    calcMetrics: "2134",
    githubUrl: "https://github.com/KK-wang",
    isChecked: false,
    nums: null,
    podName: null,
  },
  {
    key: 1,
    image: "kubernates",
    calcMetrics: "3192",
    githubUrl: "https://github.com/KK-wang",
    isChecked: false,
    nums: null,
    podName: null,
  },
  {
    key: 2,
    image: "nginx",
    calcMetrics: "1023",
    githubUrl: "https://github.com/KK-wang",
    isChecked: false,
    nums: null,
    podName: null,
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
  nums: number | null,
  podName: string | null,
}