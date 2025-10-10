export interface MenuItem {
  id: string;
  label: Record<string, string>;
  route?: string | null;
  type: string;
  icon?: string;
  children?: MenuItem[];
  tooltip?: Record<string, string>;

  disabled?: boolean;
}

export interface SidebarSection {
  id: string;
  label: Record<string, string>;
  description: string;
  items: MenuItem[];
}
