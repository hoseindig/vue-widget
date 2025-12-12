import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";

// ⚙️ Environment vars
const baseUrl = import.meta.env.VITE_APP_BASE_URL || "";
const widgetName = import.meta.env.VITE_APP_WIDGETNAME || "";

// 🧩 Mock Data (فایل JSON لوکال)
import requestData from "../mock/form.json";

// --------------------------
// 🛰️ API Service
// --------------------------
const api = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});

// export async function fetchRequestData(widgetName: string): Promise<any | null> {
//     try {
//         // const Session = await loginAndGetSession();
//         const { data } = await api.get(`/resources/cw/widget/sidebar/${widgetName}`, {
//             headers: Session ? { Cookie: "JSESSIONID=" + Session } : {},
//         });
//         return data;
//     } catch (err) {
//         console.error("API fetch failed, using mock data:", err);
//         return null;
//     }
// }

// --------------------------
// 🧠 Helper: add "value" to all fields
// --------------------------
function addValueToAllFields1(obj: any): void {
  if (Array.isArray(obj)) {
    obj.forEach(addValueToAllFields);
  } else if (obj && typeof obj === "object") {
    if (Array.isArray(obj.fields)) {
      obj.fields.forEach((field: any) => {
        if (!field.data) {
          debugger
          field.data = {};
        }
        if (typeof field.data === "object" && !("value" in field.data)) {
          field.data.value = null;
        }
      });
    }
    // ادامه‌ی جستجو در بقیه‌ی کلیدها
    Object.values(obj).forEach(addValueToAllFields);
  }
}

function addValueToAllFields(obj: any): void {

  if (Array.isArray(obj)) {
    obj.forEach(addValueToAllFields);
    return;
  }

  if (!obj || typeof obj !== "object") {
    return;
  }

  // فقط زمانی که type === FIELD باشد
  if (obj.type === "FIELD") {

    // اگر data وجود نداشت، بساز
    if (!obj.data) obj.data = {};

    // اگر data.value وجود نداشت، مقدار null فقط زمانی بده که type=none نباشد
    if (!("value" in obj.data) && obj.data.type !== "none") {
      obj.data.value = null;
    }

    // اگر input وجود دارد ولی config ندارد → خودش بسازد
    if (obj.input) {
      if (!obj.input.config) obj.input.config = {};

      // اگر فیلد قابلیت defaultValue دارد
      const allowedTypes = [
        "text_box",
        "text_area",
        "list_box",
        "radio_list",
        "check_box",
        "combo_box"
      ];

      if (allowedTypes.includes(obj.input.type)) {
        if (!("defaultValue" in obj.input.config)) {
          obj.input.config.defaultValue = null;
        }
      }
    }
  }

  // ادامه جستجو در بقیه کلیدها
  Object.values(obj).forEach(addValueToAllFields);
}

// --------------------------
// 🏪 Store Definition
// --------------------------
export const useFormStore = defineStore("request", () => {
  const loading = ref(false);
  const error = ref<string | null>(null);
  const items = ref<any[]>([]);
  const selectedItem = ref<any | null>(null);

  async function loadRequests(useMock = false) {
    loading.value = true;
    error.value = null;
    const lang = "fa";

    try {
      let rawData: any = null;
      // debugger
      if (false) {
        //!useMock
        // rawData = await fetchRequestData(widgetName);
      }
      const source = rawData || requestData;
      // console.log(JSON.parse(JSON.stringify(source)));

      addValueToAllFields(source);

      items.value = source; //transformData(source, lang);
    } catch (e: any) {
      error.value = e.message || "❌ خطا در بارگذاری اطلاعات";
      console.error(e);

    } finally {
      loading.value = false;
    }
  }

  function setSelectedItem(item: any) {
    selectedItem.value = item;
  }

  function clearSelectedItem() {
    selectedItem.value = null;
  }

  return {
    loading,
    error,
    items,
    selectedItem,
    loadRequests,
    setSelectedItem,
    clearSelectedItem,
  };
});
