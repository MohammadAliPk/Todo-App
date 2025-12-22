'use client';

import { useEffect, useState } from "react";
import { CgProfile } from "react-icons/cg";
import axios from "axios";
import { toast } from "react-toastify";
import ProfileForm from "../modules/ProfileForm";
import ProfileData from "../modules/ProfileData";

function ProfilePage() {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get("/api/profile");
      const resData = res.data;

      if (resData.status === "Success" && resData) {
        setData(resData.data);
      }
    } catch (err) {
      const errMsg = err?.response?.data?.message || "Failed to load profile";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const submitHandler = async () => {
    try {
      const res = await axios.post("/api/profile", {
        name,
        lastName,
        password,
      });
      if (res.data.status === "Success") {
        toast.success("Profile updated successfully");
        setPassword("");
        fetchProfile();
      }
    } catch (err) {
      const errMsg = err?.response?.data?.message || "Failed to update profile";
      toast.error(errMsg);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
            <CgProfile size={22} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Profile</h2>
            <p className="text-sm text-gray-500">
              Manage your personal information and account security.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="text-gray-500 text-sm">Loading profile...</div>
        ) : data ? (
          <div className="space-y-6">
            <ProfileData data={data} />
            <button
              onClick={() => {
                setName(data.name || "");
                setLastName(data.lastName || "");
                setPassword("");
                setData(null);
              }}
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              Edit Profile
            </button>
          </div>
        ) : (
          <ProfileForm
            name={name}
            lastName={lastName}
            password={password}
            setName={setName}
            setLastName={setLastName}
            setPassword={setPassword}
            submitHandler={submitHandler}
          />
        )}
      </div>
    </div>
  );
}

export default ProfilePage;