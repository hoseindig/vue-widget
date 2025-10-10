import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";

const baseUrl = import.meta.env.VITE_APP_BASE_URL || "";
const widgetName = import.meta.env.VITE_APP_WIDGETNAME || "";
// console.log(bseUrl);

// Mock
import menuData from "../mock/menu.json";
import type { MenuItem, SidebarSection } from "@/types/menu";
import type { Section } from "@/types/form";

// ---- Parsers ----
function parseSettings(settings: any[]) {
  const result: { icon?: string; disabled?: boolean } = {};

  settings.forEach((s) => {
    if (s.key === "icon") {
      result.icon = s.value;
    } else if (s.key === "disabled") {
      result.disabled = s.value === "true";
    }
  });

  return result;
}

function parseMultiLang(arr: any): Record<string, string> {
  const result: Record<string, string> = {};

  if (Array.isArray(arr)) {
    arr.forEach((obj: any) => {
      const [key, value] = Object.entries(obj)[0];
      result[key] = value as string;
    });
  } else if (typeof arr === "object" && arr !== null) {
    Object.entries(arr).forEach(([key, value]) => {
      result[key] = value as string;
    });
  }

  return result;
}

function transformMenu(data: any, lang: string = "fa"): MenuItem[] {
  if (!data) return [];

  return data.children?.map((item: any, idx: number) => {
    const base: MenuItem = {
      id: item.object_id || `item-${idx}`,
      label: parseMultiLang(item.label || []),
      tooltip: item.tooltip ? parseMultiLang(item.tooltip) : undefined,
      route: item.href || null,
      type: item.type,
      children: [],
      ...parseSettings(item.settings || []),
    };

    if (item.children?.length) {
      base.children = transformMenu(item, lang);
    }

    return base;
  });
}

// ---- API Service ----
function extractSessionFromXML(xmlString: string): string {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, "application/xml");

  const session = xmlDoc.getElementsByTagName("session")[0]?.textContent ?? "";

  return session;
}

const api = axios.create({
  baseURL: baseUrl, //"https://3dxlab3.plm.ir/3dspace",
  withCredentials: true,
});

async function loginAndGetSession(): Promise<string | null> {
  try {
    const loginResponse = await api.get(
      "/ticket/login?ticket=RTJCMDdEODkwRjA1NDUxQjkyMzZEMDlBOEVBQkJFQjZ8YWRtaW5fcGxhdGZvcm18YWRtaW5fcGxhdGZvcm18fHwwfA=="
    );

    return extractSessionFromXML(loginResponse.data);
  } catch (err: any) {
    if (err.response?.status === 500) {
      console.warn("Login returned 500 but session might still be valid.");
      return null; // یعنی سشن رو از کوکی یا قبلی بگیریم
    }
    console.error("Login failed:", err);
    throw err;
  }
}

export async function fetchSidebarMenu(
  widgetName: string = "defaultSidebar"
): Promise<any | null> {
  console.log("fetchSidebarMenu for", widgetName);
  try {
    // مرحله ۱: لاگین
    let Session = await loginAndGetSession();

    // اگر لاگین 500 داد، احتمالاً سشن معتبر داریم → تلاش بدون ست کردن دستی
    const { data } = await api.get(
      `/resources/cw/widget/sidebar/${widgetName}`,
      {
        headers: Session ? { Cookie: "JSESSIONID=" + Session } : {}, // اگر Session نداشتیم rely کنیم به کوکی موجود
      }
    );

    console.log("fetchSidebarMenu success", data);
    return data;
  } catch (err) {
    console.error("fetchSidebarMenu failed, using mock menu:", err);
    return null;
  }
}

// async function fetchSidebarMenu(): Promise<any | null> {
//   console.log(window.location.href);
//   try {
//     // Set up axios instance
//     const api = axios.create({
//       baseURL: "https://3dxlab3.plm.ir/3dspace",
//       withCredentials: true,
//     });

//     // // login and store the JSESSIONID cookie
//     const loginResponse = await api.get(
//       "/ticket/login?ticket=RTJCMDdEODkwRjA1NDUxQjkyMzZEMDlBOEVBQkJFQjZ8YWRtaW5fcGxhdGZvcm18YWRtaW5fcGxhdGZvcm18fHwwfA=="
//     );
//     const Session = extractSessionFromXML(loginResponse.data)

//     // Now use the JSESSIONID cookie in the protected request
//     const { data } = await api.get(`/resources/cw/widget/sidebar/${widgetName}`
//       , {
//         headers: {
//           'Cookie': 'JSESSIONID=' + Session, // Send the JSESSIONID cookie
//         },
//       }
//     );

//     console.log('fetchSidebarMenu', data);
//     return data;

//   } catch (err) {
//     console.error("API call failed, using mock menu:", err);
//     return null;
//   }
// }

// ---- Store ----
export const useSidebarStore = defineStore("sidebar", () => {
  const isCollapsed = ref(false);
  const sections = ref<SidebarSection[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  function toggleCollapse() {
    isCollapsed.value = !isCollapsed.value;
  }

  async function loadSections(useMock = false) {
    loading.value = true;
    error.value = null;
    const lang = "fa";

    try {
      let rawData: any = null;
      if (true) {
        //!useMock
        rawData = await fetchSidebarMenu(widgetName);
      }

      const source = rawData || menuData;

      sections.value = [
        {
          id: source.object_id,
          label: parseMultiLang(source.label || []),
          description: "",
          items: transformMenu(source, lang),
        },
      ];
    } catch (e: any) {
      error.value = e.message || "خطا در بارگذاری منو";
    } finally {
      loading.value = false;
    }
  }

  return {
    isCollapsed,
    sections,
    loading,
    error,
    toggleCollapse,
    loadSections,
  };
});
