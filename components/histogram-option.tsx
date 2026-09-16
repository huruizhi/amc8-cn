import type { QuestionOption } from "@/lib/content/questions";

export function HistogramOption({ option }: { option: QuestionOption }) {
  if (!option.histogram) return null;

  return (
    <div
      className="ml-9 w-full max-w-[270px] rounded-xl border border-border bg-white px-3 pb-2 pt-3"
      role="img"
      aria-label={`${option.label} 选项：余数 0 到 6 的出现次数依次为 ${option.histogram.join("、")}`}
    >
      <div className="flex h-24 items-end gap-1 border-b border-l border-ink/70 pl-1">
        {option.histogram.map((height, remainder) => (
          <div key={remainder} className="flex h-full flex-1 flex-col justify-end gap-1">
            <span className="text-center text-[10px] font-semibold text-ink">{height}</span>
            <span
              className={`w-full rounded-t-sm ${remainder % 2 === 0 ? "bg-primary/45" : "bg-primary/85"}`}
              style={{ height: `${height * 16}px` }}
            />
          </div>
        ))}
      </div>
      <div className="ml-1 mt-1 grid grid-cols-7 gap-1 text-center text-[10px] text-muted-foreground">
        {[0, 1, 2, 3, 4, 5, 6].map((remainder) => (
          <span key={remainder}>{remainder}</span>
        ))}
      </div>
      <p className="mt-1 text-center text-[10px] text-muted-foreground">余数</p>
    </div>
  );
}
