"use strict";

"use client";

import { useState } from "react";
import Link from "next/link";

interface CourseMock {
  id: string;
  course_code: string;
  course_title: string;
  description: string;
  tags: string[];
  linksCount: number;
}

export default function Dashboard() {
  const [courses, setCourses] = useState<CourseMock[]>([
    {
      id: "cse427-ml",
      course_code: "CSE 427",
      course_title: "Machine Learning",
      description: "Undergraduate level machine learning course focusing on algorithms, regression, and deep neural networks.",
      tags: ["ML", "AI", "BRACU"],
      linksCount: 12,
    },
    {
      id: "cse422-ai",
      course_code: "CSE 422",
      course_title: "Artificial Intelligence",
      description: "Foundational AI topics including search strategies, logic agent structures, and classical reasoning algorithms.",
      tags: ["AI", "Search", "Logic"],
      linksCount: 8,
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [courseCode, setCourseCode] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [courseDesc, setCourseDesc] = useState("");

  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseCode || !courseTitle) return;

    const newCourse: CourseMock = {
      id: `course-${Date.now()}`,
      course_code: courseCode,
      course_title: courseTitle,
      description: courseDesc || "No description provided.",
      tags: ["User Course"],
      linksCount: 0
    };

    setCourses([...courses, newCourse]);
    setCourseCode("");
    setCourseTitle("");
    setCourseDesc("");
    setIsModalOpen(false);
  };

  return (
    <main className="flex-1 pt-32 pb-24 px-4 md:px-12 max-w-[1440px] mx-auto w-full flex flex-col gap-10 relative z-10">
      
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight text-gradient">
            My Course Galaxy
          </h1>
          <p className="text-sm text-[#ccc3d8]/70 mt-1">
            Access your university folders and academic bookmarks in one secure command center.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary py-2.5 px-6 self-start text-sm shadow-md"
        >
          <span className="material-symbols-outlined font-bold text-lg">add</span>
          Add New Course
        </button>
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {courses.map((course) => (
          <div key={course.id} className="bento-card bento-card-hover group shadow-lg flex flex-col justify-between min-h-[250px] border border-white/10 hover:border-[#7c3aed]/50">
            {/* Folder floating background decoration */}
            <span className="material-symbols-outlined absolute -top-2 -right-2 text-[100px] text-white/5 group-hover:text-[#7c3aed]/10 transition-colors duration-500 transform rotate-12 select-none">
              folder
            </span>

            <div className="relative z-10 flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-[#94e2ff] transition-colors">
                    {course.course_title}
                  </h3>
                  <p className="text-xs font-mono text-[#ccc3d8]/80 mt-1 uppercase tracking-wider">
                    {course.course_code}
                  </p>
                </div>
                <div className="text-white/60 bg-white/5 p-2 rounded-full border border-white/10">
                  <span className="material-symbols-outlined text-[18px]">folder</span>
                </div>
              </div>
              <p className="text-sm text-white/70 line-clamp-3 leading-relaxed">
                {course.description}
              </p>
            </div>

            <div className="relative z-10 pt-4 border-t border-white/10 mt-6 flex items-center justify-between">
              <div className="flex gap-2">
                {course.tags.map((tag) => (
                  <span key={tag} className="glass-chip text-[10px] px-2 py-0.5">
                    {tag}
                  </span>
                ))}
              </div>
              <Link
                href={`/courses/${course.id}`}
                className="btn-primary py-1.5 px-4 text-xs shadow-none gap-1 bg-gradient-to-r from-[#7c3aed] to-[#94e2ff] text-[#060d20]"
              >
                Open Folder
                <span className="material-symbols-outlined text-xs">arrow_forward</span>
              </Link>
            </div>
          </div>
        ))}

        {/* Dash Card Trigger placeholder */}
        <div
          onClick={() => setIsModalOpen(true)}
          className="bento-card bento-card-hover border-dashed border-2 border-white/20 hover:border-[#7c3aed]/50 flex flex-col items-center justify-center gap-4 text-center cursor-pointer bg-white/5 group min-h-[250px]"
        >
          <div className="w-12 h-12 rounded-full bg-[#7c3aed]/10 flex items-center justify-center border border-[#7c3aed]/30 group-hover:bg-[#7c3aed]/20 transition-all">
            <span className="material-symbols-outlined text-2xl text-white">add</span>
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Add Course Folder</h3>
            <p className="text-xs text-[#ccc3d8]/50 mt-1">Initialize another study sector</p>
          </div>
        </div>

      </div>

      {/* Add Course Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-[#060d20]/80 backdrop-blur-md transition-opacity"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="glass-panel rounded-2xl w-full max-w-md p-6 md:p-8 relative z-10 border border-white/20 shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-[#d2bbff]">create_new_folder</span>
                New Course Folder
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white/60 hover:text-white transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleAddCourse} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#ccc3d8] mb-2">
                  Course Code *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CSE 427"
                  value={courseCode}
                  onChange={(e) => setCourseCode(e.target.value)}
                  className="input-glass"
                />
              </div>
              
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#ccc3d8] mb-2">
                  Course Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Machine Learning"
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  className="input-glass"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#ccc3d8] mb-2">
                  Description
                </label>
                <textarea
                  placeholder="Brief summary of syllabus or targets..."
                  value={courseDesc}
                  onChange={(e) => setCourseDesc(e.target.value)}
                  rows={3}
                  className="input-glass resize-none"
                />
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-secondary py-2.5 px-4 text-sm flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary py-2.5 px-4 text-sm flex-1"
                >
                  Create Folder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </main>
  );
}
