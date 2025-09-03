"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { getAxiosCall, postAxiosCall } from "../Axios/UniversalAxiosCalls";
import Swal from "sweetalert2";
import endpoints from "../config/endpoints";

export const ThresholdContext = createContext();

const ThresholdProvider = ({ children }) => {
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingRegion, setEditingRegion] = useState(null);

  const fetchRegions = async () => {
    setLoading(true);
    const response = await getAxiosCall(endpoints.regionSettings.getAll);
    setLoading(false);

    if (response?.data?.regions && Array.isArray(response.data.regions)) {
      setRegions(response.data.regions);
    } else {
      setRegions([]);
    }
  };

  const addOrUpdateRegion = async (payload) => {
    if (!payload.id) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "ID is required to update a region!",
      });
      return;
    }

    const response = await postAxiosCall(
      endpoints.regionSettings.upsert,
      payload
    );

    if (response) {
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Region updated successfully!",
      });
      fetchRegions();
    }
  };

  useEffect(() => {
    if (!regions || regions.length === 0) {
      fetchRegions();
    }
  }, []);

  return (
    <ThresholdContext.Provider
      value={{
        regions,
        loading,
        fetchRegions,
        addOrUpdateRegion,
        editingRegion,
        setEditingRegion,
      }}
    >
      {children}
    </ThresholdContext.Provider>
  );
};

export default ThresholdProvider;
export const useThresholdContext = () => useContext(ThresholdContext);
