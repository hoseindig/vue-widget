export interface MenuItem {
    id: string;
    label: Record<string, string>;
    route?: string | null;
    type: string;
    icon?: string;
    disabled?: boolean;
    children?: MenuItem[];
    tooltip?: Record<string, string>;
}


export interface Section {
    id: string;
    label: Record<string, string>;
    description: string;
    items: MenuItem[];
}