"use strict";

"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { Resource, ResourceType, Course } from "@/types";
import { getCourseByIdAction } from "@/lib/actions/courses";
import {
  getResourcesAction,
  addResourceAction,
  deleteResourceAction,
} from "@/lib/actions/resources";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function CourseDetail({ params }: PageProps) {
  const resolvedParams = use(params);
  const courseId = resolvedParams.id;

  const [course, setCourse] = useState<Course | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Modal forms states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [resTitle, setResTitle] = useState("");
  const [resUrl, setResUrl] = useState("");
  const [resType, setResType] = useState<ResourceType>("Website");
  const [resNotes, setResNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // AI suggestions list mock
  const [aiSuggestions, setAiSuggestions] = useState([
    {
      title: "MIT 6.036 Introduction to Machine Learning",
      url: "https://openlearninglibrary.mit.edu/courses/course-v1:MITx+6.036+everyone/about",
      type: "Website" as ResourceType,
      description: "Interactive online materials aligning closely with undergrad course syllabus.",
      added: false,
    },
    {
      title: "Scikit-Learn Official User Guide",
      url: "https://scikit-learn.org/stable/user_guide.html",
      type: "GitHub" as ResourceType,
      description: "Excellent tutorials for practical regression and clustering assignments.",
      added: false,
    }
  ]);

  const [aiScanning, setAiScanning] = useState(false);
  const [aiStatusMessage, setAiStatusMessage] = useState("Scan complete.");

  // Fetch course and its resources
  useEffect(() => {
    let active = true;

    const loadData = async () => {
      setLoading(true);
      setErrorMsg("");
      try {
        const courseRes = await getCourseByIdAction(courseId);
        if (!active) return;
        if (courseRes.success && courseRes.data) {
          setCourse(courseRes.data);
        } else {
          setErrorMsg(courseRes.error || "Failed to load course folder details.");
          setLoading(false);
          return;
        }

        const resourcesRes = await getResourcesAction(courseId);
        if (!active) return;
        if (resourcesRes.success && resourcesRes.data) {
          setResources(resourcesRes.data);
        } else {
          setErrorMsg(resourcesRes.error || "Failed to load resource links.");
        }
      } catch (err) {
        if (!active) return;
        const message = err instanceof Error ? err.message : "An unexpected error occurred.";
        setErrorMsg(message);
      } finally {
        if (active) setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      loadData();
    }, 0);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [courseId]);

  const triggerAIScan = () => {
    setAiScanning(true);
    setAiStatusMessage("Scanning BRAC University level resources...");
    setTimeout(() => {
      setAiScanning(false);
      setAiStatusMessage("Scan complete. 2 highly relevant suggestions loaded.");
    }, 2000);
  };

  const handleAddResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resTitle.trim() || !resUrl.trim()) return;

    setSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await addResourceAction(courseId, {
        title: resTitle,
        url: resUrl,
        resource_type: resType,
        notes: resNotes,
      });

      if (res.success && res.data) {
        setResources([res.data, ...resources]);
        setSuccessMsg(`Resource "${resTitle}" saved successfully!`);
        setResTitle("");
        setResUrl("");
        setResType("Website");
        setResNotes("");
        setIsAddModalOpen(false);
        setTimeout(() => setSuccessMsg(""), 4000);
      } else {
        setErrorMsg(res.error || "Failed to save link.");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to add resource.";
      setErrorMsg(message);
    } // Typo fixed below
    finally {
      setSubmitting(false);
    }
  };

  const handleDeleteResource = async (id: string) => {
    if (!confirm("Are you sure you want to delete this resource link?")) {
      return;
    }
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await deleteResourceAction(id, courseId);
      if (res.success) {
        setResources(resources.filter((r) => r.id !== id));
        setSuccessMsg("Resource deleted successfully.");
        setTimeout(() => setSuccessMsg(""), 3000);
      } else {
        setErrorMsg(res.error || "Failed to delete link.");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete resource.";
      setErrorMsg(message);
    }
  };

  const addAISuggestion = async (index: number) => {
    const suggestion = aiSuggestions[index];
    if (suggestion.added) return;

    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await addResourceAction(courseId, {
        title: suggestion.title,
        url: suggestion.url,
        resource_type: suggestion.type,
        notes: suggestion.description,
      });

      if (res.success && res.data) {
        setResources([res.data, ...resources]);
        setSuccessMsg(`AI Resource "${suggestion.title}" added!`);
        
        const updatedSuggestions = [...aiSuggestions];
        updatedSuggestions[index].added = true;
        setAiSuggestions(updatedSuggestions);

        setTimeout(() => setSuccessMsg(""), 4000);
      } else {
        setErrorMsg(res.error || "Failed to add suggested resource.");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to add suggestion.";
      setErrorMsg(message);
    }
  };

  const categories: { type: ResourceType; label: string; glowClass: string; icon: string }[] = [
    { type: "GitHub", label: "GitHub Repositories", glowClass: "glow-blue", icon: "code" },
    { type: "YouTube", label: "Video Lectures", glowClass: "glow-red", icon: "smart_display" },
    { type: "PDF/Notes", label: "Notes & PDFs", glowClass: "glow-purple", icon: "description" },
    { type: "Website", label: "Websites & Blogs", glowClass: "glow-cyan", icon: "language" },
    { type: "Practice", label: "Practice Problems", glowClass: "glow-violet", icon: "task_alt" },
    { type: "Other", label: "Other Materials", glowClass: "glow-other", icon: "folder_open" }
  ];

  if (loading) {
    return (
      <main className="flex-1 pt-32 pb-24 px-4 md:px-12 max-w-[1440px] mx-auto w-full flex flex-col gap-8 relative z-10">
        <div className="animate-pulse flex flex-col gap-4 border-b border-white/10 pb-6">
          <div className="h-4 w-1/4 bg-white/10 rounded" />
          <div className="h-10 w-2/3 bg-white/10 rounded mt-2" />
          <div className="h-4 w-1/2 bg-white/5 rounded mt-1" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 4].map((n) => (
              <div key={n} className="bento-card min-h-[300px] border border-white/5 animate-pulse" />
            ))}
          </div>
          <div className="lg:col-span-4 bento-card min-h-[500px] border border-white/5 animate-pulse" />
        </div>
      </main>
    );
  }

  if (!course) {
    return (
      <main className="flex-1 pt-32 pb-24 px-4 md:px-12 max-w-[1440px] mx-auto w-full flex flex-col gap-6 items-center justify-center relative z-10">
        <div className="bento-card text-center p-12 max-w-md border border-white/10">
          <span className="material-symbols-outlined text-4xl text-[#ffb4ab] mb-4">warning</span>
          <h2 className="text-xl font-bold text-white mb-2">Folder Not Found</h2>
          <p className="text-sm text-[#ccc3d8]/80 leading-relaxed mb-6">
            We could not retrieve this course folder. It may have been deleted, or you do not have permissions to access it.
          </p>
          <Link href="/dashboard" className="btn-primary py-2 px-6">
            Return to Galaxy
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 pt-32 pb-24 px-4 md:px-12 max-w-[1440px] mx-auto w-full flex flex-col gap-8 relative z-10">
      
      {/* Breadcrumbs & Navigation Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-xs font-mono text-[#ccc3d8]/60 uppercase tracking-widest">
          <Link href="/dashboard" className="hover:text-[#94e2ff] transition-colors">
            Dashboard
          </Link>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-[#94e2ff]">
            {course.course_code}
          </span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-white/10">
          <div>
            <h1 className="text-3xl md:text-5xl font-black text-white text-gradient">
              {course.course_code} — {course.course_title}
            </h1>
            {course.description && (
              <p className="text-sm text-[#ccc3d8]/80 mt-1 max-w-2xl leading-relaxed">
                {course.description}
              </p>
            )}
          </div>
          
          <div className="flex flex-wrap gap-3">
            <button
              onClick={triggerAIScan}
              className="btn-secondary py-2 px-5 text-sm flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">auto_awesome</span>
              AI Sync Search
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="btn-primary py-2 px-5 text-sm flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-lg font-bold">add</span>
              Add Link
            </button>
          </div>
        </div>
      </div>

      {/* Message Banners */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-[#93000a]/20 border border-[#ffb4ab]/40 text-sm text-[#ffb4ab] text-center animate-in fade-in">
          {errorMsg}
        </div>
      )}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-sm text-emerald-400 text-center animate-in fade-in">
          {successMsg}
        </div>
      )}

      {/* Main Grid: Category Columns and AI Side Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Resource Categories Grid */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {categories.map((cat) => {
              const catResources = resources.filter((r) => r.resource_type === cat.type);
              
              return (
                <div key={cat.type} className={`bento-card ${cat.glowClass} flex flex-col justify-between min-h-[300px]`}>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#94e2ff]">
                        <span className="material-symbols-outlined text-lg">{cat.icon}</span>
                      </div>
                      <h3 className="text-lg font-bold text-white tracking-wide">
                        {cat.label}
                      </h3>
                    </div>

                    <div className="flex flex-col gap-2 mt-2">
                      {catResources.length === 0 ? (
                        <div className="text-center py-8 text-xs text-[#ccc3d8]/40 border border-dashed border-white/5 rounded-lg">
                          <span className="material-symbols-outlined text-2xl mb-1 block opacity-30">note_add</span>
                          No resources added yet.
                        </div>
                      ) : (
                        catResources.map((res) => (
                          <div
                            key={res.id}
                            className="resource-item p-3 rounded-lg border border-white/5 bg-[#171f33]/30 flex items-start justify-between group"
                          >
                            <div className="flex-1 min-w-0 pr-2">
                              <a
                                href={res.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm font-bold text-white hover:text-[#94e2ff] transition-colors block truncate"
                              >
                                {res.title}
                              </a>
                              <span className="text-[10px] font-mono text-[#ccc3d8]/50 truncate block mt-0.5">
                                {new URL(res.url).hostname}
                              </span>
                              {res.notes && (
                                <p className="text-[11px] text-[#ccc3d8]/70 mt-1 line-clamp-2">
                                  {res.notes}
                                </p>
                              )}
                            </div>
                            
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 self-center">
                              <a
                                href={res.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#ccc3d8] hover:text-white p-1 rounded hover:bg-white/5"
                                title="Open Link"
                              >
                                <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                              </a>
                              <button
                                onClick={() => handleDeleteResource(res.id)}
                                className="text-[#ffb4ab] hover:text-[#ff9b9b] p-1 rounded hover:bg-white/5 cursor-pointer transition-colors"
                                title="Delete"
                              >
                                <span className="material-symbols-outlined text-[16px]">delete</span>
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setResType(cat.type);
                      setIsAddModalOpen(true);
                    }}
                    className="mt-4 text-xs font-mono text-[#94e2ff] hover:text-white flex items-center gap-1 self-start transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">add</span>
                    Add Link
                  </button>
                </div>
              );
            })}

          </div>
        </div>

        {/* AI Resource Finder Panel */}
        <div className="lg:col-span-4">
          <div className="glass-panel rounded-2xl p-6 flex flex-col gap-6 relative overflow-hidden h-full min-h-[500px]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#94e2ff]/5 rounded-full blur-3xl" />
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4 relative z-10">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#94e2ff] animate-pulse">auto_awesome</span>
                <h3 className="text-lg font-bold text-white">AI Resource Finder</h3>
              </div>
              <button
                onClick={triggerAIScan}
                disabled={aiScanning}
                className="text-xs font-mono text-[#94e2ff] hover:underline cursor-pointer disabled:opacity-50"
              >
                Scan Now
              </button>
            </div>

            {/* Scanning Status */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 relative z-10 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className={aiScanning ? "pulse-dot" : "w-2.5 h-2.5 rounded-full bg-emerald-500"} />
                <span className="text-xs font-mono uppercase tracking-wider text-[#94e2ff]">
                  {aiScanning ? "Searching..." : "Ready"}
                </span>
              </div>
              <p className="text-xs text-[#ccc3d8] leading-relaxed">
                {aiScanning 
                  ? `Querying Gemini for BRAC University ${course.course_code} resource database...` 
                  : aiStatusMessage}
              </p>
            </div>

            {/* Suggested cards */}
            <div className="flex-grow flex flex-col gap-4 relative z-10">
              <h4 className="text-xs font-mono uppercase tracking-wider text-[#ccc3d8]/60 mt-2">
                AI Suggested Resources
              </h4>

              {aiSuggestions.map((sug, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-[#171f33]/40 border border-white/5 hover:border-[#7c3aed]/30 transition-all flex flex-col gap-3"
                >
                  <div className="flex justify-between items-start">
                    <span className="glass-chip text-[9px] px-2 py-0.5 border-none bg-white/5">
                      {sug.type}
                    </span>
                    <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                      95% Match
                    </span>
                  </div>
                  
                  <div>
                    <h5 className="text-sm font-bold text-white leading-snug">
                      {sug.title}
                    </h5>
                    <p className="text-xs text-[#ccc3d8]/80 mt-1 leading-relaxed">
                      {sug.description}
                    </p>
                  </div>

                  <button
                    onClick={() => addAISuggestion(idx)}
                    disabled={sug.added}
                    className={`w-full py-2 rounded text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      sug.added 
                        ? "bg-white/5 text-white/40 cursor-default border border-transparent" 
                        : "btn-primary py-1.5 shadow-none hover:shadow-lg border border-[#7c3aed]/40"
                    }`}
                  >
                    {sug.added ? (
                      <>
                        <span className="material-symbols-outlined text-sm">done</span>
                        Added to Folder
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-sm font-bold">add</span>
                        Add to Course
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>

      {/* Add Resource Link Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-[#060d20]/80 backdrop-blur-md transition-opacity"
            onClick={() => {
              if (!submitting) setIsAddModalOpen(false);
            }}
          />
          <div className="glass-panel rounded-2xl w-full max-w-md p-6 md:p-8 relative z-10 border border-white/20 shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-[#94e2ff]">bookmark_add</span>
                Add New Resource
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                disabled={submitting}
                className="text-white/60 hover:text-white transition-colors cursor-pointer disabled:opacity-40"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleAddResource} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#ccc3d8] mb-2">
                  Resource URL *
                </label>
                <input
                  type="url"
                  required
                  disabled={submitting}
                  placeholder="https://example.com/notes"
                  value={resUrl}
                  onChange={(e) => setResUrl(e.target.value)}
                  className="input-glass disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#ccc3d8] mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  disabled={submitting}
                  placeholder="e.g. Backpropagation Tutorial"
                  value={resTitle}
                  onChange={(e) => setResTitle(e.target.value)}
                  className="input-glass disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#ccc3d8] mb-2">
                  Category *
                </label>
                <select
                  value={resType}
                  disabled={submitting}
                  onChange={(e) => setResType(e.target.value as ResourceType)}
                  className="w-full bg-[#2d3449]/40 border border-[#4a4455] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#94e2ff] transition-all cursor-pointer disabled:opacity-50"
                >
                  <option className="bg-[#131b2e]" value="GitHub">GitHub Repository</option>
                  <option className="bg-[#131b2e]" value="YouTube">YouTube Video</option>
                  <option className="bg-[#131b2e]" value="PDF/Notes">Notes / PDF Document</option>
                  <option className="bg-[#131b2e]" value="Website">Website / Blog</option>
                  <option className="bg-[#131b2e]" value="Practice">Practice Problems</option>
                  <option className="bg-[#131b2e]" value="Other">Other Materials</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#ccc3d8] mb-2">
                  Short Note / Description
                </label>
                <textarea
                  placeholder="Brief context about this link..."
                  disabled={submitting}
                  value={resNotes}
                  onChange={(e) => setResNotes(e.target.value)}
                  rows={2}
                  className="input-glass resize-none disabled:opacity-50"
                />
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  disabled={submitting}
                  className="btn-secondary py-2.5 px-4 text-sm flex-1 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary py-2.5 px-4 text-sm flex-1 disabled:opacity-50"
                >
                  {submitting ? "Saving..." : "Save Resource"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </main>
  );
}
