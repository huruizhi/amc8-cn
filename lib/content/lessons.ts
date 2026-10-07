import type { Topic } from "./questions";

export type LessonOption = {
  label: "A" | "B" | "C" | "D";
  value: string;
};

export type LessonExercise = {
  id: string;
  prompt: string;
  options: LessonOption[];
  answer: LessonOption["label"];
  explanation: string;
};

export type Lesson = {
  id: string;
  order: number;
  title: string;
  summary: string;
  level: "基础" | "进阶";
  minutes: number;
  topics: Topic[];
  skills: string[];
  goals: string[];
  concepts: string[];
  example: {
    title: string;
    prompt: string;
    steps: string[];
    answer: string;
  };
  exercises: LessonExercise[];
  linkedQuestionIds: string[];
  sourceFiles: string[];
};

export type LearningResource = {
  title: string;
  type: "课程" | "官方资料" | "补充教材";
  description: string;
  href: string;
};

const option = (label: LessonOption["label"], value: string): LessonOption => ({
  label,
  value,
});

export const lessons: Lesson[] = [
  {
    id: "fractions",
    order: 1,
    title: "分数：看懂部分与整体",
    summary: "从同分母分数运算开始，建立分数、单位和整体之间的关系。",
    level: "基础",
    minutes: 30,
    topics: ["算术"],
    skills: ["计算", "建模"],
    goals: ["会比较和计算常见分数", "能把文字中的部分关系画成整体", "知道先统一单位再计算"],
    concepts: ["分数的意义", "同分母加减", "单位 1"],
    example: {
      title: "一块蛋糕还剩多少？",
      prompt: "一块蛋糕先吃了它的 1/4，又吃了它的 2/4，还剩下这块蛋糕的几分之几？",
      steps: [
        "把整块蛋糕看成 1，也就是 4/4。",
        "已经吃掉 1/4 + 2/4 = 3/4。",
        "剩下 4/4 - 3/4 = 1/4。",
      ],
      answer: "1/4",
    },
    exercises: [
      {
        id: "fractions-1",
        prompt: "3/8 + 2/8 等于多少？",
        options: [option("A", "5/16"), option("B", "5/8"), option("C", "6/8"), option("D", "1")],
        answer: "B",
        explanation: "分母相同，分子相加：3/8 + 2/8 = 5/8。",
      },
      {
        id: "fractions-2",
        prompt: "一本书已经读了 2/5，还剩下几分之几没有读？",
        options: [option("A", "2/5"), option("B", "3/5"), option("C", "5/2"), option("D", "1/5")],
        answer: "B",
        explanation: "整本书是 5/5，剩下 5/5 - 2/5 = 3/5。",
      },
    ],
    linkedQuestionIds: ["2026-04", "2026-07"],
    sourceFiles: ["第1讲 分数的运算", "第2讲 循环小数", "第3讲 分数应用题"],
  },
  {
    id: "ratio",
    order: 2,
    title: "比与比例：把关系说清楚",
    summary: "学会用比描述数量关系，再把比例关系用于实际问题。",
    level: "基础",
    minutes: 35,
    topics: ["算术", "代数"],
    skills: ["建模", "计算"],
    goals: ["读懂 a:b 的含义", "根据总量和份数求每一份", "用比例检查答案是否合理"],
    concepts: ["比的意义", "按比分配", "单位量"],
    example: {
      title: "红球和蓝球",
      prompt: "红球和蓝球的数量比是 2:3，一共有 25 个球。红球有多少个？",
      steps: [
        "2:3 表示一共分成 2 + 3 = 5 份。",
        "每一份有 25 ÷ 5 = 5 个球。",
        "红球占 2 份，所以有 2 × 5 = 10 个。",
      ],
      answer: "10 个",
    },
    exercises: [
      {
        id: "ratio-1",
        prompt: "男生和女生人数比是 3:2，一共有 20 人。男生有多少人？",
        options: [option("A", "8"), option("B", "10"), option("C", "12"), option("D", "15")],
        answer: "C",
        explanation: "总份数是 5，每份 4 人，男生有 3 × 4 = 12 人。",
      },
      {
        id: "ratio-2",
        prompt: "地图上 1 厘米表示实际 4 千米，地图上 3 厘米表示实际多少千米？",
        options: [option("A", "7"), option("B", "12"), option("C", "16"), option("D", "24")],
        answer: "B",
        explanation: "每厘米对应 4 千米，3 厘米对应 3 × 4 = 12 千米。",
      },
    ],
    linkedQuestionIds: ["2026-05", "2026-07", "2026-08"],
    sourceFiles: ["第4讲 比与比例", "第5讲 比例应用题"],
  },
  {
    id: "patterns",
    order: 3,
    title: "数列与规律：先观察，再计算",
    summary: "从简单数列找规律，练习把重复变化写成清楚的步骤。",
    level: "基础",
    minutes: 30,
    topics: ["算术", "代数"],
    skills: ["找规律", "逻辑推理"],
    goals: ["观察相邻两项的变化", "区分加法规律和乘法规律", "用规律预测下一项"],
    concepts: ["等差变化", "等比变化", "分组计算"],
    example: {
      title: "每次多 3",
      prompt: "数列 2，5，8，11，…… 的第 6 项是多少？",
      steps: [
        "相邻两项都增加 3。",
        "第 4 项是 11，第 5 项是 14，第 6 项是 17。",
        "也可以从第 1 项开始增加 5 次：2 + 5 × 3 = 17。",
      ],
      answer: "17",
    },
    exercises: [
      {
        id: "patterns-1",
        prompt: "数列 4，8，12，16，…… 的第 8 项是多少？",
        options: [option("A", "28"), option("B", "32"), option("C", "36"), option("D", "40")],
        answer: "B",
        explanation: "每次增加 4，第 8 项是 4 × 8 = 32。",
      },
      {
        id: "patterns-2",
        prompt: "把 1 到 20 的数两两分组：(1+20)、(2+19)、……，每组的和是多少？",
        options: [option("A", "19"), option("B", "20"), option("C", "21"), option("D", "22")],
        answer: "C",
        explanation: "每组都等于 21，例如 1+20、2+19，所以可以快速分组计算。",
      },
    ],
    linkedQuestionIds: ["2026-01"],
    sourceFiles: ["第6讲 等差数列的通项公式", "第7讲 等差数列的求和", "第8讲 等比数列和几何级数"],
  },
  {
    id: "geometry",
    order: 4,
    title: "几何：从图形看数量",
    summary: "用画图、分割和周长面积关系解决 AMC 8 常见几何问题。",
    level: "基础",
    minutes: 35,
    topics: ["几何"],
    skills: ["空间想象", "建模", "计算"],
    goals: ["看懂长方形和三角形的基本量", "用已知量推未知量", "先画图再列式"],
    concepts: ["周长", "面积", "分割与补形"],
    example: {
      title: "长方形的宽",
      prompt: "一个长方形的长是 8 厘米，周长是 26 厘米，宽是多少厘米？",
      steps: [
        "周长包含两个长和两个宽，所以 2 × 长 + 2 × 宽 = 26。",
        "两个长一共是 16 厘米，两个宽一共是 26 - 16 = 10 厘米。",
        "宽是 10 ÷ 2 = 5 厘米。",
      ],
      answer: "5 厘米",
    },
    exercises: [
      {
        id: "geometry-1",
        prompt: "一个正方形边长为 6 厘米，它的面积是多少平方厘米？",
        options: [option("A", "12"), option("B", "24"), option("C", "36"), option("D", "48")],
        answer: "C",
        explanation: "正方形面积 = 边长 × 边长 = 6 × 6 = 36。",
      },
      {
        id: "geometry-2",
        prompt: "一个长方形长 10、宽 8，四周向内 1 米的边框面积是多少？",
        options: [option("A", "24"), option("B", "28"), option("C", "32"), option("D", "36")],
        answer: "C",
        explanation: "总面积 80，内部未覆盖部分是 8 × 6 = 48，所以边框面积是 80 - 48 = 32。",
      },
    ],
    linkedQuestionIds: ["2026-03", "2026-06"],
    sourceFiles: [],
  },
  {
    id: "counting",
    order: 5,
    title: "计数与概率：不重不漏",
    summary: "用列表、分类和乘法原理解决组合问题，避免漏数或重复。",
    level: "基础",
    minutes: 35,
    topics: ["计数与组合", "概率"],
    skills: ["分类枚举", "逻辑推理"],
    goals: ["知道什么时候分类", "用乘法原理计算选择数", "用简单概率表达可能性"],
    concepts: ["有序列表", "乘法原理", "等可能事件"],
    example: {
      title: "搭配衣服",
      prompt: "有 2 件上衣和 3 条裤子，每次选 1 件上衣和 1 条裤子，一共有多少种搭配？",
      steps: [
        "选上衣有 2 种方法。",
        "每选定一件上衣，裤子仍有 3 种选择。",
        "总搭配数是 2 × 3 = 6 种。",
      ],
      answer: "6 种",
    },
    exercises: [
      {
        id: "counting-1",
        prompt: "一个密码由 1 个数字和 1 个字母组成，数字有 3 种选择，字母有 4 种选择。共有多少个密码？",
        options: [option("A", "7"), option("B", "10"), option("C", "12"), option("D", "16")],
        answer: "C",
        explanation: "每个数字都能和 4 个字母搭配，共 3 × 4 = 12 个。",
      },
      {
        id: "counting-2",
        prompt: "袋中有 3 个红球和 1 个蓝球，随机取出 1 个球，取到蓝球的概率是多少？",
        options: [option("A", "1/4"), option("B", "1/3"), option("C", "3/4"), option("D", "1")],
        answer: "A",
        explanation: "一共有 4 个球，其中 1 个是蓝球，所以概率是 1/4。",
      },
    ],
    linkedQuestionIds: ["2026-08"],
    sourceFiles: [],
  },
  {
    id: "algebra",
    order: 6,
    title: "代数入门：让未知数说话",
    summary: "用字母表示未知量，学习把文字关系变成算式和方程。",
    level: "进阶",
    minutes: 40,
    topics: ["代数"],
    skills: ["建模", "计算"],
    goals: ["理解字母表示未知数", "会用逆运算解简单方程", "检查答案是否满足题意"],
    concepts: ["代数式", "等式", "逆运算"],
    example: {
      title: "找回未知数",
      prompt: "一个数加上 7 等于 19，这个数是多少？",
      steps: [
        "设这个数为 x，题目可以写成 x + 7 = 19。",
        "两边都减去 7，得到 x = 12。",
        "检查：12 + 7 = 19，答案正确。",
      ],
      answer: "12",
    },
    exercises: [
      {
        id: "algebra-1",
        prompt: "x - 9 = 14，x 等于多少？",
        options: [option("A", "5"), option("B", "18"), option("C", "23"), option("D", "126")],
        answer: "C",
        explanation: "两边都加 9，x = 14 + 9 = 23。",
      },
      {
        id: "algebra-2",
        prompt: "3x = 21，x 等于多少？",
        options: [option("A", "6"), option("B", "7"), option("C", "18"), option("D", "24")],
        answer: "B",
        explanation: "两边都除以 3，x = 21 ÷ 3 = 7。",
      },
    ],
    linkedQuestionIds: ["2026-09", "2026-10"],
    sourceFiles: ["第9讲 简单代数式的运算", "第10讲 一次方程(组)"],
  },
  {
    id: "number-theory",
    order: 7,
    title: "数论基础：整除和余数",
    summary: "从倍数、因数和余数开始，培养 AMC 8 常见的数字观察能力。",
    level: "进阶",
    minutes: 35,
    topics: ["数论"],
    skills: ["计算", "逻辑推理"],
    goals: ["判断常见整除关系", "理解最大公因数和最小公倍数", "用余数验证数字规律"],
    concepts: ["因数与倍数", "质数", "余数"],
    example: {
      title: "最小公倍数",
      prompt: "小明每 4 天去一次图书馆，每 6 天去一次运动场。今天两处都去了，至少几天后会再次同一天去？",
      steps: [
        "需要找 4 和 6 的共同倍数。",
        "4 的倍数有 4、8、12……，6 的倍数有 6、12……。",
        "最小的共同倍数是 12，所以至少 12 天后再次同日到访。",
      ],
      answer: "12 天",
    },
    exercises: [
      {
        id: "number-theory-1",
        prompt: "下面哪个数是 3 和 4 的最小公倍数？",
        options: [option("A", "6"), option("B", "8"), option("C", "12"), option("D", "24")],
        answer: "C",
        explanation: "12 能被 3 和 4 同时整除，且没有更小的正数满足条件。",
      },
      {
        id: "number-theory-2",
        prompt: "一个数除以 5 余 2，下面哪个数可能是它？",
        options: [option("A", "15"), option("B", "17"), option("C", "20"), option("D", "23")],
        answer: "B",
        explanation: "17 = 5 × 3 + 2，除以 5 的余数是 2。",
      },
    ],
    linkedQuestionIds: ["2026-08"],
    sourceFiles: [],
  },
  {
    id: "problem-solving",
    order: 8,
    title: "解题策略：读题、画图、检查",
    summary: "把计算方法变成稳定的解题流程，学会在做错后找到原因。",
    level: "基础",
    minutes: 25,
    topics: ["算术", "几何", "计数与组合"],
    skills: ["建模", "逻辑推理", "找规律"],
    goals: ["圈出题目中的已知量", "选择合适的表示方法", "用估算和反向检查减少失误"],
    concepts: ["画图", "分类", "估算与验算"],
    example: {
      title: "先估算再精算",
      prompt: "一辆车每小时行驶 48 千米，行驶 3 小时 10 分钟大约多少千米？",
      steps: [
        "先把 3 小时 10 分钟看成约 3 小时，估计结果约为 48 × 3 = 144 千米。",
        "10 分钟是 1/6 小时，精确距离是 48 × (3 + 1/6) = 152 千米。",
        "152 千米和 144 千米接近，说明结果数量级合理。",
      ],
      answer: "152 千米，约 150 千米",
    },
    exercises: [
      {
        id: "problem-solving-1",
        prompt: "做几何题时，最适合先做哪件事？",
        options: [option("A", "马上猜答案"), option("B", "先画出并标记图形"), option("C", "只看选项"), option("D", "跳过已知条件")],
        answer: "B",
        explanation: "把已知量标在图上，可以看清数量关系，减少漏读条件。",
      },
      {
        id: "problem-solving-2",
        prompt: "一道题算出的答案比估计值大很多，最应该先做什么？",
        options: [option("A", "直接提交"), option("B", "检查单位和计算步骤"), option("C", "换一个选项蒙"), option("D", "删除题目")],
        answer: "B",
        explanation: "估算是检查数量级的工具，差距过大时应回看单位和步骤。",
      },
    ],
    linkedQuestionIds: ["2026-01", "2026-03", "2026-06"],
    sourceFiles: ["第15讲 绝对值问题", "第16讲 地板函数", "第17讲 定义新运算"],
  },
];

export const learningResources: LearningResource[] = [
  {
    title: "AMC 8 百日贯通课程",
    type: "课程",
    description: "当前目录中的专题讲义来源，可按章节配合本学习路径使用。",
    href: "https://space.bilibili.com/1632276842/lists/6541994?type=season",
  },
  {
    title: "MAA AMC 官方介绍",
    type: "官方资料",
    description: "了解 AMC 8 的考试范围、形式和官方信息。",
    href: "https://maa.org/student-programs/amc/",
  },
  {
    title: "Mastering AMC 8",
    type: "补充教材",
    description: "Omega Learn 提供的免费英文补充教材和视频讲解。",
    href: "https://www.omegalearn.org/mastering-amc8",
  },
];

export function getLesson(lessonId: string) {
  return lessons.find((lesson) => lesson.id === lessonId);
}
