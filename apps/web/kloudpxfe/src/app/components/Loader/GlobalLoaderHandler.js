"use client";
import { useEffect } from "react";
import { useLoading } from "@/app/contexts/LoadingContext";
import { setAxiosGlobalLoading } from "@/app/utils/axios";
import DashboardLoading from "./DashboardLoader";

const GlobalLoaderHandler = () => {
  const { loading, setLoading } = useLoading();

  useEffect(() => {
    setAxiosGlobalLoading(setLoading);
  }, [setLoading]);

  return loading ? <DashboardLoading /> : null;
};

export default GlobalLoaderHandler;
