import { getDb } from "@/db";
import { reports } from "@/db/schema";
import { questions } from "@/lib/content/questions";

const REPORT_TYPES = new Set(["翻译", "公式", "图形", "答案", "解析", "分类"]);

function messageFor(error: unknown) {
  const message = error instanceof Error ? error.message : "Unexpected error";
  if (message.includes("no such table") || message.includes("reports")) {
    return "反馈服务正在准备中，请稍后重试。";
  }
  return "反馈暂时无法提交，请稍后重试。";
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as {
      questionId?: string;
      type?: string;
      detail?: string;
    };
    const questionId = payload.questionId?.trim() ?? "";
    const reportType = payload.type?.trim() ?? "";
    const detail = payload.detail?.trim() ?? "";

    if (!questions.some((question) => question.id === questionId)) {
      return Response.json({ error: "题目不存在。" }, { status: 400 });
    }
    if (!REPORT_TYPES.has(reportType)) {
      return Response.json({ error: "问题类型无效。" }, { status: 400 });
    }
    if (!detail || detail.length > 2000) {
      return Response.json(
        { error: "问题说明须为 1 至 2000 个字符。" },
        { status: 400 },
      );
    }

    const report = {
      id: crypto.randomUUID(),
      questionId,
      reportType,
      detail,
    };
    await getDb().insert(reports).values(report);

    return Response.json({ id: report.id, status: "received" }, { status: 201 });
  } catch (error) {
    console.error("Failed to save question report", error);
    return Response.json({ error: messageFor(error) }, { status: 500 });
  }
}
