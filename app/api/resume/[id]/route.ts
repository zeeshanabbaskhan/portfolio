import { Readable } from "stream";
import { NextResponse } from "next/server";
import { getResumeFileById } from "@/app/lib/resumeStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const resume = await getResumeFileById(id);

    if (!resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    const webStream = Readable.toWeb(resume.stream as Readable) as ReadableStream;
    const safeName = resume.title.replace(/[^a-z0-9-_ ]/gi, "").trim() || "resume";
    const { searchParams } = new URL(request.url);
    const shouldDownload = searchParams.get("download") === "1";

    return new NextResponse(webStream, {
      headers: {
        "Content-Type": resume.contentType,
        "Content-Length": String(resume.length),
        "Content-Disposition": `${shouldDownload ? "attachment" : "inline"}; filename="${safeName}.pdf"`,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("[api/resume/[id]] GET failed:", error);
    return NextResponse.json({ error: "Failed to load resume" }, { status: 500 });
  }
}
