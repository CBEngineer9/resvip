# resvip

WEB SERVICE Sistem Reservasi Restoran

Kelompok :

1. Acxel Derian Afandi - 220116900
2. Alexander Kevin - 220116902
3. Cherilyn Eugenia - 220116908
4. Jonathan Kenzie Limantara - 220116922

Deskripsi Program:
Webservice ini menyediakan platform untuk reservasi restoran.
Hanya terdapat developer pada sistem ini. Developer travel agent dapat menggunakan fitur-fitur untuk reservasi customer sedangkan developer restoran dapat menggunakan fitur-fitur untuk membuat slot reservasi dan menerima reservasi.

Pengembangan dari web service ini :

- Website travel dan rekomendasi restoran dapat menggunakan web service ini untuk melakukan reservasi dan kontak secara langsung dengan pihak restaurant
- Website restaurant. Fungsi reservasi di dalam sistem website restaurant dapat memanfaatkan web service ini untuk menangani reservasi dari berbagai customer.

Daftar Fitur :
Umum

1. POST Register
2. POST Login

Developer (fitur utk travel agent)

1. GET All Restoran + Filter (Cuisine, Price Range, Nearby)
2. GET Restoran by ID
3. GET All Cuisine
4. POST Reservasi
5. GET Status Reservasi
6. GET History Reservasi
7. DELETE Cancel Reservasi
8. PUT Reschedule Reservasi
9. POST Bayar DP Reservasi

Developer (fitur utk restoran)

1. POST Insert Slot Reservasi
2. PUT Update Slot Reservasi
3. DELETE Delete Slot Reservasi
4. GET All Reservasi + Filter by Date
5. GET Reservasi by ID
6. POST Acc/Tolak Reservasi
7. PUT Update Data Restoran
8. POST Acc/Tolak Reschedule

Syarat Proyek :

1. 3rd Party API : HereAPI, midtrans
2. Payment Model : 5% dari DP untuk setiap reservasi yang diterima
3. Upload File : Customer perlu upload KTP untuk mendaftar

## Pembagian Tugas
Acxel : 
1. POST table (Restaurant)
2. GET table
3. PUT updateTable
4. DELETE table
5. PUT update reservation
6. External API midtrans & implementasi pada enpoint addReservation (seeker)

Kevin:
1. Setup Project structure
2. External API hereAPI & implementasi pada endpoint Register dan getRestaurant (Seeker)
3. GET slot (Restoran)
4. POST slot (Restoran)
5. PUT slot (Restoran)
6. DELETE slot (Restoran)
7. GET getValidAddress
8. GET fetchRestaurant (seeker)
9. GET getRestaurant (seeker)
10. Membuat migration
11. Setup hosting, deployment github workflow

Cherilyn:
1. POST Register
2. POST Login
3. POST Reservasi
4. PUT Reschedule Reservasi
5. GET History Reservasi (Seeker)
6. GET Reservasi by id (Seeker)
7. GET All Reservasi + Filter by Date (Restoran)
8. GET Reservasi by id (Restoran)
9. DELETE Cancel reservasi
10. Middleware Auth + Role
11. Membuat seeder

## Dokumentasi API
Dokumentasi API Resvip dapat anda lihat via postman di <a href='https://documenter.getpostman.com/view/27473843/2s93z58izD'> sini</a>

## Hosted Service
Resvip bisa anda coba live pada endpoint <a href='https://resvip.glitch.me/'>https://resvip.glitch.me/</a>