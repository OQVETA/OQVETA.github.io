import { type Language } from "../i18n";

export interface Project {
  name: string;
  description: string;
  url: string;
  icon: string;
  tech: string[];
  status: string;
}

export function getProjects(lang: Language): Project[] {
  const ja = lang === "ja";
  return [
    {
      name: ja ? "小さな実験" : lang === "es" ? "Pequeños experimentos" : "Small experiments",
      description: ja
        ? "興味を持ったことを、少しずつ形にしていくための個人的な試み。"
        : lang === "es"
          ? "Pequeños proyectos personales para explorar ideas."
          : "Personal experiments for exploring ideas.",
      url: "/about/",
      icon: "icon-[lucide--flask-conical]",
      tech: [],
      status: ja ? "のんびり更新中" : lang === "es" ? "En progreso" : "In progress",
    },
  ];
}
