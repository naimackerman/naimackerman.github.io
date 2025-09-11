import React from "react";

export function About() {
  return (
    <section className="py-20 bg-[#0F172A] px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center space-y-8">
          <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            About Me
          </h2>

          <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 backdrop-blur-sm rounded-2xl p-8 lg:p-12 border border-gray-700">
            <div className="space-y-6">
              <p className="text-lg lg:text-xl text-gray-300 leading-relaxed">
                I'm a passionate Informatics Engineering graduate with hands-on
                experience in software engineering and AI research. My work
                centers on developing innovative AI solutions that bridge the
                gap between cutting-edge research and real-world applications. I
                have a strong foundation in machine learning, deep learning, and
                full-stack development.
              </p>
              <p className="text-lg lg:text-xl text-gray-300 leading-relaxed">
                I believe in the transformative power of artificial intelligence
                to solve complex problems and create a positive impact in
                society and healthcare. Beyond my professional work, I enjoy
                participating in competitive programming contests and
                contributing to community activities through student
                associations from my time on campus.
              </p>
              <p className="text-lg lg:text-xl text-gray-300 leading-relaxed">
                I also have experience as a teaching assistant for a data
                structure lecture and find fulfillment in training and mentoring
                students in event management skills. Currently, I'm working on
                projects using Golang and ReactJS to further hone my skills and
                explore new technologies.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
