// Maps each course slug to its Bunny Stream collections.
// Each collection = one module. Videos inside it = the lessons.
// "title" is optional: if you leave it out, the collection's name from Bunny is used.

export type CourseSection = "IMUCET Preparation" | "Sponsorship Preparation";
export type CourseModule = { collectionId: string; title?: string; section: CourseSection };

export const courseModules: Record<string, CourseModule[]> = {
  "complete-imucet-preparation": [
    { collectionId: "1bdc80d8-4273-497d-80df-000d052e9115", title: "Module 1: ENGLISH IMUCET", section: "IMUCET Preparation" },

    { collectionId: "4e9f15d0-d4b5-44b1-9573-508a7dff184d", title: "Module 2: GENERAL APTITUDE IMUCET", section: "IMUCET Preparation" },
    { collectionId: "7147a737-8db3-4736-8f58-dcc4e93354af", title: "Module 3: GEOGRAPHY IMUCET", section: "IMUCET Preparation" },
    { collectionId: "40db952d-5d21-4ff2-bc9c-a3a23f0d408a", title: "Module 4: CHEMISTRY IMUCET", section: "IMUCET Preparation" },
    { collectionId: "e6468c7d-af6d-42eb-a013-73868cf9d91b", title: "Module 5: MATHS IMUCET", section: "IMUCET Preparation" },
    { collectionId: "e1c4f3d7-02b0-4daf-99f1-fd48c1bb09a7", title: "Module 6: PHYSICS IMUCET", section: "IMUCET Preparation" },
    { collectionId: "cef74b65-e697-4e78-b1aa-9f2589275978", title: "Module 7: GENERAL KNOWLEDGE IMUCET", section: "IMUCET Preparation" },
    { collectionId: "102c84c6-bbb2-49db-8100-c070a7db76a7", title: "Module 8: Interview Basics", section: "Sponsorship Preparation" },
    { collectionId: "bda44eb2-b15c-46e7-a501-cf037fdf62a9", title: "Module 9: SHIP KNOWLEDGE SPONSORSHIP", section: "Sponsorship Preparation" },
    { collectionId: "04e03d31-9d2b-4df6-add3-5c0c3ee2f299", title: "Module 10: SHIP KNOWLEDGE SPONSORSHIP", section: "Sponsorship Preparation" },
    

  ],
  "imucet-interview-preparation": [
    { collectionId: "102c84c6-bbb2-49db-8100-c070a7db76a7", title: "Module 1: Interview Basics", section: "Sponsorship Preparation" },
    { collectionId: "bda44eb2-b15c-46e7-a501-cf037fdf62a9", title: "Module 2: SHIP KNOWLEDGE SPONSORSHIP", section: "Sponsorship Preparation" },
    { collectionId: "04e03d31-9d2b-4df6-add3-5c0c3ee2f299", title: "Module 3: SHIP KNOWLEDGE SPONSORSHIP", section: "Sponsorship Preparation" },
  ],
};