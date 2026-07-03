import { ImageResponse } from "next/og";

export const runtime = "edge";
export const dynamic = "force-static";

const size = {
  width: 1024,
  height: 1024,
};

function LogoImage() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #34d399, #059669)",
        color: "#ffffff",
        fontSize: 580,
        fontWeight: 900,
        fontFamily: "Arial, sans-serif",
        borderRadius: "50%",
        lineHeight: 1,
        letterSpacing: -45,
      }}
    >
      QA
    </div>
  );
}

export async function GET() {
  return new ImageResponse(<LogoImage />, {
    ...size,
    headers: {
      "Content-Type": "image/png",
      "Content-Disposition": 'attachment; filename="qahacks-logo-1024.png"',
    },
  });
}