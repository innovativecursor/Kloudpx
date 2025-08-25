// "use client";

// import React, { createContext, useContext, useState } from "react";

// import Swal from "sweetalert2";
// import { useAuth } from "./AuthContext";
// import endpoints from "../config/endpoints";
// import { updateAxiosCall } from "../lib/axios";

// const ProfileContext = createContext();

// export const ProfileProvider = ({ children }) => {
//     const { user, fetchUser } = useAuth();

//     const updateProfile = async (data) => {
//         if (!user?.id) return;

//         try {
//             const payload = {
//                 full_name: data.name,
//                 dob: data.dob || "",
//                 gender: data.gender,
//                 phone: data.phone || "",
//             };

//             await updateAxiosCall(endpoints.account.edit(), user.id, payload, true);

//             // Success message
//             Swal.fire({
//                 title: "Success",
//                 text: "Profile updated successfully",
//                 icon: "success",
//                 confirmButtonText: "OK",
//             });

//             // ✅ Fetch updated user info
//             if (fetchUser) await fetchUser();
//         } catch (error) {
//             console.error("Profile update failed:", error);
//         }
//     };

//     return (
//         <ProfileContext.Provider
//             value={{
//                 updateProfile,
//             }}
//         >
//             {children}
//         </ProfileContext.Provider>
//     );
// };

// export const useProfileContext = () => useContext(ProfileContext);





"use client";

import React, { createContext, useContext } from "react";
import Swal from "sweetalert2";
import { useAuth } from "./AuthContext";
import endpoints from "../config/endpoints";
import { updateAxiosCall } from "../lib/axios";

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const { user, fetchUser } = useAuth();

  const updateProfile = async (data) => {
    if (!user?.id) return;

    // ✅ Validation: All fields required
    if (!data.name?.trim() || !data.phone?.trim() || !data.dob?.trim() || !data.gender?.trim()) {
      Swal.fire({
        title: "Error",
        text: "Please fill all fields before saving.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      const payload = {
        full_name: data.name.trim(),
        dob: data.dob,
        gender: data.gender,
        phone: data.phone.trim(),
      };

      await updateAxiosCall(endpoints.account.edit(), user.id, payload, true);

      Swal.fire({
        title: "Success",
        text: "Profile updated successfully",
        icon: "success",
        confirmButtonText: "OK",
      });

      if (fetchUser) await fetchUser();
    } catch (error) {
      console.error("Profile update failed:", error);
      Swal.fire({
        title: "Error",
        text: "Profile update failed. Try again later.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <ProfileContext.Provider value={{ updateProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfileContext = () => useContext(ProfileContext);
