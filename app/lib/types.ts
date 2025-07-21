export interface Review {
  id?: number;
  schoolId: number;
  name: string;
  role: string;
  biaya: string;
  komentar: string;
  tanggal?: Date;
  kenyamanan: number;
  pembelajaran: number;
  fasilitas: number;
  kepemimpinan: number;
}

export interface School {
  id: number;
  name: string;
  status: string;
  npsn: string;
  bentuk: string;
  telp: string;
  alamat: string;
  kelurahan: string;
  kecamatan: string;
  lat?: number;
  lng?: number;
  description?: string;
  programs?: string;
  achievements?: string;
  website?: string;
  contact?: string;
}

export interface ReviewFormToggleProps {
  schoolId: number;
  onSubmit?: () => void;
  biayaOptions?: Array<{ value: string; label: string }>;
  editing?: Review | null;
  onCancel?: () => void;
}