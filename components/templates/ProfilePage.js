"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CgProfile } from "react-icons/cg";
import axios from "axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import ProfileForm from "../modules/ProfileForm";
import ProfileData from "../modules/ProfileData";
import { isGuestClient, loadGuestTodosFlat } from "@/utils/guestStorage";

function ProfilePage() {
  const [isGuest, setIsGuest] = useState(false);
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [guestCount, setGuestCount] = useState(0);

  useEffect(() => {
    const guest = isGuestClient();
    setIsGuest(guest);
    if (guest) {
      setGuestCount(loadGuestTodosFlat().length);
      setLoading(false);
      return;
    }
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
        password
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
    <div className="flex min-h-[70vh] items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 28, rotateX: 10 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ type: "spring", stiffness: 160, damping: 18 }}
        style={{ transformPerspective: 1000 }}
        className="glass-panel-strong w-full max-w-2xl rounded-3xl p-8"
      >
        <div className="mb-6 flex items-center gap-3">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-tide to-tide-bright text-white"
            style={{
              boxShadow:
                "inset -3px -5px 10px rgba(0,0,0,0.12), 8px 12px 18px rgba(15,118,110,0.3)"
            }}
          >
            <CgProfile size={24} />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-ink">
              Profile
            </h2>
            <p className="text-sm text-ink-mute">
              Manage your personal information and account security.
            </p>
          </div>
        </div>

        {isGuest ? (
          <div className="space-y-4">
            <div className="rounded-2xl border border-ember/20 bg-ember/10 px-4 py-3 text-sm text-ember">
              You are in guest mode. Tasks ({guestCount}) are stored in{" "}
              <strong>localStorage</strong> on this browser only.
            </div>
            <ProfileData
              data={{
                name: "Guest",
                lastName: "",
                email: "local-guest@this-device"
              }}
            />
            <Link href="/signup" className="btn-primary inline-flex">
              Create an account to sync online
            </Link>
          </div>
        ) : loading ? (
          <div className="text-sm text-ink-mute">Loading profile...</div>
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
              className="btn-primary"
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
      </motion.div>
    </div>
  );
}

export default ProfilePage;
