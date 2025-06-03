import React from "react";
import Card from "../card/Card";
import ChartCard from "../Charts/ChartCard";
import Table from "../table/Table";

const Home = () => {
  return (
    <div className="container mx-auto md:mt-12 mt-6">
      <Card />
      <ChartCard />
      <div className="mt-12">
        <Table />
      </div>
    </div>
  );
};

export default Home;
