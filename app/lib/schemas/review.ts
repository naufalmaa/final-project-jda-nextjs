import { z } from 'zod';

export const reviewSchema = z.object({
  schoolId: z.number(),
  name: z.string().min(1),
  role: z.enum(['Alumni', 'Orang Tua Murid', 'Guru', 'Aktivis Pendidikan']),
  biaya: z.string(),
  komentar: z.string().optional(),
  kenyamanan: z.number().min(1).max(5),
  pembelajaran: z.number().min(1).max(5),
  fasilitas: z.number().min(1).max(5),
  kepemimpinan: z.number().min(1).max(5),
  tanggal: z.coerce.date().optional(), // default: new Date()
});
