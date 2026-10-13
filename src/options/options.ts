import { loadSettings, saveSettings } from "../core/settings";

const key = document.getElementById("apiKey") as HTMLInputElement;
const model = document.getElementById("model") as HTMLInputElement;
const msg = document.getElementById("msg")!;

loadSettings().then((s) => { key.value = s.apiKey; model.value = s.model; });

document.getElementById("save")!.addEventListener("click", async () => {
  await saveSettings({ apiKey: key.value, model: model.value });
  msg.textContent = "Kaydedildi.";
});
