import React from "react";
import Card from "../card/Card";
import ChartCard from "../Charts/ChartCard";
import Table from "../table/Table";
import { useCarouselContext } from "../../contexts/CarouselContext";
import { useEffect } from "react";

const Home = () => {

  const { getAllUserData, userData, allItemCount,
    getAllItemData } = useCarouselContext();

  useEffect(() => {
    getAllUserData()
    getAllItemData();
  }, [])

  console.log(userData);


  return (
    <div className="container mx-auto md:mt-12 mt-6">
      <Card userCount={userData?.total_users} allItemCount={allItemCount} />
      <ChartCard />
      <div className="mt-12">
        <Table userData={userData} />
      </div>
    </div>
  );
};

export default Home;
