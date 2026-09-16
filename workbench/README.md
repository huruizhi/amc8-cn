# AMC 8 内容工作台

这个目录只用于本地整理真题，不会作为学习站页面发布。

当前流程：

1. 从年度真题 PDF 渲染包含图形的页面。
2. 按 `diagram-crops.json` 中经过人工核对的坐标裁出题目图形。
3. 将成品写入 `public/questions/<year>/`，并为网站题目补充中英文替代文本。
4. 对照年度答案和解析 PDF 检查选项、答案与推导，再把内容标记为已发布。

运行：

```bash
python3 workbench/render_diagrams.py
```

需要 Python、Pillow 与 Poppler 的 `pdftoppm`。源资料目录不同或 `pdftoppm` 不在 PATH 中时，可使用 `--source-root` 和 `--pdftoppm` 指定路径。

裁图配置记录源 PDF 页码和像素边界，便于后续重做，而不是手工覆盖成品图。
