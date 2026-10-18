import { prisma } from "@/lib/prisma";
import { courseModules } from "@/config/courseModules";
import { getCollectionModule, hasBunnyApiKey, type BunnyModule, type BunnyVideo } from "@/lib/bunny";

export type ModuleProgress = BunnyModule & { done: number };
export type NextVideo = BunnyVideo & { moduleTitle: string };
export type CourseProgress = {
  modules: ModuleProgress[];
  total: number;
  done: number;
  percent: number;
  completedIds: Set<string>;
  nextVideo: NextVideo | null;
  loadError: boolean;
};

// The modules (Bunny collections) configured for a course.
export const loadCourseModules = async (slug: string) => {
  const configured = courseModules[slug] ?? [];
  if (!configured.length || !hasBunnyApiKey()) return { modules: [] as BunnyModule[], loadError: false };
  try {
    const modules = await Promise.all(configured.map((m) => getCollectionModule(m.collectionId, m.title)));
    return { modules, loadError: false };
  } catch {
    return { modules: [] as BunnyModule[], loadError: true };
  }
};

// Modules + what this student has completed + the next lesson to watch.
export const getCourseProgress = async (userId: string, courseId: string, slug: string): Promise<CourseProgress> => {
  const [{ modules, loadError }, records] = await Promise.all([
    loadCourseModules(slug),
    prisma.lessonProgress.findMany({ where: { userId, courseId }, select: { videoId: true } }),
  ]);

  const completedIds = new Set(records.map((r) => r.videoId));
  const withProgress: ModuleProgress[] = modules.map((m) => ({
    ...m,
    done: m.videos.filter((v) => completedIds.has(v.id)).length,
  }));

  const total = modules.reduce((sum, m) => sum + m.videos.length, 0);
  const done = withProgress.reduce((sum, m) => sum + m.done, 0);

  let nextVideo: NextVideo | null = null;
  for (const m of modules) {
    const v = m.videos.find((x) => !completedIds.has(x.id));
    if (v) {
      nextVideo = { ...v, moduleTitle: m.title };
      break;
    }
  }

  return {
    modules: withProgress,
    total,
    done,
    percent: total ? Math.round((done / total) * 100) : 0,
    completedIds,
    nextVideo,
    loadError,
  };
};
