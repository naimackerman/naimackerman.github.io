import React from "react";
import { ExternalLink, FileText } from "lucide-react";

const publications = [
  {
    title:
      "Using LLM for Real-Time Transcription and Summarization of Doctor-Patient Interactions into ePuskesmas in Indonesia: A Proof-of-Concept Study",
    authors: "Nur Ahmad Khatim, Azmul Asmar Irfan, Mansur M Arief",
    venue: "arXiv preprint arXiv:2409.17054",
    year: "2024",
    citations: 5,
    link: "https://arxiv.org/abs/2409.17054",
  },
  {
    title:
      "Toward an Integrated Decision-Making Framework for Optimized Stroke Diagnosis with DSA and Treatment under Uncertainty",
    authors:
      "Nur Ahmad Khatim, Azmul Asmar Irfan, Amaliya Mata'ul Hayah, Mansur M Arief",
    venue:
      "Proceedings of the 2024 6th International Conference on Intelligent Medicine and Image Processing (pp. 41-49)",
    year: "2024",
    citations: 0,
    link: "https://dl.acm.org/doi/abs/10.1145/3669828.3669835",
  },
  {
    title:
      "1D-CNN Implementation for Automatic Epilepsy Detection in EEG Signals based on Interictal Epileptiform Discharge (IED)",
    authors: "Nur Ahmad Khatim",
    venue: "Undergraduate Thesis, Institut Teknologi Sepuluh Nopember",
    year: "2023",
    citations: 0,
    link: "https://repository.its.ac.id/99533/",
  },
];

export function Publications() {
  // Calculate total citations and h-index
  const totalCitations = publications.reduce(
    (sum, pub) => sum + (pub.citations || 0),
    0
  );
  const hIndex = 1; // as per instruction

  return (
    <section className="py-20 bg-gradient-to-b from-[#1E293B] to-[#0F172A] px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
            Publications
          </h2>
          <p className="text-lg text-gray-400">
            Research contributions to conferences and journals
          </p>
        </div>

        <div className="space-y-6">
          {publications.map((pub, index) => (
            <div
              key={index}
              className="group bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-[#3B82F6]/50 transition-all duration-300 transform hover:scale-[1.02]"
            >
              <div className="grid gap-4 lg:grid-cols-12 lg:items-start">
                <div className="lg:col-span-8 space-y-2 min-w-0">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-[#3B82F6]/20 rounded-lg mt-1">
                      <FileText className="w-5 h-5 text-[#3B82F6]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white group-hover:text-[#3B82F6] transition-colors duration-300 leading-tight">
                        <a
                          href={pub.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline focus:outline-none focus:ring-2 focus:ring-[#3B82F6] rounded"
                        >
                          {pub.title}
                        </a>
                      </h3>
                      <p className="text-gray-400 mt-1">{pub.authors}</p>
                      <a
                        href={pub.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={pub.venue}
                        className="text-[#3B82F6] font-medium hover:underline block mt-1 whitespace-normal break-words"
                      >
                        {pub.venue}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-4 flex flex-col items-end lg:flex-row lg:items-start gap-4 lg:gap-6 lg:justify-end justify-self-end">
                  <div className="text-right min-w-0 lg:flex-1">
                    <p className="text-gray-400 text-sm">{pub.year}</p>
                    <p className="text-green-400 text-sm font-medium mt-1">
                      {pub.citations} citation{pub.citations <= 1 ? "" : "s"}
                    </p>
                  </div>

                  <a
                    href={pub.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View paper: ${pub.title}`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#3B82F6]/20 text-[#3B82F6] rounded-lg border border-[#3B82F6]/30 hover:bg-[#3B82F6] hover:text-white transition-all duration-300 self-end lg:self-auto shrink-0 whitespace-nowrap"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View Paper
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Citation Stats */}
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          <div className="text-center bg-gradient-to-r from-gray-900/50 to-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <div className="text-3xl font-bold text-[#3B82F6] mb-2">
              {publications.length}
            </div>
            <div className="text-gray-300">Total Publications</div>
          </div>
          <div className="text-center bg-gradient-to-r from-gray-900/50 to-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <div className="text-3xl font-bold text-[#3B82F6] mb-2">
              {totalCitations}
            </div>
            <div className="text-gray-300">Citations</div>
          </div>
          <div className="text-center bg-gradient-to-r from-gray-900/50 to-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <div className="text-3xl font-bold text-[#3B82F6] mb-2">
              {hIndex}
            </div>
            <div className="text-gray-300">h-index</div>
          </div>
        </div>
      </div>
    </section>
  );
}
