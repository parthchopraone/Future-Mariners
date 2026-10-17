// Maps each course slug to its Bunny Stream collections.
// Each collection = one module. Videos inside it = the lessons.
// "title" is optional: if you leave it out, the collection's name from Bunny is used.

export type CourseModule = { collectionId: string; title?: string };

export const courseModules: Record<string, CourseModule[]> = {
  "complete-imucet-preparation": [
    { collectionId: "1bdc80d8-4273-497d-80df-000d052e9115", title: "Module 1: ENGLISH IMUCET" },
    { collectionId: "7147a737-8db3-4736-8f58-dcc4e93354af", title: "Module 2: GEOGRAPHY IMUCET" },
    { collectionId: "40db952d-5d21-4ff2-bc9c-a3a23f0d408a", title: "Module 1: CHEMISTRY IMUCET" },
    { collectionId: "e6468c7d-af6d-42eb-a013-73868cf9d91b", title: "Module 1: MATHS IMUCET" },
    { collectionId: "e1c4f3d7-02b0-4daf-99f1-fd48c1bb09a7", title: "Module 1: PHYSICS IMUCET" },
    
    { collectionId: "cef74b65-e697-4e78-b1aa-9f2589275978", title: "Module 1: PHYSICS IMUCET" },

  ],
  "imucet-interview-preparation": [
    { collectionId: "102c84c6-bbb2-49db-8100-c070a7db76a7", title: "Module 1: Interview Basics" },
    { collectionId: "bda44eb2-b15c-46e7-a501-cf037fdf62a9", title: "Module 2: SHIP KNOWLEDGE SPONSORSHIP" },
    { collectionId: "04e03d31-9d2b-4df6-add3-5c0c3ee2f299", title: "Module 2: SHIP KNOWLEDGE SPONSORSHIP" },
  ],
};