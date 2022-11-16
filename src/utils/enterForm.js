// 母卷号 班组 出口钢卷号 最终用户 入口钢卷号 部件名 钢种
const FormItemList = [
  {
    id: 1,
    label: "母卷号",
    key: "number",
    required: true,
    options: [],
  },

  {
    id: 2,
    label: "班组",
    key: "team",
    required: true,
    options: [],
  },
  {
    id: 3,
    label: "出口钢卷号",
    key: "outSteelCoilsNumber",
    required: true,
    options: [],
  },
  {
    id: 4,
    label: "最终用户",
    key: "lastUser",
    required: true,
    options: [],
  },
  {
    id: 5,
    label: "入口钢卷号",
    key: "inSteelCoilsNumber",
    required: true,
    options: [],
  },
  {
    id: 6,
    label: "部件名",
    key: "partTitle",
    required: true,
    options: [],
  },
  {
    id: 7,
    label: "钢种",
    key: "steelGrade",
    required: true,
    options: [],
  },
];

//母卷号 配方名称 实时速度 班组 当前时间 最终用户 检查员 部件名 开始时间 钢种 出口钢卷号 入口钢卷号
const FormLabelRequireList = [
  {
    id: 1,
    label: "母卷号",
    key: "number",
    show: false,
    sort: null,
  },
  {
    id: 2,
    label: "配方名称",
    key: "title",
    show: false,
    sort: null,
  },
  {
    id: 3,
    label: "实时速度",
    key: "realTimeSpeed",
    show: false,
    sort: null,
  },
  {
    id: 4,
    label: "班组",
    key: "team",
    show: false,
    sort: null,
  },
  {
    id: 5,
    label: "当前时间",
    key: "currentTime",
    show: false,
    sort: null,
  },
  {
    id: 6,
    label: "最终用户",
    key: "lastUser",
    show: false,
    sort: null,
  },
  {
    id: 7,
    label: "检查员",
    key: "inspector",
    show: false,
    sort: null,
  },
  {
    id: 8,
    label: "部件名",
    key: "partTitle",
    show: false,
    sort: null,
  },
  {
    id: 9,
    label: "开始时间",
    key: "gmtCreate",
    show: false,
    sort: null,
  },
  {
    id: 10,
    label: "钢种",
    key: "steelGrade",
    show: false,
    sort: null,
  },
  {
    id: 11,
    label: "出口钢卷号",
    key: "outSteelCoilsNumber",
    show: false,
    sort: null,
  },
  {
    id: 12,
    label: "入口钢卷号",
    key: "inSteelCoilsNumber",
    show: false,
    sort: null,
  },
];

const FormulaItemList = [
  {
    id: 1,
    label: "孔洞",
    type: 1,
    required: true,
  },
  {
    id: 2,
    label: "边缘裂纹",
    type: 2,
    required: true,
  },
  {
    id: 3,
    label: "边缘豁口",
    type: 3,
    required: true,
  },
];

export { FormItemList, FormLabelRequireList, FormulaItemList };
