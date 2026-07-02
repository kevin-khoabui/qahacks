import { ImageResponse } from "next/og";

export const dynamic = "force-static";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(to bottom right, #34d399, #059669)",
          color: "white",
          fontSize: 480,
          fontWeight: 900,
          fontFamily: "Arial, sans-serif",
          borderRadius: "50%",
          lineHeight: 1,
        }}
      >
        QA
      </div>
    ),
    {
      width: 1024,
      height: 1024,
    }
  );
}