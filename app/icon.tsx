import { ImageResponse } from "next/og";

export const dynamic = "force-static";

export const size = {
  width: 32,
  height: 32,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #34d399, #059669)",
          color: "#ffffff",
          fontSize: 18,
          fontWeight: 900,
          fontFamily: "Arial, sans-serif",
          borderRadius: "50%",
          lineHeight: 1,
        }}
      >
        QA
      </div>
    ),
    size
  );
}