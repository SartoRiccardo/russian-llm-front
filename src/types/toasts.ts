
import type { JSX } from "react";

export type ToastType = "SUCCESS" | "ERROR" | "WARNING";

export interface IToast {
  id: string;
  type: ToastType;
  title: string | JSX.Element;
  content: string | JSX.Element;
  duration: number;
  dataCy?: string;
}

export interface IToastContext {
    createToast: (options: Partial<IToast>) => string;
}
