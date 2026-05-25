import { useEffect, useState } from "react";
import axios from "axios";

type WorkLog = {
  id: number;
  date: string;
  workType: string;
  volume: number;
  unit: string;
  workerName: string;
};

function App() {
  const [logs, setLogs] = useState<WorkLog[]>([]);

  const [editingId, setEditingId] = useState<number | null>(null);

  const [form, setForm] = useState({
    date: "",
    workType: "",
    volume: "",
    unit: "",
    workerName: "",
  });

  useEffect(() => {
    loadLogs();
  }, []);

  async function loadLogs() {
    const response = await axios.get("http://localhost:3000/logs");

    setLogs(response.data);
  }

  async function createLog() {
    if (
      !form.date ||
      !form.workType ||
      !form.volume ||
      !form.unit ||
      !form.workerName
    ) {
      return;
    }

    if (editingId) {
      await axios.put(
        `http://localhost:3000/logs/${editingId}`,
        {
          ...form,
          volume: Number(form.volume),
        }
      );

      setEditingId(null);
    } else {
      await axios.post("http://localhost:3000/logs", {
        ...form,
        volume: Number(form.volume),
      });
    }

    setForm({
      date: "",
      workType: "",
      volume: "",
      unit: "",
      workerName: "",
    });

    loadLogs();
  }

  async function deleteLog(id: number) {
    await axios.delete(`http://localhost:3000/logs/${id}`);

    loadLogs();
  }

  function editLog(log: WorkLog) {
    setEditingId(log.id);

    setForm({
      date: log.date.slice(0, 10),
      workType: log.workType,
      volume: String(log.volume),
      unit: log.unit,
      workerName: log.workerName,
    });
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">
          Construction Log
        </h1>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-10">
          <h2 className="text-2xl font-semibold mb-5">
            {editingId
              ? "Редактировать запись"
              : "Добавить запись"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="date"
              className="bg-zinc-800 border border-zinc-700 rounded-xl p-3"
              value={form.date}
              onChange={(e) =>
                setForm({ ...form, date: e.target.value })
              }
            />

            <input
              className="bg-zinc-800 border border-zinc-700 rounded-xl p-3"
              placeholder="Тип работы"
              value={form.workType}
              onChange={(e) =>
                setForm({
                  ...form,
                  workType: e.target.value,
                })
              }
            />

            <input
              className="bg-zinc-800 border border-zinc-700 rounded-xl p-3"
              placeholder="Объем"
              value={form.volume}
              onChange={(e) =>
                setForm({
                  ...form,
                  volume: e.target.value,
                })
              }
            />

            <input
              className="bg-zinc-800 border border-zinc-700 rounded-xl p-3"
              placeholder="Единица"
              value={form.unit}
              onChange={(e) =>
                setForm({
                  ...form,
                  unit: e.target.value,
                })
              }
            />

            <input
              className="bg-zinc-800 border border-zinc-700 rounded-xl p-3 md:col-span-2"
              placeholder="Работник"
              value={form.workerName}
              onChange={(e) =>
                setForm({
                  ...form,
                  workerName: e.target.value,
                })
              }
            />
          </div>

          <button
            onClick={createLog}
            className="mt-5 bg-white text-black px-5 py-3 rounded-xl font-semibold hover:opacity-80 transition"
          >
            {editingId
              ? "Сохранить изменения"
              : "Создать запись"}
          </button>
        </div>

        <div className="grid gap-5">
  {logs.length === 0 ? (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-10 text-center text-zinc-400">
      Нет записей
    </div>
  ) : (
    logs.map((log) => (
      <div
        key={log.id}
        className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5"
      >
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-2xl font-semibold mb-3">
              {log.workType}
            </h3>

            <div className="space-y-1 text-zinc-300">
              <p>
                <span className="text-white">
                  Объем:
                </span>{" "}
                {log.volume} {log.unit}
              </p>

              <p>
                <span className="text-white">
                  Работник:
                </span>{" "}
                {log.workerName}
              </p>

              <p>
                <span className="text-white">
                  Дата:
                </span>{" "}
                {new Date(log.date).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => editLog(log)}
              className="bg-blue-500 hover:bg-blue-600 transition px-4 py-2 rounded-xl"
            >
              Редактировать
            </button>

            <button
              onClick={() => deleteLog(log.id)}
              className="bg-red-500 hover:bg-red-600 transition px-4 py-2 rounded-xl"
            >
              Удалить
            </button>
          </div>
        </div>
      </div>
    ))
  )}
</div>
      </div>
    </div>
  );
}

export default App;