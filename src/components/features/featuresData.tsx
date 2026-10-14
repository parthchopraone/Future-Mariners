import {
  CertificateCheckFill,
  ClockFill,
  GraduationHatFill,
} from "@/lib/icons";
import { ReactElement } from "react";

type featureType = {
  id: number;
  icon: ReactElement;
  title: string;
  description: string;
  thumbnail: string;
};
export const featuresData: featureType[] = [
  {
    id: 1,
    icon: <GraduationHatFill />,
    title: "Clear Preparation Route",
    description:
      "Follow a focused route for IMUCET preparation without wasting time on unrelated content.",
    thumbnail: "/images/features/img-1.png",
  },
  {
    id: 2,
    icon: <ClockFill />,
    title: "Learn at Your Pace",
    description:
      "Use recorded lessons, study material, and support around your own school or college schedule.",
    thumbnail: "/images/features/img-2.png",
  },
  {
    id: 3,
    icon: <CertificateCheckFill />,
    title: "Support That Stays Close",
    description:
      "Get doubt support on the website and through your Future Mariners WhatsApp group.",
    thumbnail: "/images/features/img-3.png",
  },
];
