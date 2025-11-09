export type Theme = "pv" | "itefr" | "pacfr";
export type Visible = "mobile" | "tablet" | "desktop";
export type Logo = { 
    name: string; 
    file: any; 
    className?: string; 
    visibleAbove?: Visible;
};