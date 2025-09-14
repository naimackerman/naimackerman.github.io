import React, { useState } from "react";
import {
  Calendar,
  Building,
  Users,
  GraduationCap,
  ChevronRight,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ImageCarousel } from "./ImageCarousel";

const organizations = [
  {
    id: "dataon",
    name: "DataOn-Humanica",
    type: "work",
    logo: "/images/logo-dataon.png",
    positions: [
      {
        title: "Software Maintenance Staff JR.",
        dates: "Nov 2023 - Apr 2025",
        description:
          "Supported 21 client projects using the company's HRIS application. Resolved approximately 25 software issues per month through debugging, code fixes, and close collaboration with various internal teams. Conducted user training sessions, guiding clients in effectively utilizing the HRIS system’s functionalities.",
        images: [],
      },
    ],
  },
  {
    id: "sisl",
    name: "Stanford Intelligent Systems Laboratory (SISL)",
    type: "work",
    logo: "/images/logo-sisl.png",
    positions: [
      {
        title: "Research Assistant",
        dates: "Oct 2023 - Jan 2024",
        description:
          'Co-authored a paper on "Toward an Integrated Decision-Making Framework for Optimized Stroke Diagnosis with DSA and Treatment under Uncertainty" securing research funding and acceptance at IMIP 2024 conference in Bali.',
        images: [],
      },
    ],
  },
  {
    id: "suitmedia",
    name: "Suitmedia Digital Agency",
    type: "work",
    logo: "/images/logo-suitmedia.png",
    positions: [
      {
        title: "Software Engineer Freelance",
        dates: "Dec 2022 - Oct 2023",
        description:
          "Implemented new features and performed existing features maintenance. Collaborated with account managers and QA teams to deliver high-quality solutions aligned with client requirements. Ensured reliable performance and scalability by optimizing code and conducting regular system reviews.",
        images: [],
      },
      {
        title: "Software Engineer Intern",
        dates: "Jul 2022 - Dec 2022",
        description:
          "Developed and implemented new features, conducted thorough testing, and maintained core functionalities of the Trading Operations Support System web app to ensure seamless performance.",
        images: [],
      },
    ],
  },
  {
    id: "bangkit",
    name: "Bangkit Academy led by Google, Tokopedia, Gojek, and Traveloka Indonesia",
    type: "study",
    logo: "/images/logo-bangkit.png",
    positions: [
      {
        title: "Mobile Development Cohort",
        dates: "Feb 2022 - Jul 2022",
        description:
          "Completed Android developer learning path and collaborated on developing Relasia, an app connecting people with volunteers using machine learning and google cloud service.",
        images: [
          "/images/AAD-certificate.jpg",
          "/images/bangkit-certificate.jpg",
        ],
      },
    ],
  },
  {
    id: "its",
    name: "Sepuluh Nopember Institute of Technology (ITS)",
    type: "teaching",
    logo: "/images/logo-its-3.png",
    positions: [
      {
        title: "Data Structure Teaching Assistant",
        dates: "Feb 2022 - Jun 2022",
        description:
          "Assisted in teaching a Data Structure course to 36 students. Conducted bi-weekly lab sessions and practice exercises to reinforce course material and foster hands-on learning. Provided one-on-one mentoring to students encountering difficulties, guiding them to better performance and deeper comprehension of the subject matter.",
        images: [],
      },
      {
        title: "Data Structure Teaching Assistant",
        dates: "Mar 2021 - Jul 2021",
        description:
          "Delivered data structure modules biweekly in laboratory sessions with 36 participants. Mentored participants in practical tasks, enhancing learning outcomes.",
        images: [],
      },
    ],
  },
  {
    id: "hmtc",
    name: "Students Association of Informatics Engineering (HMTC)",
    type: "volunteer",
    logo: "/images/logo-hmtc.jpg",
    positions: [
      {
        title: "Co-Head of Student Resource Development Department",
        dates: "Mar 2022 - Jan 2023",
        description:
          "Oversaw and coordinated the Student Resource Development Department, leading initiatives for student growth and regeneration within the association.",
        images: ["/images/sertif-hmtc-kdpm.png"],
      },
      {
        title: "Staff of Student Resource Development Department",
        dates: "May 2021 - Jan 2022",
        description:
          "Conducted orientation activities, organized meetings, and facilitated regeneration forums within the student association.",
        images: [],
      },
      {
        title: "Student Managerial Trainer",
        dates: "Sep 2021 - Jul 2023",
        description:
          "Delivered and became speaker on self management and event management training sessions.",
        images: [
          "/images/sertif-pemandu-1.png",
          "/images/sertif-pemandu-2.png",
          "/images/sertif-pemandu-3.png",
          "/images/sertif-pemandu-4.png",
          "/images/sertif-pemandu-5.png",
        ],
      },
      {
        title:
          "Co-Head of Muslim Students Association of Informatics Engineering (KMI)",
        dates: "Mar 2022 - Jan 2023",
        description:
          "Monitored activity progress and scheduled evaluations, ensuring efficient operations for the Muslim Students Association of Informatics Engineering (KMI).",
        images: [],
      },
      {
        title: "Programming Instructor",
        dates: "Sep 2021 - Sep 2021",
        description:
          "Delivered C/C++ programming language instruction to 25 high school students, designed practical assignments, and facilitated learning as part of HMTC Goes To School.",
        images: ["/images/sertif-hmtc-gts.png"],
      },
    ],
  },
];

const typeColors = {
  work: "bg-[#3B82F6]",
  volunteer: "bg-[#10B981]",
  teaching: "bg-[#F59E0B]",
  study: "bg-[#F42B2B]",
};

const typeIcons = {
  work: Building,
  volunteer: Users,
  teaching: GraduationCap,
  study: GraduationCap,
};

export function Experience() {
  const [selectedOrg, setSelectedOrg] = useState<string | null>(
    organizations[0]?.id ?? null
  ); // Default to first organization

  const handleOrgClick = (orgId: string) => {
    setSelectedOrg(selectedOrg === orgId ? null : orgId);
  };

  const selectedOrgData = organizations.find((org) => org.id === selectedOrg);

  return (
    <section className="py-20 bg-gradient-to-b from-[#1E293B] to-[#0F172A] px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
            Experience
          </h2>
          <p className="text-lg text-gray-400">
            Click on any item to explore detailed experience
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Organizations List */}
          <div className="lg:col-span-2 min-w-0">
            <div className="space-y-4">
              {organizations.map((org) => {
                const IconComponent =
                  typeIcons[org.type as keyof typeof typeIcons] || Building;
                const colorClass =
                  typeColors[org.type as keyof typeof typeColors] ||
                  typeColors.work;
                return (
                  <div
                    key={org.id}
                    onClick={() => handleOrgClick(org.id)}
                    className={`group cursor-pointer bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-sm rounded-xl p-4 border transition-all duration-300 transform hover:scale-105 ${
                      selectedOrg === org.id
                        ? "border-[#3B82F6] bg-[#3B82F6]/10"
                        : "border-gray-700 hover:border-[#3B82F6]/50"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {/* Logo */}
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-white border border-gray-200">
                        <ImageWithFallback
                          src={org.logo}
                          alt={`${org.name} logo`}
                          className="w-full h-full object-contain p-2 bg-white"
                        />
                      </div>

                      {/* Organization Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-white group-hover:text-[#3B82F6] transition-colors duration-300 truncate">
                          {org.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <div className={`p-1 rounded ${colorClass}/20`}>
                            <IconComponent
                              className={`w-3 h-3 ${colorClass} text-current`}
                            />
                          </div>
                          <span className="text-sm text-gray-400 capitalize">
                            {org.type}
                          </span>
                        </div>
                      </div>

                      {/* Arrow */}
                      <ChevronRight
                        className={`w-5 h-5 text-gray-400 transition-all duration-300 ${
                          selectedOrg === org.id
                            ? "rotate-90 text-[#3B82F6]"
                            : "group-hover:text-[#3B82F6]"
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Timeline Details */}
          <div className="lg:col-span-3 min-w-0">
            {selectedOrgData ? (
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-white border border-gray-200">
                    <ImageWithFallback
                      src={selectedOrgData.logo}
                      alt={`${selectedOrgData.name} logo`}
                      className="w-full h-full object-contain p-2 bg-white"
                    />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-white">
                      {selectedOrgData.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div
                        className={`p-1 rounded ${
                          typeColors[
                            selectedOrgData.type as keyof typeof typeColors
                          ] || typeColors.work
                        }/20`}
                      >
                        {(() => {
                          const IconComponent =
                            typeIcons[
                              selectedOrgData.type as keyof typeof typeIcons
                            ] || Building;
                          return (
                            <IconComponent
                              className={`w-4 h-4 ${
                                typeColors[
                                  selectedOrgData.type as keyof typeof typeColors
                                ] || typeColors.work
                              } text-current`}
                            />
                          );
                        })()}
                      </div>
                      <span className="text-gray-400 capitalize">
                        {selectedOrgData.type}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#3B82F6] to-transparent"></div>

                  <div className="space-y-8">
                    {selectedOrgData.positions.map((position, index) => {
                      const hasImages =
                        Array.isArray(position.images) &&
                        position.images.length > 0;
                      return (
                        <div key={index} className="relative flex gap-6">
                          {/* Timeline dot */}
                          <div className="relative z-10 w-12 h-12 bg-[#3B82F6] rounded-full border-4 border-[#0F172A] flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>

                          {/* Content */}
                          <div className="flex-1 pb-8">
                            <div className="bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                              <div className="grid lg:grid-cols-3 gap-6">
                                {/* Position Details */}
                                <div
                                  className={
                                    hasImages
                                      ? "lg:col-span-2"
                                      : "lg:col-span-3"
                                  }
                                >
                                  <h4 className="text-xl font-semibold text-white mb-2">
                                    {position.title}
                                  </h4>
                                  <div className="flex items-center gap-2 mb-4">
                                    <Calendar className="w-4 h-4 text-[#3B82F6]" />
                                    <span className="text-[#3B82F6] font-medium">
                                      {position.dates}
                                    </span>
                                  </div>
                                  <p className="text-gray-300 leading-relaxed">
                                    {position.description}
                                  </p>
                                </div>

                                {/* Position Images */}
                                {hasImages && (
                                  <div className="lg:col-span-1">
                                    <ImageCarousel
                                      images={position.images}
                                      alt={`${position.title} at ${selectedOrgData.name}`}
                                      className="w-full h-32 lg:h-full"
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 bg-gradient-to-r from-gray-900/50 to-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700">
                <div className="text-center">
                  <Building className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">
                    Select an item to view detailed experience
                  </p>
                  <p className="text-gray-500 text-sm mt-2">
                    Click on any item from the list to explore positions
                    and timeline
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
