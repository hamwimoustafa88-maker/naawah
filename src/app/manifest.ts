import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "النعوة الإلكترونية — مولّد نعوات إسلامية",
    short_name: "النعوة الإلكترونية",
    description:
      "أنشئ نعوة إلكترونية عربية إسلامية وقورة تليق بمقام الفقيد خلال دقائق، وصدّرها PNG أو PDF جاهزة للطباعة والمشاركة.",
    start_url: "/",
    display: "standalone",
    lang: "ar",
    dir: "rtl",
    background_color: "#f7f5f0",
    theme_color: "#12100e",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  }
}
