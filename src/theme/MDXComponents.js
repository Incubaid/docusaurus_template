import React from "react";
import EChart from "@site/src/components/EChart";
import MDXComponents from "@theme-original/MDXComponents";

export default {
  ...MDXComponents,
  EChart, // Register EChart globally for MDX
};