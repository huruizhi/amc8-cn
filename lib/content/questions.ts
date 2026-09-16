import { questions2025 } from "./questions-2025";
import { questions2024 } from "./questions-2024";
import { questions2023 } from "./questions-2023";
import { questions2022 } from "./questions-2022";
import { questions2020 } from "./questions-2020";
import { questions2019 } from "./questions-2019";
import { questions2018 } from "./questions-2018";

export type Topic =
  | "算术"
  | "数论"
  | "代数"
  | "几何"
  | "计数与组合"
  | "概率"
  | "数据与统计";

export type QuestionOption = {
  label: "A" | "B" | "C" | "D" | "E";
  valueZh: string;
  valueEn?: string;
  histogram?: number[];
};

export type Question = {
  id: string;
  year: number;
  number: number;
  status: "published";
  primaryTopic: Topic;
  secondaryTopics?: Topic[];
  skills: string[];
  formats: string[];
  difficulty: 1 | 2 | 3 | 4 | 5;
  promptZh: string;
  promptEn: string;
  expression?: string[];
  figure?: {
    src: string;
    altZh: string;
    altEn: string;
  };
  options: QuestionOption[];
  answer: QuestionOption["label"];
  solutionZh: string[];
  solutionEn: string[];
  sourceUrl: string;
};

const numericOptions = (values: string[]): QuestionOption[] =>
  values.map((value, index) => ({
    label: String.fromCharCode(65 + index) as QuestionOption["label"],
    valueZh: value,
  }));

export const questions: Question[] = [
  {
    id: "2026-01",
    year: 2026,
    number: 1,
    status: "published",
    primaryTopic: "算术",
    skills: ["计算", "找规律"],
    formats: ["算式"],
    difficulty: 1,
    promptZh: "下面算式的值是多少？",
    promptEn: "What is the value of the following expression?",
    expression: ["1 + 2 - 3 + 4 + 5 - 6 +", "7 + 8 - 9 + 10 + 11 - 12"],
    options: numericOptions(["18", "21", "24", "27", "30"]),
    answer: "A",
    solutionZh: [
      "把算式每三个数分成一组：",
      "(1 + 2 - 3) + (4 + 5 - 6) + (7 + 8 - 9) + (10 + 11 - 12)。",
      "四组的值依次是 0、3、6、9，所以总和为 0 + 3 + 6 + 9 = 18。",
    ],
    solutionEn: [
      "Group the expression into four groups of three terms.",
      "The group sums are 0, 3, 6, and 9, so the total is 18.",
    ],
    sourceUrl: "https://live.poshenloh.com/past-contests/amc8/2026",
  },
  {
    id: "2026-02",
    year: 2026,
    number: 2,
    status: "published",
    primaryTopic: "算术",
    skills: ["计算", "找规律"],
    formats: ["表格"],
    difficulty: 1,
    promptZh: "在下图的数阵中，3 个 3 被一圈 2 包围，而这些 2 又被一圈 1 包围。数阵中所有数的和是多少？",
    promptEn: "In the array shown below, three 3s are surrounded by 2s, which are in turn surrounded by a border of 1s. What is the sum of the numbers in the array?",
    figure: {
      src: "/questions/2026/q02.png",
      altZh: "五行七列的数阵：外圈是 1，内圈是 2，中间三个数是 3。",
      altEn: "A five-by-seven array with a border of 1s, an inner border of 2s, and three 3s in the center.",
    },
    options: numericOptions(["49", "51", "53", "55", "57"]),
    answer: "C",
    solutionZh: [
      "外圈共有 20 个 1，内圈共有 12 个 2，中间有 3 个 3。",
      "总和为 20 × 1 + 12 × 2 + 3 × 3 = 20 + 24 + 9 = 53。",
    ],
    solutionEn: [
      "There are 20 border entries equal to 1, 12 entries equal to 2, and 3 entries equal to 3.",
      "Their sum is 20 · 1 + 12 · 2 + 3 · 3 = 53.",
    ],
    sourceUrl: "https://live.poshenloh.com/past-contests/amc8/2026",
  },
  {
    id: "2026-03",
    year: 2026,
    number: 3,
    status: "published",
    primaryTopic: "几何",
    secondaryTopics: ["算术"],
    skills: ["建模", "计算"],
    formats: ["文字应用题"],
    difficulty: 2,
    promptZh:
      "Haruki 有一根长 24 厘米的铁丝。他想依次把它弯成以下图形：边长 5 厘米的正六边形；面积 36 平方厘米的正方形；两条直角边分别为 6 厘米和 8 厘米的直角三角形。他能弯成哪些图形？",
    promptEn:
      "Haruki has a piece of wire that is 24 centimeters long. He wants to bend it to form: a regular hexagon with side length 5 cm, a square of area 36 cm², and a right triangle whose legs are 6 cm and 8 cm. Which shapes can Haruki make?",
    options: [
      { label: "A", valueZh: "只能弯成三角形", valueEn: "Triangle only" },
      { label: "B", valueZh: "只能弯成六边形和正方形", valueEn: "Hexagon and square only" },
      { label: "C", valueZh: "只能弯成六边形和三角形", valueEn: "Hexagon and triangle only" },
      { label: "D", valueZh: "只能弯成正方形和三角形", valueEn: "Square and triangle only" },
      { label: "E", valueZh: "三种图形都可以", valueEn: "Hexagon, triangle, and square" },
    ],
    answer: "D",
    solutionZh: [
      "正六边形的周长是 6 × 5 = 30 厘米，超过铁丝长度。",
      "正方形面积为 36，所以边长为 6 厘米，周长为 24 厘米。",
      "直角三角形的斜边为 10 厘米，周长为 6 + 8 + 10 = 24 厘米。",
      "因此只能弯成正方形和三角形。",
    ],
    solutionEn: [
      "The hexagon needs 30 cm of wire.",
      "The square has side length 6 cm and perimeter 24 cm.",
      "The right triangle is a 6-8-10 triangle with perimeter 24 cm.",
    ],
    sourceUrl: "https://live.poshenloh.com/past-contests/amc8/2026",
  },
  {
    id: "2026-04",
    year: 2026,
    number: 4,
    status: "published",
    primaryTopic: "算术",
    skills: ["建模", "计算"],
    formats: ["文字应用题"],
    difficulty: 2,
    promptZh:
      "Brynn 的存款在 7 月减少了 20%，随后在 8 月增加了 50%。现在的存款是原来存款的百分之几？",
    promptEn:
      "Brynn’s savings decreased by 20% in July, then increased by 50% in August. Brynn’s savings are now what percent of the original amount?",
    options: numericOptions(["80%", "90%", "100%", "110%", "120%"]),
    answer: "E",
    solutionZh: [
      "设原有存款为 100。7 月后剩下 100 × 80% = 80。",
      "8 月增加 50% 后变为 80 × 150% = 120。",
      "因此现在的存款是原来的 120%。",
    ],
    solutionEn: [
      "Represent the original savings by 100.",
      "After July there is 80, and after a 50% increase there is 80 × 1.5 = 120.",
    ],
    sourceUrl: "https://live.poshenloh.com/past-contests/amc8/2026",
  },
  {
    id: "2026-05",
    year: 2026,
    number: 5,
    status: "published",
    primaryTopic: "算术",
    skills: ["建模", "计算"],
    formats: ["文字应用题"],
    difficulty: 1,
    promptZh: "Casey 进行了一次 100 英里的公路旅行，途中只停下来吃了一次午饭。整段旅程共用 3 小时，她开车时的平均速度是每小时 40 英里。午饭休息用了多少分钟？",
    promptEn: "Casey went on a road trip that covered 100 miles, stopping only for a lunch break along the way. The trip took 3 hours in total and her average speed while driving was 40 miles per hour. In minutes, how long was the lunch break?",
    options: numericOptions(["15", "30", "40", "45", "60"]),
    answer: "B",
    solutionZh: [
      "开车 100 英里、速度为每小时 40 英里，需要 100 ÷ 40 = 2.5 小时。",
      "全程 3 小时，因此午饭休息了 3 - 2.5 = 0.5 小时，也就是 30 分钟。",
    ],
    solutionEn: [
      "Driving 100 miles at 40 miles per hour takes 2.5 hours.",
      "The remaining 0.5 hour is a 30-minute lunch break.",
    ],
    sourceUrl: "https://live.poshenloh.com/past-contests/amc8/2026",
  },
  {
    id: "2026-06",
    year: 2026,
    number: 6,
    status: "published",
    primaryTopic: "几何",
    secondaryTopics: ["算术"],
    skills: ["建模", "计算"],
    formats: ["几何图"],
    difficulty: 2,
    promptZh: "Peter 家附近有一块长 10 米、宽 8 米的长方形黑莓地。他能摘到距离田地边缘不超过 1 米的黑莓，如图中阴影部分所示。他能摘到的部分占整块田地面积的几分之几？",
    promptEn: "Peter lives near a rectangular field that is filled with blackberry bushes. The field is 10 meters long and 8 meters wide, and Peter can reach any blackberries that are within 1 meter of an edge of the field. The portion he can reach is shaded. What fraction of the area can Peter reach?",
    figure: {
      src: "/questions/2026/q06.png",
      altZh: "一个 10 米乘 8 米的长方形，沿四条边向内 1 米的边框区域被涂成阴影。",
      altEn: "A 10-by-8 rectangle with the one-meter-wide border along all four sides shaded.",
    },
    options: numericOptions(["1/6", "1/4", "1/3", "3/8", "2/5"]),
    answer: "E",
    solutionZh: [
      "整块田地面积为 10 × 8 = 80 平方米。",
      "无法触及的内部长方形长 8 米、宽 6 米，面积为 48 平方米。",
      "可触及面积为 80 - 48 = 32 平方米，所占比例为 32/80 = 2/5。",
    ],
    solutionEn: [
      "The whole field has area 80 square meters.",
      "The unreachable inner rectangle is 8 by 6, with area 48.",
      "The reachable fraction is (80 - 48) / 80 = 2/5.",
    ],
    sourceUrl: "https://live.poshenloh.com/past-contests/amc8/2026",
  },
  {
    id: "2026-07",
    year: 2026,
    number: 7,
    status: "published",
    primaryTopic: "算术",
    skills: ["建模", "计算"],
    formats: ["文字应用题"],
    difficulty: 2,
    promptZh: "Mika 想估计一款新电动自行车充满电后能骑多远。她两次骑行共 40 英里，第一次用了总电量的 1/2，第二次用了总电量的 3/10。这辆车充满电可骑多少英里？",
    promptEn: "Mika completed two trips totaling 40 miles. The first trip used 1/2 of the total battery power, while the second used 3/10. How many miles can the bike go on a fully charged battery?",
    options: numericOptions(["45", "48", "50", "52", "55"]),
    answer: "C",
    solutionZh: [
      "两次骑行共用了 1/2 + 3/10 = 4/5 的电量。",
      "40 英里对应总续航的 4/5，因此满电续航为 40 ÷ (4/5) = 50 英里。",
    ],
    solutionEn: [
      "The two trips used 1/2 + 3/10 = 4/5 of a full battery.",
      "If 4/5 of the range is 40 miles, the full range is 50 miles.",
    ],
    sourceUrl: "https://live.poshenloh.com/past-contests/amc8/2026",
  },
  {
    id: "2026-08",
    year: 2026,
    number: 8,
    status: "published",
    primaryTopic: "数论",
    secondaryTopics: ["算术"],
    skills: ["逻辑推理", "计算"],
    formats: ["文字应用题"],
    difficulty: 2,
    promptZh: "一项调查询问若干人是否喜欢解数学题，恰好有 74% 的人回答“喜欢”。接受调查的人数最少可能是多少？",
    promptEn: "A poll asked a number of people if they liked solving mathematics problems. Exactly 74% answered yes. What is the fewest possible number of people who could have been asked?",
    options: numericOptions(["10", "20", "25", "50", "100"]),
    answer: "D",
    solutionZh: [
      "74% = 74/100 = 37/50。",
      "回答“喜欢”的人数必须是整数，因此总人数必须是 50 的倍数；最少为 50 人。",
    ],
    solutionEn: [
      "Reduce 74% to 37/50.",
      "The total must be a multiple of 50, and 50 people is possible.",
    ],
    sourceUrl: "https://live.poshenloh.com/past-contests/amc8/2026",
  },
  {
    id: "2026-09",
    year: 2026,
    number: 9,
    status: "published",
    primaryTopic: "代数",
    secondaryTopics: ["算术"],
    skills: ["计算"],
    formats: ["算式"],
    difficulty: 2,
    promptZh: "下面算式的值是多少？",
    promptEn: "What is the value of this expression?",
    expression: ["√(16√81) / √(81√16)"],
    options: numericOptions(["4/9", "2/3", "1", "3/2", "9/4"]),
    answer: "B",
    solutionZh: [
      "分子为 √(16√81) = √(16 × 9) = √144 = 12。",
      "分母为 √(81√16) = √(81 × 4) = √324 = 18。",
      "所以原式等于 12/18 = 2/3。",
    ],
    solutionEn: [
      "The numerator is √(16 · 9) = 12.",
      "The denominator is √(81 · 4) = 18, so the value is 2/3.",
    ],
    sourceUrl: "https://live.poshenloh.com/past-contests/amc8/2026",
  },
  {
    id: "2026-10",
    year: 2026,
    number: 10,
    status: "published",
    primaryTopic: "代数",
    skills: ["逻辑推理", "建模"],
    formats: ["文字应用题"],
    difficulty: 2,
    promptZh: "Luke、Melina、Nico、Olympia 和 Pedro 五人完成了 X 马拉松。Nico 比 Pedro 晚 11 分钟；Olympia 比 Melina 早 2 分钟，但比 Pedro 晚 3 分钟；Olympia 比 Luke 早 6 分钟。谁是第四名？",
    promptEn: "Five runners completed the Xmarathon. Nico finished 11 minutes behind Pedro. Olympia finished 2 minutes ahead of Melina, but 3 minutes behind Pedro. Olympia finished 6 minutes ahead of Luke. Which runner finished fourth?",
    options: [
      { label: "A", valueZh: "Luke" },
      { label: "B", valueZh: "Melina" },
      { label: "C", valueZh: "Nico" },
      { label: "D", valueZh: "Olympia" },
      { label: "E", valueZh: "Pedro" },
    ],
    answer: "A",
    solutionZh: [
      "把 Pedro 的完成时刻记为 0 分钟，则 Olympia、Melina、Luke、Nico 分别是 3、5、9、11 分钟。",
      "顺序为 Pedro、Olympia、Melina、Luke、Nico，所以第四名是 Luke。",
    ],
    solutionEn: [
      "Measure finish times in minutes after Pedro: Olympia 3, Melina 5, Luke 9, and Nico 11.",
      "Luke is therefore the fourth finisher.",
    ],
    sourceUrl: "https://live.poshenloh.com/past-contests/amc8/2026",
  },
  {
    id: "2026-11",
    year: 2026,
    number: 11,
    status: "published",
    primaryTopic: "几何",
    skills: ["空间想象", "计算"],
    formats: ["几何图"],
    difficulty: 3,
    promptZh: "边长分别为 1、1、2、3、5 的正方形按下图拼成长方形。每个正方形内画一个四分之一圆，并按半径从小到大依次连接。所得曲线的长度是多少？",
    promptEn: "Squares of side length 1, 1, 2, 3, and 5 are arranged to form the rectangle shown. A curve is drawn by inscribing a quarter circle in each square and joining them from shortest to longest. What is the length of the curve?",
    figure: {
      src: "/questions/2026/q11.png",
      altZh: "由边长 1、1、2、3、5 的正方形拼成的长方形，其中五段四分之一圆依次连接成螺旋状曲线。",
      altEn: "A rectangle tiled by squares of side lengths 1, 1, 2, 3, and 5, with joined quarter-circle arcs forming a spiral.",
    },
    options: numericOptions(["4π", "6π", "(13/2)π", "8π", "13π"]),
    answer: "B",
    solutionZh: [
      "五段曲线都是四分之一圆，半径依次为 1、1、2、3、5。",
      "总长度为 (1/4) × 2π × (1 + 1 + 2 + 3 + 5) = 6π。",
    ],
    solutionEn: [
      "The five pieces are quarter circles with radii 1, 1, 2, 3, and 5.",
      "Their total length is (1/4)(2π)(12) = 6π.",
    ],
    sourceUrl: "https://live.poshenloh.com/past-contests/amc8/2026",
  },
  {
    id: "2026-12",
    year: 2026,
    number: 12,
    status: "published",
    primaryTopic: "代数",
    skills: ["逻辑推理", "分类枚举"],
    formats: ["操作或路径图"],
    difficulty: 3,
    promptZh: "下图的每个圆中将填入 1 到 6 的一个数字，且每个数字恰好使用一次。相邻两个圆中数字的和标在它们之间的方框里。最上方的圆中必须填哪个数字？",
    promptEn: "Each circle will be filled with a digit from 1 to 6, each used exactly once. The sum of the digits in neighboring circles is shown in the box between them. What digit must be placed in the top circle?",
    figure: {
      src: "/questions/2026/q12.png",
      altZh: "六个圆沿三角形边界排列，相邻圆之间依次标有和 9、10、8、5、4、6。顶端圆内为问号。",
      altEn: "Six circles around a triangular path, with adjacent sums 9, 10, 8, 5, 4, and 6; the top circle has a question mark.",
    },
    options: [
      { label: "A", valueZh: "2" },
      { label: "B", valueZh: "3" },
      { label: "C", valueZh: "4" },
      { label: "D", valueZh: "5" },
      { label: "E", valueZh: "无法完成填写", valueEn: "It is impossible to fill the circles" },
    ],
    answer: "D",
    solutionZh: [
      "设顶端数字为 x。沿顺时针方向，其余数字依次可表示为 6 - x、x - 2、7 - x、x + 1、9 - x。",
      "要使这六个数恰好是 1、2、3、4、5、6，取 x = 5 时得到 5、1、3、2、6、4。",
      "因此顶端必须填 5。",
    ],
    solutionEn: [
      "Let the top digit be x and use each adjacent sum to express the other five digits in terms of x.",
      "The six values become exactly 1 through 6 only when x = 5.",
    ],
    sourceUrl: "https://live.poshenloh.com/past-contests/amc8/2026",
  },
  {
    id: "2026-13",
    year: 2026,
    number: 13,
    status: "published",
    primaryTopic: "几何",
    skills: ["空间想象", "计算"],
    formats: ["几何图"],
    difficulty: 3,
    promptZh: "下图由 1 × 1 的单位正方形铺成，相邻两行在水平方向错开半个单位。阴影正方形的每个顶点都是某个单位正方形的顶点。阴影正方形的面积是多少平方单位？",
    promptEn: "The figure shows a tiling of 1 × 1 unit squares. Each row is shifted horizontally by half a unit relative to the row above. A shaded square is drawn with each vertex on a grid vertex. What is its area?",
    figure: {
      src: "/questions/2026/q13.png",
      altZh: "错开半格的砖墙网格上画有一个倾斜的阴影正方形，其一条边水平跨 3 个单位并竖直跨 1 个单位。",
      altEn: "A tilted shaded square on a staggered unit-square grid; one side spans 3 units horizontally and 1 unit vertically.",
    },
    options: numericOptions(["10", "21/2", "32/3", "11", "34/3"]),
    answer: "A",
    solutionZh: [
      "阴影正方形的一条边在网格中水平跨 3 个单位、竖直跨 1 个单位。",
      "由勾股定理，边长的平方为 3² + 1² = 10。正方形面积等于边长的平方，所以面积为 10。",
    ],
    solutionEn: [
      "One side spans 3 units horizontally and 1 unit vertically.",
      "Its squared length is 3² + 1² = 10, which is also the area of the square.",
    ],
    sourceUrl: "https://live.poshenloh.com/past-contests/amc8/2026",
  },
  {
    id: "2026-14",
    year: 2026,
    number: 14,
    status: "published",
    primaryTopic: "代数",
    skills: ["建模", "计算"],
    formats: ["文字应用题"],
    difficulty: 3,
    promptZh: "Jami 在数轴上选了三个等间距的整数。第一个数与第二个数的和是 40，第二个数与第三个数的和是 60。这三个数的总和是多少？",
    promptEn: "Jami picked three equally spaced integer numbers on the number line. The sum of the first and second is 40, while the sum of the second and third is 60. What is the sum of all three numbers?",
    options: numericOptions(["70", "75", "80", "85", "90"]),
    answer: "B",
    solutionZh: [
      "设三个数为 a - d、a、a + d，则 2a - d = 40，2a + d = 60。",
      "两式相加得 4a = 100，所以 a = 25。三个数的和为 3a = 75。",
    ],
    solutionEn: [
      "Write the numbers as a - d, a, and a + d.",
      "Adding 2a - d = 40 and 2a + d = 60 gives a = 25, so the total is 3a = 75.",
    ],
    sourceUrl: "https://live.poshenloh.com/past-contests/amc8/2026",
  },
  {
    id: "2026-15",
    year: 2026,
    number: 15,
    status: "published",
    primaryTopic: "几何",
    secondaryTopics: ["计数与组合"],
    skills: ["空间想象", "逻辑推理"],
    formats: ["立体图"],
    difficulty: 3,
    promptZh: "Elijah 有许多相同的木立方体。每个立方体有 4 个素面，以及两个共用一条棱的阴影面。他把若干立方体面对面粘在一起。图中两个立方体粘合后仍有 3 个阴影面可见。至少要粘多少个立方体，才能通过适当旋转各立方体，使所有阴影面都不可见？",
    promptEn: "Each wooden cube is plain on 4 faces and shaded on 2 faces that share an edge. Elijah glues cubes face-to-face. What is the fewest number he could glue together so that no shaded faces are visible, after choosing the orientations?",
    figure: {
      src: "/questions/2026/q15.png",
      altZh: "两个各有两个相邻阴影面的立方体，箭头指向它们面对面粘合后的形状，此时仍有三个阴影面可见。",
      altEn: "Two cubes with adjacent shaded faces, followed by the two cubes glued face-to-face with three shaded faces still visible.",
    },
    options: numericOptions(["4", "6", "8", "9", "27"]),
    answer: "A",
    solutionZh: [
      "要让一个立方体的两个阴影面都不可见，它必须在这两个相邻方向上各有一个面对面相接的邻居。",
      "三个立方体无论怎样面对面连接，至少有一个端点立方体只有一个邻居，因此不够。",
      "四个立方体排成 2 × 2 方阵时，可以把每个立方体的两个阴影面都朝向方阵内部，所以 4 个足够。",
    ],
    solutionEn: [
      "Each cube needs face-neighbors covering both adjacent shaded faces.",
      "Three cubes always leave an end cube with only one neighbor, but four cubes in a 2 × 2 arrangement can hide every shaded face.",
    ],
    sourceUrl: "https://live.poshenloh.com/past-contests/amc8/2026",
  },
  {
    id: "2026-16",
    year: 2026,
    number: 16,
    status: "published",
    primaryTopic: "数论",
    secondaryTopics: ["计数与组合"],
    skills: ["分类枚举", "计算"],
    formats: ["文字题"],
    difficulty: 4,
    promptZh: "考虑所有只由偶数数字组成的四位正整数。其中有几分之几能被 4 整除？",
    promptEn: "Consider all positive four-digit integers consisting only of even digits. What fraction of these integers are divisible by 4?",
    options: numericOptions(["1/4", "2/5", "1/2", "3/5", "3/4"]),
    answer: "D",
    solutionZh: [
      "千位有 4 种选择，其他各位有 5 种选择；是否能被 4 整除只取决于末两位。",
      "末两位共有 25 种偶数字组合。对每个偶数十位，个位取 0、4、8 中合适的三个值，共有 15 种可被 4 整除的末两位。",
      "所求比例为 15/25 = 3/5。",
    ],
    solutionEn: [
      "Divisibility by 4 depends only on the last two digits.",
      "Among the 25 even-digit endings, 15 are divisible by 4, so the fraction is 15/25 = 3/5.",
    ],
    sourceUrl: "https://live.poshenloh.com/past-contests/amc8/2026",
  },
  {
    id: "2026-17",
    year: 2026,
    number: 17,
    status: "published",
    primaryTopic: "计数与组合",
    skills: ["分类枚举", "逻辑推理"],
    formats: ["文字题"],
    difficulty: 4,
    promptZh: "四名学生坐成一排。他们与相邻的人交谈后重新排座，使每个人都不再与原先相邻的人相邻。共有多少种新的排法？",
    promptEn: "Four students are seated in a row. They chat with the people next to them, then rearrange themselves so that they are no longer seated next to any of the same people. How many rearrangements are possible?",
    options: numericOptions(["2", "4", "9", "12", "24"]),
    answer: "A",
    solutionZh: [
      "设原顺序为 A、B、C、D，则 AB、BC、CD 这三对不能再相邻。允许相邻的只有 AC、AD、BD。",
      "新的一排必须恰好使用这三条允许的相邻关系，因此只有 C-A-D-B 及其反向 B-D-A-C 两种。",
    ],
    solutionEn: [
      "With original order A-B-C-D, the forbidden adjacent pairs are AB, BC, and CD.",
      "The only row using the three allowed pairs AC, AD, and BD is C-A-D-B or its reverse, for 2 arrangements.",
    ],
    sourceUrl: "https://live.poshenloh.com/past-contests/amc8/2026",
  },
  {
    id: "2026-18",
    year: 2026,
    number: 18,
    status: "published",
    primaryTopic: "数论",
    skills: ["分类枚举", "建模"],
    formats: ["文字题"],
    difficulty: 4,
    promptZh: "把 60 写成两个或更多个按递增顺序排列的连续正奇数之和，共有多少种写法？",
    promptEn: "In how many ways can 60 be written as the sum of two or more consecutive odd positive integers arranged in increasing order?",
    options: numericOptions(["1", "2", "3", "4", "5"]),
    answer: "B",
    solutionZh: [
      "若共有 k 项、首项为正奇数 a，则总和为 k(a + k - 1) = 60。",
      "检查 60 的可能因数后，可得两种正奇数连续和：29 + 31，以及 5 + 7 + 9 + 11 + 13 + 15。",
      "因此共有 2 种写法。",
    ],
    solutionEn: [
      "For k terms beginning with odd a, the sum is k(a + k - 1) = 60.",
      "The valid sums are 29 + 31 and 5 + 7 + 9 + 11 + 13 + 15, so there are 2 ways.",
    ],
    sourceUrl: "https://live.poshenloh.com/past-contests/amc8/2026",
  },
  {
    id: "2026-19",
    year: 2026,
    number: 19,
    status: "published",
    primaryTopic: "代数",
    skills: ["建模", "计算"],
    formats: ["文字应用题"],
    difficulty: 4,
    promptZh: "Miguel 牵着狗 Luna 散步。到公园入口时，他把球沿正前方扔向一棵树并继续匀速行走。Luna 冲到停在树旁的球处，随即把球带回 Miguel 身边。Luna 的速度是 Miguel 的 5 倍。当 Luna 把球带回来时，Miguel 已走过入口到树距离的几分之几？",
    promptEn: "Miguel throws a ball straight ahead to a tree and keeps walking steadily. Luna runs to the ball and brings it back. Luna runs 5 times faster than Miguel. What fraction of the entrance-to-tree distance has Miguel covered when Luna returns?",
    options: numericOptions(["1/6", "1/5", "1/4", "1/3", "2/5"]),
    answer: "D",
    solutionZh: [
      "设入口到树的距离为 D，Miguel 的速度为 1，则 Luna 的速度为 5。Luna 到树需要 D/5 的时间，此时 Miguel 走了 D/5。",
      "两者相距 4D/5，相向而行的合速度为 6，因此相遇还需 (4D/5) ÷ 6 = 2D/15 的时间。",
      "Miguel 共走了 D/5 + 2D/15 = D/3，即全程的 1/3。",
    ],
    solutionEn: [
      "Let the distance be D and Miguel's speed be 1, so Luna's speed is 5.",
      "After Luna reaches the tree, they are 4D/5 apart and close at speed 6. Miguel's total distance is D/5 + 2D/15 = D/3.",
    ],
    sourceUrl: "https://live.poshenloh.com/past-contests/amc8/2026",
  },
  {
    id: "2026-20",
    year: 2026,
    number: 20,
    status: "published",
    primaryTopic: "计数与组合",
    secondaryTopics: ["代数"],
    skills: ["分类枚举", "计算"],
    formats: ["文字应用题"],
    difficulty: 4,
    promptZh: "Catania 使用厚 1 毫米的金币和厚 3 毫米的银币。Taylor 要把金币和银币按任意顺序叠成 8 毫米高；不同顺序算不同方法。共有多少种叠法？",
    promptEn: "Gold coins are 1 mm thick and silver coins are 3 mm thick. In how many ways can Taylor make an 8 mm stack using any arrangement of gold and silver coins, assuming order matters?",
    options: numericOptions(["3", "7", "10", "13", "16"]),
    answer: "D",
    solutionZh: [
      "没有银币时，8 枚金币只有 1 种排法。",
      "有 1 枚银币时还需 5 枚金币，银币可放在 6 个位置，共 6 种。",
      "有 2 枚银币时还需 2 枚金币，从 4 个位置中选 2 个放银币，共 C(4,2) = 6 种。总数为 1 + 6 + 6 = 13。",
    ],
    solutionEn: [
      "With 0 silver coins there is 1 stack. With 1 silver and 5 gold coins there are 6 arrangements.",
      "With 2 silver and 2 gold coins there are C(4,2) = 6 arrangements. The total is 13.",
    ],
    sourceUrl: "https://live.poshenloh.com/past-contests/amc8/2026",
  },
  {
    id: "2026-21",
    year: 2026,
    number: 21,
    status: "published",
    primaryTopic: "概率",
    skills: ["建模", "逻辑推理"],
    formats: ["操作或路径图"],
    difficulty: 4,
    promptZh: "蜘蛛 Charlotte 沿下图的五角星形蛛网行走。蛛网有 5 个外顶点和 5 个内顶点。她每到一个顶点，就等概率选择一个相邻顶点前往。她从一个外顶点出发，走 3 步（可以重复经过顶点）。此时她位于外顶点的概率是多少？",
    promptEn: "Charlotte walks along a web shaped like a 5-pointed star with 5 outer and 5 inner points. At each point she randomly chooses a neighboring point. Starting at an outer point, what is the probability she is at an outer point after 3 moves?",
    figure: {
      src: "/questions/2026/q21.png",
      altZh: "五角星形路径图，标出五个外顶点和五个线段交点形成的内顶点。",
      altEn: "A five-pointed star graph with five outer vertices and five inner intersection vertices.",
    },
    options: numericOptions(["1/5", "1/4", "2/5", "1/2", "3/5"]),
    answer: "B",
    solutionZh: [
      "从外顶点出发，第一步一定到内顶点。每个内顶点有 4 个邻点，其中 2 个是外顶点，所以从内到外的概率为 1/2。",
      "第二步后，位于外顶点和内顶点的概率各为 1/2。第三步只有从内顶点出发才可能到外顶点。",
      "最终概率为 (1/2) × (1/2) = 1/4。",
    ],
    solutionEn: [
      "After one move Charlotte is at an inner point. From an inner point, 2 of 4 neighbors are outer, so the chance to move outer is 1/2.",
      "After two moves she is inner with probability 1/2; multiplying by another 1/2 gives 1/4 after the third move.",
    ],
    sourceUrl: "https://live.poshenloh.com/past-contests/amc8/2026",
  },
  {
    id: "2026-22",
    year: 2026,
    number: 22,
    status: "published",
    primaryTopic: "数据与统计",
    secondaryTopics: ["计数与组合"],
    skills: ["逻辑推理", "分类枚举"],
    formats: ["文字题"],
    difficulty: 4,
    promptZh: "把 1 到 25 的整数任意分成五组，每组 5 个数。找出每组的中位数，再令 M 为这五个中位数的中位数。M 最小可能是多少？",
    promptEn: "The integers from 1 through 25 are separated into five groups of 5. Let M be the median of the five group medians. What is the least possible value of M?",
    options: numericOptions(["9", "10", "12", "13", "14"]),
    answer: "A",
    solutionZh: [
      "若一组的中位数不超过 8，该组至少要有 3 个数不超过 8。要使五个中位数的中位数不超过 8，至少要有 3 组满足这一条件，共需至少 9 个不超过 8 的数，不可能。",
      "所以 M ≥ 9。这个下界可以达到，例如让五组的中位数为 5、8、9、12、17。",
      "因此 M 的最小值为 9。",
    ],
    solutionEn: [
      "Three group medians at most 8 would require at least 9 numbers at most 8, which is impossible. Thus M ≥ 9.",
      "A grouping with medians 5, 8, 9, 12, and 17 shows that M = 9 is attainable.",
    ],
    sourceUrl: "https://live.poshenloh.com/past-contests/amc8/2026",
  },
  {
    id: "2026-23",
    year: 2026,
    number: 23,
    status: "published",
    primaryTopic: "几何",
    skills: ["空间想象", "计算"],
    formats: ["几何图"],
    difficulty: 4,
    promptZh: "Lakshmi 有 5 枚直径为 4 厘米的圆形硬币。她按图排成两行，并用橡皮筋紧紧绕住。橡皮筋的长度是多少厘米？",
    promptEn: "Lakshmi has 5 round coins of diameter 4 centimeters. She arranges them in 2 rows as shown and wraps an elastic band tightly around them. What is the length of the band?",
    figure: {
      src: "/questions/2026/q23.png",
      altZh: "五个相切圆按下排三个、上排两个排列，外侧有一条绷紧的橡皮筋围成圆角梯形。",
      altEn: "Five tangent circles arranged three on the bottom and two on top, enclosed by a tight band shaped like a rounded trapezoid.",
    },
    options: numericOptions(["2π + 20", "(5/2)π + 20", "4π + 20", "(9/2)π + 20", "5π + 20"]),
    answer: "C",
    solutionZh: [
      "连接最外层硬币的圆心，得到一个周长为 20 的梯形：两条底边长分别为 8、4，两条斜边各长 4。",
      "橡皮筋绕圆角增加的总弧长恰好是一整圈半径 2 的圆周，即 4π。",
      "所以橡皮筋总长为 20 + 4π。",
    ],
    solutionEn: [
      "The convex hull of the coin centers is a trapezoid with perimeter 8 + 4 + 4 + 4 = 20.",
      "The rounded portions total one full circumference of radius 2, adding 4π. The length is 20 + 4π.",
    ],
    sourceUrl: "https://live.poshenloh.com/past-contests/amc8/2026",
  },
  {
    id: "2026-24",
    year: 2026,
    number: 24,
    status: "published",
    primaryTopic: "数论",
    skills: ["计算", "找规律"],
    formats: ["算式"],
    difficulty: 5,
    promptZh: "记 n! 为前 n 个正整数的乘积。定义 n 的“超级阶乘”为 1!·2!·…·n!。在 51 的超级阶乘 1!·2!·…·51! 的质因数分解中，因数 7 一共出现多少次？",
    promptEn: "The superfactorial of n is the product 1! · 2! · ... · n!. How many factors of 7 appear in the prime factorization of the superfactorial of 51?",
    expression: ["1! · 2! · 3! · … · 51!"],
    options: numericOptions(["147", "150", "156", "168", "171"]),
    answer: "E",
    solutionZh: [
      "n! 中因数 7 的个数为 ⌊n/7⌋ + ⌊n/49⌋。",
      "把 n 从 1 加到 51：Σ⌊n/7⌋ = 7(1 + 2 + 3 + 4 + 5 + 6) + 3 × 7 = 168。",
      "另外 Σ⌊n/49⌋ = 3，所以总数为 168 + 3 = 171。",
    ],
    solutionEn: [
      "The exponent of 7 in n! is floor(n/7) + floor(n/49).",
      "Summing from n = 1 to 51 gives 168 from the first terms and 3 from the second terms, for 171 total.",
    ],
    sourceUrl: "https://live.poshenloh.com/past-contests/amc8/2026",
  },
  {
    id: "2026-25",
    year: 2026,
    number: 25,
    status: "published",
    primaryTopic: "计数与组合",
    secondaryTopics: ["几何"],
    skills: ["分类枚举", "空间想象"],
    formats: ["几何图"],
    difficulty: 5,
    promptZh: "等角六边形的每个内角都是 120°。图中给出一个边长依次为 2、3、1、3、2、2 的例子，它内接于等边三角形 ABC，六个顶点都在三角形的边上。考虑所有边长为正整数、同样内接于该三角形的等角六边形；仅旋转或翻转后相同的图形视为同一种。共有多少种？",
    promptEn: "An equiangular hexagon has all interior angles 120°. Consider all such hexagons with positive integer side lengths inscribed in the shown equilateral triangle, with all six vertices on its sides. Hexagons differing only by rotation or reflection are the same. How many are there?",
    figure: {
      src: "/questions/2026/q25.png",
      altZh: "等边三角形 ABC 内接一个阴影等角六边形，六边长按图标为 2、3、1、3、2、2。",
      altEn: "An equilateral triangle ABC containing a shaded equiangular hexagon with side lengths 2, 3, 1, 3, 2, and 2.",
    },
    options: numericOptions(["4", "5", "6", "7", "8"]),
    answer: "E",
    solutionZh: [
      "由图可知等边三角形边长为 6。设三角形三个角处被截下的小段长度为正整数 x、y、z，则六边形另外三边分别为 6 - x - y、6 - y - z、6 - z - x。",
      "所有边均为正整数，等价于 x、y、z 为正整数且每两个数之和都小于 6。考虑旋转和翻转，只需取 x ≤ y ≤ z 且 y + z < 6。",
      "可行三元组为 (1,1,1)、(1,1,2)、(1,1,3)、(1,1,4)、(1,2,2)、(1,2,3)、(2,2,2)、(2,2,3)，共 8 种。",
    ],
    solutionEn: [
      "Let x, y, z be the positive integer corner lengths of the side-6 equilateral triangle. The other three hexagon sides are 6 - x - y, 6 - y - z, and 6 - z - x.",
      "Up to rotation and reflection, count x ≤ y ≤ z with y + z < 6. There are 8 valid triples.",
    ],
    sourceUrl: "https://live.poshenloh.com/past-contests/amc8/2026",
  },
  ...questions2025,
  ...questions2024,
  ...questions2023,
  ...questions2022,
  ...questions2020,
  ...questions2019,
  ...questions2018,
];

export const questionsByNewest = [...questions].sort(
  (a, b) => b.year - a.year || a.number - b.number,
);

export function getQuestion(year: number, number: number) {
  return questions.find(
    (question) => question.year === year && question.number === number,
  );
}

export function getYearQuestions(year: number) {
  return questions
    .filter((question) => question.year === year)
    .sort((a, b) => a.number - b.number);
}

export const availableYears = Array.from(
  new Set(questions.map((question) => question.year)),
).sort((left, right) => right - left);

export const topicLabels: Topic[] = [
  "算术",
  "数论",
  "代数",
  "几何",
  "计数与组合",
  "概率",
  "数据与统计",
];

export const formatLabels = Array.from(
  new Set(questions.flatMap((question) => question.formats)),
).sort((left, right) => left.localeCompare(right, "zh-CN"));
