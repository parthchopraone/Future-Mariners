import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import BackLink from "@/components/ui/backLink";
import { authOptions } from "@/lib/auth";
import { getBunnyStorageFiles, type BunnyNotesCourse } from "@/lib/bunnyStorage";

const courseDetails: Record<BunnyNotesCourse, { title: string; description: string }> = {
  imucet: {
    title: "IMUCET notes and PDFs",
    description: "Study notes for the Complete IMUCET + Sponsorship Preparation course.",
  },
  sponsorship: {
    title: "Sponsorship notes and PDFs",
    description: "Study notes for the Complete Sponsorship Preparation course from Bunny Storage zone 1973756.",
  },
};

const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const NotesPage = async ({ params }: { params: Promise<{ course: string }> }) => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const { course } = await params;
  if (!(course in courseDetails)) notFound();
  const notesCourse = course as BunnyNotesCourse;
  let storage;
  let loadError = false;
  try {
    storage = await getBunnyStorageFiles(notesCourse);
  } catch {
    loadError = true;
    storage = { files: [], configured: true };
  }

  return (
    <main className="min-h-[calc(100vh-80px)] bg-[#f7f8fa] text-[#17233d]">
      <section className="border-b border-[#e7eaf0] bg-white">
        <div className="container py-8 sm:py-12">
          <BackLink href="/dashboard">Back to dashboard</BackLink>
          <p className="mt-8 text-xs font-bold tracking-[0.2em] text-[#bd8014] uppercase">Study resources</p>
          <h1 className="mt-3 font-mulish text-4xl font-bold sm:text-5xl">{courseDetails[notesCourse].title}</h1>
          <p className="mt-4 max-w-2xl leading-7 text-[#526176]">{courseDetails[notesCourse].description}</p>
        </div>
      </section>
      <section className="container py-8 sm:py-12">
        {!storage.configured ? (
          <div className="rounded-xl border border-[#f0b429] bg-[#fff8e6] p-6 text-[#6d5200]">Notes storage is not configured.</div>
        ) : loadError ? (
          <div className="rounded-xl border border-[#e2b4b4] bg-[#fff5f5] p-6 text-[#8b3030]">We could not load these notes right now. Please try again in a minute.</div>
        ) : storage.files.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {storage.files.map((file) => (
              <article key={file.path} className="rounded-xl border border-[#e3e6ec] bg-white p-5 shadow-sm">
                <div className="flex items-start gap-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-[#ede9fe] text-xl" aria-hidden>PDF</span>
                  <div className="min-w-0">
                    <h2 className="wrap-break-word font-mulish font-bold">{file.name}</h2>
                    <p className="mt-1 wrap-break-word text-xs text-[#687286]">{file.path}</p>
                    <p className="mt-2 text-xs text-[#687286]">{formatSize(file.size)}</p>
                  </div>
                </div>
                <a href={file.url ?? "#"} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex rounded-md bg-[#7d52f4] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#936ff7]">
                  Open file →
                </a>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-[#cfd5df] bg-white p-8 text-center">
            <h2 className="font-mulish text-2xl font-bold">No notes found</h2>
            <p className="mt-2 text-[#687286]">Upload PDFs to the {notesCourse === "imucet" ? "IMUCET" : "SPONSORSHIP"} folder and refresh this page.</p>
          </div>
        )}
      </section>
    </main>
  );
};

export default NotesPage;
