import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { FiEdit3, FiSave, FiUpload, FiRefreshCw } from "react-icons/fi";
import { useUser } from "../state/UserProvider";
import defaultProfile from "../assets/profile.png";

export default function Dashboard() {
  const { user, loading, updateUser, refreshUser } = useUser();
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [notice, setNotice] = useState(null);
  const fileInputRef = useRef(null);

  const [editMode, setEditMode] = useState(false);
  const [draft, setDraft] = useState({});

  if (loading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-[#f4f7f6] dark:bg-transparent animate-pulse">
        <div className="h-32 w-32 rounded-full bg-slate-200 dark:bg-white/10"></div>
      </div>
    );
  }

  if (!user) return null;

  const handleEditToggle = () => {
    if (!editMode) {
      setDraft({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone?.replace(/^\+8801/, "") || "",
        location: user.location,
      });
    }
    setEditMode(!editMode);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateUser({
        ...user,
        firstName: draft.firstName,
        lastName: draft.lastName,
        email: draft.email,
        phone: `+8801${draft.phone}`,
        location: draft.location,
      });
      setNotice({ type: "success", text: "Profile updated successfully!" });
      setEditMode(false);
    } catch (err) {
      setNotice({ type: "error", text: err.message || "Failed to update profile." });
    } finally {
      setSaving(false);
      setTimeout(() => setNotice(null), 3000);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      setNotice({ type: "error", text: "Cloudinary credentials (CLOUD_NAME, UPLOAD_PRESET) missing in .env" });
      setTimeout(() => setNotice(null), 5000);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    try {
      setSaving(true);
      setNotice({ type: "info", text: "Uploading image..." });
      
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      
      if (data.secure_url) {
        await updateUser({ ...user, avatar: data.secure_url });
        setNotice({ type: "success", text: "Profile picture updated!" });
      } else {
        throw new Error(data.error?.message || "Upload failed");
      }
    } catch (err) {
      setNotice({ type: "error", text: err.message });
    } finally {
      setSaving(false);
      setTimeout(() => setNotice(null), 4000);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshUser();
    setRefreshing(false);
  };

  return (
    <main className="min-h-screen w-full bg-[#f4f7f6] dark:bg-transparent p-6 lg:p-10 text-slate-800 dark:text-slate-200 font-sans transition-colors duration-300">
      <div className="mx-auto max-w-6xl">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">My Profile Dashboard</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage your account and preferences</p>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={handleRefresh} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 transition">
              <FiRefreshCw className={`text-slate-600 dark:text-slate-300 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
            <div className="flex items-center gap-3">
              <img src={user.avatar || defaultProfile} alt="Avatar" className="h-10 w-10 rounded-full object-cover border-2 border-white dark:border-white/10 shadow-sm" />
              <span className="font-semibold text-sm">Hello, {user.firstName} 👋</span>
            </div>
          </div>
        </div>

        {notice && (
          <div className={`mb-6 p-4 rounded-xl text-sm font-bold shadow-sm ${notice.type === 'error' ? 'bg-red-100 text-red-700' : notice.type === 'info' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
            {notice.text}
          </div>
        )}

        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8">
          
          {/* Main Profile Card */}
          <div className="bg-white dark:bg-white/5 rounded-[32px] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_30px_120px_rgba(0,0,0,0.45)] dark:backdrop-blur-[20px] border border-slate-100 dark:border-white/10 relative overflow-hidden transition-all">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-orange-100 to-pink-100 dark:from-orange-500/20 dark:to-pink-500/20 opacity-50 dark:opacity-100 rounded-t-[32px]"></div>
            
            <div className="relative z-10 flex flex-col items-center text-center mt-6">
              <div className="relative group">
                <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-white dark:border-white/10 shadow-lg dark:shadow-2xl bg-slate-100 dark:bg-black/20 relative">
                  <img src={user.avatar || defaultProfile} alt="Profile" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    <FiUpload className="text-white text-xl" />
                  </div>
                </div>
                <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
              </div>
              
              <h2 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">{user.firstName} {user.lastName}</h2>
              <p className="text-sm font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">{user.role}</p>

              <div className="w-full mt-8 space-y-5 text-left">
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-white/10 pb-2">
                  <span className="text-sm font-semibold text-slate-400">Username</span>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200">@{user.username}</span>
                </div>
                
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-white/10 pb-2">
                  <span className="text-sm font-semibold text-slate-400">Email</span>
                  {editMode ? (
                    <input value={draft.email} onChange={(e) => setDraft({...draft, email: e.target.value})} className="text-sm font-bold text-slate-800 dark:text-white text-right bg-slate-50 dark:bg-black/20 p-1 rounded" />
                  ) : (
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{user.email}</span>
                  )}
                </div>

                <div className="flex justify-between items-center border-b border-slate-100 dark:border-white/10 pb-2">
                  <span className="text-sm font-semibold text-slate-400">Phone</span>
                  {editMode ? (
                    <input value={draft.phone} onChange={(e) => setDraft({...draft, phone: e.target.value})} className="text-sm font-bold text-slate-800 dark:text-white text-right bg-slate-50 dark:bg-black/20 p-1 rounded" />
                  ) : (
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{user.phone}</span>
                  )}
                </div>

                <div className="flex justify-between items-center border-b border-slate-100 dark:border-white/10 pb-2">
                  <span className="text-sm font-semibold text-slate-400">Location</span>
                  {editMode ? (
                    <input value={draft.location} onChange={(e) => setDraft({...draft, location: e.target.value})} className="text-sm font-bold text-slate-800 dark:text-white text-right bg-slate-50 dark:bg-black/20 p-1 rounded" />
                  ) : (
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{user.location}</span>
                  )}
                </div>
              </div>

              <div className="mt-8 flex gap-4 w-full">
                {editMode ? (
                  <>
                    <button onClick={handleSave} disabled={saving} className="flex-1 bg-gradient-to-r from-orange-400 to-pink-500 text-white font-bold py-3 rounded-full shadow-lg shadow-orange-200 hover:scale-105 transition">
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                    <button onClick={handleEditToggle} className="flex-1 bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-white font-bold py-3 rounded-full hover:bg-slate-300 dark:hover:bg-white/20 transition">
                      Cancel
                    </button>
                  </>
                ) : (
                  <button onClick={handleEditToggle} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-400 to-pink-500 text-white font-bold py-3 rounded-full shadow-lg shadow-orange-200 dark:shadow-none hover:scale-105 transition">
                    <FiEdit3 /> Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Side Cards */}
          <div className="flex flex-col gap-8">
            
            <div className="bg-white dark:bg-white/5 rounded-[32px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_30px_120px_rgba(0,0,0,0.45)] dark:backdrop-blur-[20px] border border-slate-100 dark:border-white/10 transition-all">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-slate-800 dark:text-white">My Accounts</h3>
                <button className="text-xs font-bold bg-slate-100 dark:bg-white/10 px-3 py-1 rounded-full text-slate-600 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-white/20 transition">Add +</button>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-black/20 rounded-2xl mb-3 transition">
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-white">Merchant Account</p>
                  <p className="text-xs text-slate-400 mt-1">Active trading profile</p>
                </div>
                <div className="bg-gradient-to-r from-orange-400 to-pink-500 text-white text-[10px] font-bold uppercase tracking-wider px-4 py-2 rounded-full shadow-md shadow-orange-200 dark:shadow-none">
                  Manage
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-black/20 rounded-2xl transition">
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-white">Buyer Account</p>
                  <p className="text-xs text-slate-400 mt-1">Personal purchases</p>
                </div>
                <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider px-4 py-2 rounded-full shadow-md shadow-green-200 dark:shadow-none">
                  Switch
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-white/5 rounded-[32px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_30px_120px_rgba(0,0,0,0.45)] dark:backdrop-blur-[20px] border border-slate-100 dark:border-white/10 relative overflow-hidden transition-all">
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-pink-100 dark:bg-pink-500/20 rounded-full blur-3xl opacity-60"></div>
              
              <div className="flex justify-between items-center mb-6 relative z-10">
                <h3 className="font-bold text-slate-800 dark:text-white">Activity Stats</h3>
                <span className="text-xs font-bold text-slate-400">This Week</span>
              </div>

              <div className="space-y-4 relative z-10">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">Transactions</span>
                  </div>
                  <span className="bg-green-100 dark:bg-green-400/10 text-green-700 dark:text-green-300 text-xs font-bold px-3 py-1 rounded-full">12 active</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-pink-500"></div>
                    <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">Pending Approvals</span>
                  </div>
                  <span className="bg-pink-100 dark:bg-pink-400/10 text-pink-700 dark:text-pink-300 text-xs font-bold px-3 py-1 rounded-full">3 alerts</span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">Total Spent</span>
                  </div>
                  <span className="bg-green-100 dark:bg-green-400/10 text-green-700 dark:text-green-300 text-xs font-bold px-3 py-1 rounded-full">$450.00</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
