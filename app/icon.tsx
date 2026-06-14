import { ImageResponse } from "next/og";
export const dynamic = "force-static";

// Cấu hình kích thước chuẩn cho Favicon
export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

// Hàm tự động render chữ thành Favicon
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 18,
          background: "linear-gradient(to bottom right, #34d399, #059669)", // Màu xanh Emerald cực hợp với header tối của bạn
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontWeight: "black",
          fontFamily: "sans-serif",
          borderRadius: "8px", // Bo tròn góc cho hiện đại giống ứng dụng di động
        }}
      >
        QA
      </div>
    ),
    {
      ...size,
    }
  );
}