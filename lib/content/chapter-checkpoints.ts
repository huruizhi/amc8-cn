import type { LessonExercise, LessonOption } from "./lessons";

const option = (label: LessonOption["label"], value: string): LessonOption => ({ label, value });

const exercise = (
  id: string,
  prompt: string,
  values: string[],
  answer: LessonOption["label"],
  explanation: string,
): LessonExercise => ({
  id,
  prompt,
  options: values.map((value, index) => option((["A", "B", "C", "D"] as const)[index], value)),
  answer,
  explanation,
  level: "提升",
});

export const chapterCheckpoints: Record<string, LessonExercise[]> = {
  "order-estimation": [
    exercise("checkpoint-order-1", "按正确顺序计算：18 - 2 × (3 + 4) =？", ["4", "14", "28", "112"], "A", "先算括号得 7，再算乘法得 14，最后 18 - 14 = 4。"),
    exercise("checkpoint-order-2", "小明估算 49 × 21 约为 100，最可能错在哪里？", ["估算的数量级太小", "把乘法看成加法", "没有写单位", "无法判断"], "A", "49 × 21 接近 50 × 20 = 1000，不应约为 100。"),
    exercise("checkpoint-order-3", "某数加 28 得 103。用逆运算检查，该数是多少？", ["65", "75", "85", "131"], "B", "103 - 28 = 75。"),
  ],
  exponents: [
    exercise("checkpoint-exponents-1", "2³ + 2² 等于多少？", ["10", "12", "16", "32"], "B", "2³ = 8，2² = 4，和为 12。"),
    exercise("checkpoint-exponents-2", "若 3ⁿ = 81，则 n 等于多少？", ["2", "3", "4", "5"], "C", "81 = 3 × 3 × 3 × 3 = 3⁴。"),
    exercise("checkpoint-exponents-3", "边长扩大为原来的 2 倍，正方形面积扩大为原来的多少倍？", ["2", "3", "4", "8"], "C", "面积与边长的平方成正比，2² = 4。"),
  ],
  "number-theory": [
    exercise("checkpoint-number-theory-1", "同时是 3 和 5 的倍数的最小正整数是多少？", ["8", "10", "15", "30"], "C", "3 和 5 互质，最小公倍数是 3 × 5 = 15。"),
    exercise("checkpoint-number-theory-2", "一个数除以 6 余 4，下面哪个数可能是它？", ["16", "18", "20", "24"], "A", "16 = 6 × 2 + 4，余数是 4。"),
    exercise("checkpoint-number-theory-3", "1 到 50 中既不是 2 的倍数也不是 5 的倍数的数共有多少个？", ["15", "20", "25", "30"], "B", "50 中去掉 25 个偶数和 10 个 5 的倍数，再加回 5 个 10 的倍数：50 - 25 - 10 + 5 = 20。"),
  ],
  fractions: [
    exercise("checkpoint-fractions-1", "一个数的 3/5 是 18，这个数是多少？", ["10", "24", "30", "45"], "C", "整体 = 18 ÷ 3/5 = 18 × 5/3 = 30。"),
    exercise("checkpoint-fractions-2", "1/2、3/8、5/12 中最大的是哪个？", ["1/2", "3/8", "5/12", "一样大"], "A", "通分为 24 后分别是 12/24、9/24、10/24，最大是 1/2。"),
    exercise("checkpoint-fractions-3", "一条绳子先用去 2/5，再用去剩下部分的 1/3，还剩全长的几分之几？", ["1/5", "2/5", "3/5", "4/5"], "B", "先剩 3/5，再剩下 3/5 × 2/3 = 2/5。"),
  ],
  algebra: [
    exercise("checkpoint-algebra-1", "方程 3x - 4 = 17 的解是多少？", ["5", "6", "7", "8"], "C", "两边加 4 得 3x = 21，再除以 3 得 x = 7。"),
    exercise("checkpoint-algebra-2", "一个数的 2 倍不小于 14，用不等式表示是？", ["x > 7", "x ≥ 7", "x < 7", "x ≤ 7"], "B", "2x ≥ 14，两边除以 2 得 x ≥ 7。"),
    exercise("checkpoint-algebra-3", "小华有 x 元，买书花 18 元后还剩 27 元。x 等于多少？", ["9", "35", "45", "486"], "C", "x - 18 = 27，所以 x = 45。"),
  ],
};
