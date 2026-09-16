import assert from "node:assert/strict";
import test from "node:test";

import {
  exportProgressBackup,
  importProgressBackup,
} from "../lib/domain/progress-backup.js";

test("进度备份可以在另一台设备完整恢复", () => {
  const progress = {
    questions: {
      "2026-01": {
        firstAttempt: {
          answer: "B",
          correct: false,
          submittedAt: "2026-09-16T08:00:00.000Z",
          assisted: false,
        },
        attempts: [],
        viewedAnswerAt: null,
        corrected: false,
      },
    },
  };

  const backup = exportProgressBackup(progress, {
    exportedAt: "2026-09-16T10:00:00.000Z",
  });

  assert.deepEqual(JSON.parse(backup), {
    version: 1,
    exportedAt: "2026-09-16T10:00:00.000Z",
    progress,
  });
  assert.deepEqual(importProgressBackup(backup), progress);
});

test("导入会拒绝未知版本或损坏的学习记录", () => {
  assert.throws(
    () => importProgressBackup('{"version":2,"progress":{"questions":{}}}'),
    /无法识别的备份版本/,
  );
  assert.throws(
    () => importProgressBackup('{"version":1,"progress":{"questions":[]}}'),
    /备份内容无效/,
  );
});
