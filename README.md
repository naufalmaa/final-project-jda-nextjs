## JDA Next.JS Project

Ini adalah project yang akan dikerjakan untuk Tugas Besar Jabar Digital Academy (JDA) untuk program Fullstack Developer.

### Rekap Tugas:

#### Tugas Pertemuan Pertama ✅

1. Install Sebuah Project Next JS ✔

2. Pastikan Project nya berjalan dengan baik ✔

3. Push Project tersebut ke Github ✔

4. Kirimkan link repository project Next Js nya ke LMS ✔

#### Tugas Pertemuan Kedua ✅

1. Silakan gunakan project Next.js yang sudah kalian buat di tugas pertemuan 1 atau boleh juga install project Next.js baru. ✔

2. Buat Minimal 2 Halaman Statis - di folder /app/dashboard/... ✔

3. Buat Halaman Not Found (404) - terdapat di /app/not-found.tsx ✔

4. Buat Minimal 1 Halaman Dynamic Route - terdapat di /app/dashboard/school/[id] ✔

(Contoh: /products/1, /products/2, dll. )

5. Tambahkan Navigasi Antar Halaman - terdapat di /app/ui/dashboard/sidenav.tsx ✔

6. Pengumpulan ✔

### Tugas Pertemuan Keempat ✅

1. Buat endpoint API di /api/products atau endpoint lain sesuai kebutuhan aplikasi yang kamu buat, dengan sistem CRUD yang meliputi:  -> sudah terdapat dua api untuk CRUD statis: api/reviews dan api/school. ✔

- Mengambil semua data

- Menambahkan data baru

- Mengupdate data

- Menghapus data

Data disimpan di array static (seperti contoh users pada kelas pertemuan ke-4).

Structure data untuk product: { id, name, price } atau sesuai field yang relevan dengan resource-mu.

2. Buat halaman /products atau halaman lain yang terkait dengan resource API-mu, yang memiliki fitur:  -> list data sudah bisa ditampilkan di page yang sama: dashboard/review dan dashboard/school. ✔

- Menampilkan list data

- Menambahkan data baru

- Mengupdate data

- Menghapus data

3. Pengumpulan ✔

### Tugas Pertemuan Kelima ✅

1. Buatlah sebuah aplikasi CRUD sederhana menggunakan Next.js yang terhubung dengan database. -> database tersimpan di neon dengan menggunakan data sekolah dasar daerah Bandung (terdapat di /dashboard/school ✔)

2. Aplikasi harus memiliki CRUD lengkap, yaitu: (dapat dicheck di /dashboard/school ✔)

- Create (menambahkan data baru)

- Read (menampilkan data)

- Update (mengedit data)

- Delete (menghapus data)

3. Pastikan data tersimpan di database bukan di local atau di variable statis. -> database tersimpan di neon dengan menggunakan data sekolah dasar daerah Bandung (terdapat di /dashboard/school ✔)

4. Pengumpulan: ✔

note: untuk review masih dalam pengerjaan (saat ini, baru database sekolah)

### Tugas Pertemuan Keenam ✅

Tujuan Tugas:

Memahami konsep state management global dengan Redux
Melatih kemampuan mengakses dan memodifikasi state di berbagai komponen
Mengasah pemahaman komunikasi data antar komponen melalui store


Deskripsi Tugas

Buatlah aplikasi sederhana dengan bebas tema yang memiliki ketentuan berikut: -> Redux sudah dipakai untuk dashboard/school/[id], dengan menampilkan Redux untuk kategori Sekolah dan Review! (terdapat di /dashboard/school) ✔

Ketentuan Utama:

Gunakan Redux sebagai state management global.
Memiliki minimal 2 komponen berbeda yang:
Mengakses state global menggunakan useSelector
Mengubah state global menggunakan useDispatch
Komponen A melakukan update atau menambahkan data ke store.
Komponen B membaca data tersebut dan menampilkannya di UI.

