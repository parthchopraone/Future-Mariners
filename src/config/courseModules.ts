// Maps each course slug to its Bunny Stream collections.
// Each collection = one module. Videos inside it = the lessons.
// "title" is optional: if you leave it out, the collection's name from Bunny is used.

export type CourseModule = { collectionId: string; title?: string };

export const courseModules: Record<string, CourseModule[]> = {
  "complete-imucet-preparation": [
    { collectionId: "102c84c6-bbb2-49db-8100-c070a7db76a7", title: "Module 1: Introduction" },

  ],
  "imucet-interview-preparation": [
    { collectionId: "102c84c6-bbb2-49db-8100-c070a7db76a7", title: "Module 1: Interview Basics" },
    { collectionId: "4e9f15d0-d4b5-44b1-9573-508a7dff184d", title: "Module 1: GENERAL APTITUDE IMUCET" },
  ],
};