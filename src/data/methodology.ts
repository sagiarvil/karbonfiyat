export interface MethodPillar {
  step: string;
  title: string;
  description: string;
  badge: string;
}

export const methodologyPillars: MethodPillar[] = [
  {
    step: "01",
    title: "Kaynak ayrımı",
    description: "Resmî, piyasa, tahmin ve senaryo verileri birbirine karıştırılmaz.",
    badge: "KATMAN İZOLASYONU"
  },
  {
    step: "02",
    title: "Tarihsel versiyonlama",
    description: "Her katsayı yürürlük tarihiyle saklanır; geriye dönük hesaplar yeniden üretilebilir.",
    badge: "EFFECTIVE-DATE VERSIONING"
  },
  {
    step: "03",
    title: "Deterministik hesap",
    description: "Aynı veri ve aynı mevzuat sürümü her zaman aynı sonucu üretir. Tanımlı matematik motoru esastır.",
    badge: "DETERMİNİSTİK MOTOR"
  },
  {
    step: "04",
    title: "Audit trail",
    description: "Her hesap kullanılan kaynak ve parametrelerle izlenebilir; denetim zinciri tamdır.",
    badge: "DENETİM ZİNCİRİ"
  }
];
