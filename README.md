# EcoParking
An application that help people find their available parking slot

# Quy chuẩn về code

---

## 1. Về việc sử dụng ngôn ngữ và thay đổi ngôn ngữ

- Tất cả string đều phải đều phải được đặt vào biến static
- Có thể tạo trong ./src/global/constants.js hoặc ./src/helpers/ hoặc một file phù hợp

## 2. Định nghĩa các file dùng chung trong chương trình
- Các hàm tiện ích đặt trong ./src/helpers/
- Các thành phần dùng chung đặt trong ./src/global/

## 3. Quy định về comment

- Các component dùng chung phải có comment giải thích đầu vào cụ thể ( ví dụ: Divider.js)
- Khi viết code vào các file dùng chung thì phải có comment để giải thích việc thêm code đó để làm gì
  và nên viết tên của mình vào comment để biết được ai thêm. Ví dụ: <br/>
  // hieubt: add padding in home screen <br/>
  const paddingHome = 100

## 7. Side effect

## 8. Cấu trúc của project

Các files không phải file cấu hình phải đặt trong src
1.  src/authentication: middleware kiểm tra phiên sử dụng
2.  src/controllers: chứa các functions xử lý logic, kiểm tra đầu vào trước khi chuyển đến repositories
3.  src/database: chứa file cấu hình liên kết đến database
4.  src/exceptions: chứa định nghĩa các ngoại lệ và http response code
5.  src/global: chứa các biến dùng chung
6.  src/helpers: chứa các hàm dùng chung
7.  src.models: chứa các file cấu hình bảng database
8.  src/repositories: chứa các file xử lý tương tác với database
9.  src/routes: chứa các file định nghĩa route cho api

## 9. Về việc cài thêm cái package

Dùng "yarn add" thay cho "npm install"

# Một số lưu ý
Thêm file .env nếu gặp lỗi "pp variables required"
---

