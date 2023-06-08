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

Admin:

1. GET All User
2. GET Log Payment Model

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

1. 3rd Party API : HereAPI, ipaymu
2. Payment Model : 5% dari DP untuk setiap reservasi yang diterima
3. Upload File : Customer perlu upload KTP untuk mendaftar
