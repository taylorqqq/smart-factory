import Mock from "mockjs";
// 登录
Mock.mock("/smart/auth/login", "post", {
  code: 200,
  data: {
    token: /[a-z0-9]{40}/,
    "userDO|5-10": {
      "id|+1": 1,
      gmtCreate: "@datetime",
      gmtModified: "@datetime",
      userName: "@cname",
      password: /[a-z0-9]{40}/,
      userType: /0|1/, // 0检测员1观察员
      version: "@integer(1, 100)", // 版本号
      isDelete: /0|1/, // 0未删除1已删除
    },
  },
  message: "success",
});

let LoginOutReg = /\/smart\/auth\/logout/;
Mock.mock(LoginOutReg, "get", {
  code: 200,
  data: {},
  message: "success",
});
// 配方列表
let formulaListReg = /\/smart\/formula\/list/;
Mock.mock(formulaListReg, "get", {
  code: 200,
  "data|5-10": [
    {
      // 5-10随机生成5~10个数据
      "id|+1": 1,
      recipe: "@cword(2,3)", // 生成中文汉字，word生成英文汉字
      status: "@integer(0,1)", // 生成0~1的随机整数
    },
  ],
  message: "success",
});

// 修改用户
let updateUserReg = /\/smart\/user\/update/;
Mock.mock(updateUserReg, "put", {
  code: 200,
  data: {},
  message: "success",
});

// 开始检测
Mock.mock("/smart/masterRoll/startCheck", "post", {
  code: 200,
  data: {},
  message: "success",
});
// 结束检测
Mock.mock("/smart/masterRoll/endCheck", "post", {
  code: 200,
  data: {},
  message: "success",
});

// 历史记录
let historyListReg = /\/smart\/masterRollCheckRecord\/list/;
Mock.mock(historyListReg, "get", {
  code: 200,
  "data|5-10": [
    {
      // 5-10随机生成5~10个数据
      "id|+1": 1,
      masterRollId: "@integer(1, 100)", // 生成1~100的随机整数
      startTime: "@datetime", // 生成时间
      endTime: "@datetime", // 生成时间
      formulaId: "@integer(1, 100)", // 生成1~100的随机整数
      formulaTitle: "@cword(2,3)", // 生成中文汉字，word生成英文汉字
      checkUserId: "@integer(1, 100)", // 生成1~100的随机整数
      checkUserName: "@cname", // 生成中文名字
      status: "@integer(0,1)", // 生成0~1的随机整数
      masterRoolTitle: "@cword(2,3)", // 生成中文汉字，word生成英文汉字
      team: "@integer(1, 100)", // 生成1~100的随机整数`
      defectAmount: "@integer(1, 100)", // 生成1~100的随机整数
    },
  ],
});
// 缺陷下拉接口
let flawSelectReg = /\/flaw\/select/;
Mock.mock(flawSelectReg, "get", {
  code: 200,
  "data|5-10": [
    {
      // 5-10随机生成5~10个数据
      "value|+1": 0,
      label: "@cword(2,3)", // 生成中文汉字，word生成英文汉字
    },
  ],
});

// 缺陷信息
let flawMsgReg = /\/flaw\/msg/;
Mock.mock(flawMsgReg, "get", {
  code: 200,
  // 随机生成15~20个数据
  "data|15-20": [
    {
      "id|+1": 1,
      position: { x: "@integer(0,100)", y: "@integer(0,100)" }, // 生成0~100的随机整数
      img: "@image('200x100', '#50B347', '#FFF', 'png', 'Hello')", // 生成图片
      number: "@integer(0,100)", // 生成0~100的随机整数
      remark: "@cword(2,3)", // 生成中文汉字，word生成英文汉字
    },
  ],
});

// 缺陷列表
let flawListReg = /\/smart\/defectRecord\/list/;
Mock.mock(flawListReg, "get", {
  code: 200,
  // 随机生成15~20个数据
  "data|15-20": [
    {
      "id|+1": 1,
      gmtCreate: "@datetime", // 生成时间
      gmtModified: "@datetime", // 生成时间
      uploadTime: "@datetime", // 生成时间
      portrait: "@integer(0,1000)", // 纵向坐标0~1000
      transverse: "@integer(0,1000)", // 横向坐标0~1000
      type: "@integer(1,3)", // 缺陷类型1~3
      typeTitle: "@cword(2,3)", // 缺陷类型1~3
      area: "@float(0, 100, 2, 2)", // 缺陷面积0~100
      masterRollId: "@integer(0,100)", // 主卷id
      masterRollTitle: "@cword(2,3)", // 主卷名称
      checkUserId: "@integer(0,100)", // 检测员id
      checkUserName: "@cname", // 检测员名称
      img: "@image('200x100', '#50B347', '#FFF', 'png', 'Hello')", // 生成图片
      masterRollCheckRecordId: "@integer(0,100)", //当前检测记录id
    },
  ],
});

// 修改配方配制
let formulaUpdateReg = /\/smart\/formula\/updateDetail/;
Mock.mock(formulaUpdateReg, "get", {
  code: 200,
  data: {},
  message: "success",
});

// 启用/停用配方
Mock.mock("/smart/formula/switch", "post", {
  code: 200,
  data: {},
  message: "success",
});

let formulaDeleteReg = /\/smart\/formula\/delete/;
// 删除配方
Mock.mock(formulaDeleteReg, "delete", {
  code: 200,
  data: {},
  message: "success",
});

// 新增配方
Mock.mock("/smart/formula/add", "post", {
  code: 200,
  data: {},
  message: "success",
});

// 配方详情
let formulaDetailReg = /\/smart\/formula\/detail/;
Mock.mock(formulaDetailReg, "get", {
  code: 200,
  data: {
    id: 1,
    itemInfoList: [
      {
        type: 1,
        amount: "@integer(1, 10)",
      },
      {
        type: 2,
        amount: "@integer(1, 10)",
      },
      {
        type: 3,
        amount: "@integer(1, 10)",
      },
    ],
  },
});

// 缺陷统计
// /smart/defectRecord/statistic
let flawStatisticsReg = /\/smart\/defectRecord\/statistic/;
Mock.mock(flawStatisticsReg, "get", {
  code: 200,
  data: {
    孔洞: "@integer(1, 10)",
    边缘裂纹: "@integer(1, 10)",
    边缘豁口: "@integer(1, 10)",
  },
});

// 导出
let flawExportReg = /\/smart\/masterRollCheckRecord\/downCheckRecord/;
Mock.mock(flawExportReg, "get", {
  code: 200,
  data: {
    url: "http://www.baidu.com",
  },
  message: "success",
});

// 停止报警
Mock.mock("/smart/masterRoll/stopAlarm", "post", {
  code: 200,
  data: {},
  message: "success",
});

// 开始报警
Mock.mock("/smart/masterRoll/startAlarm", "post", {
  code: 200,
  data: {},
  message: "success",
});

// 查看当前报警状态
let alarmStatusReg = /\/smart\/masterRoll\/getAlarmStatus/;
Mock.mock(alarmStatusReg, "get", {
  code: 200,
  data: "@integer(0,1)", // 0开，1关
  message: "success",
});

// 获取当前使用中的母卷
let currentMasterRollReg = /\/smart\/masterRoll\/currentMasterRoll/;
Mock.mock(currentMasterRollReg, "get", {
  code: 200,
  data: {
    recipe: "@cword(2,3)",
    checker: "@cname",

    id: 1,
    number: "@integer(1, 10)",
    lastUser: "@cname",
    recipeName: "@cword(2,3)",
    checkUserName: "@cname",
    inspector: "@cname",
    realTimeSpeed: "@integer(1, 10)",
    partName: "@cword(2,3)",
    team: "@cword(2,3)",
    startTime: "@datetime",
    currentTime: "@datetime",
    steelGrade: "@cword(2,3)",
    outSteelCoilsNumber: "@integer(1, 10)",
    inSteelCoilsNumber: "@integer(1, 10)",
  },
  message: "success",
});
