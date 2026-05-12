import React from "react";
import Nav from "../shared/components/Nav";
import { Outlet } from "react-router-dom";

const Applayout = () => {
  return (
    <>
      <Nav />
      <Outlet />
    </>
  );
};

export default Applayout;
