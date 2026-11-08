"use client";

import React from "react";
import dynamic from "next/dynamic";
import { LearningOrbitPoster } from "./LearningOrbitPoster";

export const LearningOrbitHero = dynamic(
  () => import("./LearningOrbitHero").then((m) => m.LearningOrbitHero),
  {
    ssr: false,
    loading: () => <LearningOrbitPoster />,
  }
);

