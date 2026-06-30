"use strict";

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Course } from "@/types";
import {
  getCoursesAction,
  createCourseAction,
  deleteCourseAction,
} from "@/lib/actions/courses";

export default function Dashboard() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Modal forms states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [courseCode, setCourseCode] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [courseDesc, setCourseDesc] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Fetch courses from database
  const loadCourses = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await getCoursesAction();
      if (res.success && res.data) {
        setCourses(res.data);
      } else {
        setErrorMsg(res.error || "Failed to load courses from your galaxy.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseCode.trim() || !courseTitle.trim()) return;

    setSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await createCourseAction({
        course_code: courseCode,
        course_title: courseTitle,
        description: courseDesc,
      });

      if (res.success && res.data) {
        setCourses([res.data, ...courses]);
        setSuccessMsg(`Folder ${courseCode} initialized successfully!`);
        setCourseCode("");
        setCourseTitle("");
        setCourseDesc("");
        setIsModalOpen(false);
        setTimeout(() => setSuccessMsg(""), 4000);
      } else {
        setErrorMsg(res.error || "Failed to initialize folder.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to add course.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCourse = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this course and all its resources? This cannot be undone.")) {
      return;
    }

    try {
      const res = await deleteCourseAction(id);
      if (res.success) {
        setCourses(courses.filter((c) => c.id !== id));
        setSuccessMsg("Folder deleted successfully.");
        setTimeout(() => setSuccessMsg(""), 3000);
      } else {
        setErrorMsg(res.error || "Failed to delete course.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred during deletion.");
    }
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

      {/* Message Banners */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-[#93000a]/20 border border-[#ffb4ab]/45 text-sm text-[#ffb4ab] text-center animate-in fade-in">
          {errorMsg}
        </div>
      )}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-sm text-emerald-400 text-center animate-in fade-in">
          {successMsg}
        </div>
      )}

      {/* Main content grids */}
      {loading ? (
        // Loading skeletons
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bento-card min-h-[250px] border border-white/5 animate-pulse flex flex-col justify-between">
              <div className="flex flex-col gap-3">
                <div className="h-6 w-2/3 bg-white/10 rounded" />
                <div className="h-4 w-1/3 bg-white/5 rounded" />
                <div className="h-12 w-full bg-white/5 rounded mt-3" />
              </div>
              <div className="h-8 w-1/3 bg-white/10 rounded self-end" />
            </div>
          ))}
        </div>
      ) : courses.length === 0 ? (
        // Empty state
        <div className="bento-card py-16 flex flex-col items-center justify-center gap-6 text-center border-dashed border-2 border-white/10 bg-white/25">
          <div className="w-16 h-16 rounded-full bg-[#7c3aed]/10 flex items-center justify-center border border-[#7c3aed]/30 shadow-lg text-[#d2bbff]">
            <span className="material-symbols-outlined text-4xl">folder_off</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Galaxy is Empty</h3>
            <p className="text-sm text-[#ccc3d8]/60 max-w-md mx-auto leading-relaxed">
              No course folders have been initialized yet. Click below to boot up your first academic folder.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-primary py-2.5 px-6 text-sm"
          >
            Create Your First Course
          </button>
        </div>
      ) : (
        // Real course grid
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Link
              key={course.id}
              href={`/courses/${course.id}`}
              className="bento-card bento-card-hover group shadow-lg flex flex-col justify-between min-h-[250px] border border-white/10 hover:border-[#7c3aed]/50 cursor-pointer"
            >
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
                  <button
                    onClick={(e) => handleDeleteCourse(course.id, e)}
                    className="text-white/40 hover:text-[#ffb4ab] p-2 rounded-full hover:bg-white/5 z-20 cursor-pointer transition-colors"
                    title="Delete folder"
                  >
                    <span className="material-symbols-outlined text-[20px]">delete</span>
                  </button>
                </div>
                {course.description && (
                  <p className="text-sm text-white/70 line-clamp-3 leading-relaxed">
                    {course.description}
                  </p>
                )}
              </div>

              <div className="relative z-10 pt-4 border-t border-white/10 mt-6 flex items-center justify-between">
                <div className="flex gap-2">
                  {course.tags && course.tags.map((tag) => (
                    <span key={tag} className="glass-chip text-[10px] px-2 py-0.5 border-none bg-white/5">
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="btn-primary py-1.5 px-4 text-xs shadow-none gap-1 bg-gradient-to-r from-[#7c3aed] to-[#94e2ff] text-[#060d20]">
                  Open Folder
                  <span className="material-symbols-outlined text-xs">arrow_forward</span>
                </span>
              </div>
            </Link>
          ))}

          {/* Add Course Trigger card */}
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
      )}

      {/* Add Course Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-[#060d20]/80 backdrop-blur-md transition-opacity"
            onClick={() => {
              if (!submitting) setIsModalOpen(false);
            }}
          />
          <div className="glass-panel rounded-2xl w-full max-w-md p-6 md:p-8 relative z-10 border border-white/20 shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-[#d2bbff]">create_new_folder</span>
                New Course Folder
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                disabled={submitting}
                className="text-white/60 hover:text-white transition-colors cursor-pointer disabled:opacity-40"
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
                  disabled={submitting}
                  placeholder="e.g. CSE 427"
                  value={courseCode}
                  onChange={(e) => setCourseCode(e.target.value)}
                  className="input-glass disabled:opacity-50"
                />
              </div>
              
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#ccc3d8] mb-2">
                  Course Title *
                </label>
                <input
                  type="text"
                  required
                  disabled={submitting}
                  placeholder="e.g. Machine Learning"
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  className="input-glass disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#ccc3d8] mb-2">
                  Description
                </label>
                <textarea
                  placeholder="Brief summary of syllabus or targets..."
                  disabled={submitting}
                  value={courseDesc}
                  onChange={(e) => setCourseDesc(e.target.value)}
                  rows={3}
                  className="input-glass resize-none disabled:opacity-50"
                />
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={submitting}
                  className="btn-secondary py-2.5 px-4 text-sm flex-1 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary py-2.5 px-4 text-sm flex-1 disabled:opacity-55"
                >
                  {submitting ? "Initializing..." : "Create Folder"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </main>
  );
}
