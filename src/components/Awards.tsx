import React from "react";
import { Award, Trophy, Star, Medal } from "lucide-react";

const awards = [
  {
    title: "1st Place Best Paper Presentation Award",
    organization:
      "International Meeting on Medical Network (IMMaN) 2024 Conference",
    year: "Sep 2024",
    icon: Award,
  },
  {
    title: "Research Assistance for Research and Innovation Talents Awardee",
    organization: "National Research and Innovation Agency (BRIN) Indonesia",
    year: "Jan 2023",
    icon: Star,
  },
  {
    title: "1st Place Winner of GEOMETRI Mathematics Olympiad",
    organization: "Universitas Negeri Makassar",
    year: "Jan 2019",
    icon: Trophy,
  },
  {
    title: "1st Place Winner of GRAVITASI Physics Olympiad",
    organization: "Universitas Negeri Makassar",
    year: "Jan 2019",
    icon: Trophy,
  },
  {
    title: "1st Place Winner of ARITMATIKA Mathematics Olympiad",
    organization: "UIN Alauddin Makassar",
    year: "Jan 2018",
    icon: Trophy,
  },
  {
    title: "1st Place Winner of GALAKSI Physics Olympiad",
    organization: "UIN Alauddin Makassar",
    year: "Jan 2018",
    icon: Trophy,
  },
  {
    title: "1st Place Winner of MOMENTUM Physics Olympiad",
    organization: "Universitas Muhammadiyah Makassar",
    year: "Jan 2018",
    icon: Trophy,
  },
  {
    title: "1st Place Winner of OPTIKA Mathematics Olympiad",
    organization: "UIN Syarif Hidayatullah Jakarta",
    year: "Jan 2018",
    icon: Trophy,
  },
  {
    title: "National Science Olympiad Finalist in Natural Sciences",
    organization:
      "Ministry of Education, Culture, Research and Technology Indonesia",
    year: "Apr 2015",
    icon: Medal,
  },
];

export function Awards() {
  return (
    <section className="py-20 bg-[#0F172A] px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
            Honors & Awards
          </h2>
          <p className="text-lg text-gray-400">
            Recognition for outstanding contributions to research and academia
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {awards.map((award, index) => (
            <div
              key={index}
              className="group bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-[#3B82F6]/50 transition-all duration-300 transform hover:scale-105"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-to-br from-[#3B82F6]/20 to-[#8B5CF6]/20 rounded-xl group-hover:from-[#3B82F6]/30 group-hover:to-[#8B5CF6]/30 transition-all duration-300">
                  <award.icon className="w-6 h-6 text-[#3B82F6]" />
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-[#3B82F6] transition-colors duration-300">
                    {award.title}
                  </h3>
                  <p className="text-gray-300 mb-1">{award.organization}</p>
                  <p className="text-[#3B82F6] font-medium text-sm">
                    {award.year}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
