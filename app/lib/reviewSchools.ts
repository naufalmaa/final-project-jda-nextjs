export type Review = {
  id: number;
  schoolId: number;
  reviewer: {
    name: string;
    role: "Alumni" | "Orang Tua Murid" | "Guru" | "Aktivis Pendidikan";
  };
  ratings: {
    kenyamanan: number; // 1–5
    pembelajaran: number;
    biaya: number;
    fasilitas: number;
    kepemimpinan: number;
  };
  komentar: string;
  tanggal: string;
};
