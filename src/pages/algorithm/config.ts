const selectOptions = [{ value: "BBO", label: "BBO" }];

const tableData: ITableData[] = [
  {
    key: 0,
    image: "ai-task-5s",
    calcMetrics: "5000",
    githubUrl: "https://github.com/KK-wang/ai-task/blob/master/various-task/Dockerfile.5s",
    isChecked: false,
    nums: null,
    podName: null,
  },
  {
    key: 1,
    image: "ai-task-7s",
    calcMetrics: "7000",
    githubUrl: "https://github.com/KK-wang/ai-task/blob/master/various-task/Dockerfile.7s",
    isChecked: false,
    nums: null,
    podName: null,
  },
  {
    key: 2,
    image: "ai-task-9s",
    calcMetrics: "9000",
    githubUrl: "https://github.com/KK-wang/ai-task/blob/master/various-task/Dockerfile.9s",
    isChecked: false,
    nums: null,
    podName: null,
  },
  {
    key: 3,
    image: "ai-task-11s",
    calcMetrics: "11000",
    githubUrl: "https://github.com/KK-wang/ai-task/blob/master/various-task/Dockerfile.11s",
    isChecked: false,
    nums: null,
    podName: null,
  },
  {
    key: 4,
    image: "ai-task-13s",
    calcMetrics: "13000",
    githubUrl: "https://github.com/KK-wang/ai-task/blob/master/various-task/Dockerfile.13s",
    isChecked: false,
    nums: null,
    podName: null,
  },
  {
    key: 5,
    image: "ai-task-15s",
    calcMetrics: "15000",
    githubUrl: "https://github.com/KK-wang/ai-task/blob/master/various-task/Dockerfile.15s",
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