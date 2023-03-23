import React from "react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar/Navbar";
import InstructorDashBoard from "@/components/InstructorDashBoard2";
import Attainment from '@/components/chart/Attainment';
import Grad2Litter from '@/components/chart/Grad2Litter'
import StudentScatter from '@/components/chart/StudentScatter';
import CompetenciesBoxPlot from '@/components/chart/CompetenciesBoxPlot';
import CompetenciesQ from '@/components/chart/CompetenciesQ';
import CompetenciesAttainment from '@/components/chart/CompetenciesAttainment';
import CompetenciesStatisticsTable from '@/components/chart/CompetenciesStatisticsTable';
import CompetenciesBar from '@/components/chart/CompetenciesBar';
import CLOBar from '@/components/chart/CLOBar';
import CLOQ from '@/components/chart/CLOQ';
import CLOAttainment from '@/components/chart/CLOAttainment';
import CLOStatisticsTable from '@/components/chart/CLOStatisticsTable';
import CLOBoxPlot from '@/components/chart/CLOBoxPlot';
import CLOTable from '@/components/chart/CLOTable';
import GradHist from "@/components/chart/GradHist";
import getData from "@/components/chart/getData";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const courseReport = ({ cookies }) => {
  const router = useRouter();
  const [competence, setCompetences] = useState([]);
  const [avgValues, setAvgValues] = useState([]);
  const { courseID } = router.query;

  useEffect(() => {
    getCourse();
  }, []);

  const getCourse = async () => {
    try {
      const resp = await fetch(
        `${process.env.url}api/v1/courses/created-courses/${courseID}`,
        {
          headers: {
            Authorization: "Bearer " + cookies.token,
          },
        }
      );
      const jsonData = await resp.json();
      const competencesData = jsonData.data.avgCompetences.map(
        (comp) => comp.code
      );
      const avgValuesData = jsonData.data.avgCompetences.map(
        (comp) => comp.avg
      );
      setCompetences(competencesData);
      setAvgValues(avgValuesData);
    } catch (e) {}
  };

  return (
    <div className="flex flex-row w-screen h-screen mt-2">
      <div className="bg-sky-50 h-screen w-[80%] translate-x-[25%] flex flex-col justify-center items-center text-black ml-1 scrollbar-none">
        <div className="contentAddUser2 flex flex-col gap-10 overflow-auto">
          <Navbar cookies={cookies} />
          <div className="w-full h-full flex justify-center items-center">
            <Graph competence={competence} avgValues={avgValues} />
          </div>
        </div>
      </div>
    </div>
  );
};

const Graph = ({ competence, avgValues }) => {
  const data = {
    labels: competence,
    datasets: [
      {
        data: avgValues,
        backgroundColor: "aqua",
        borderColor: "black",
        borderWidth: 1,
      },
    ],
  };
  const options = {};
  return (
    <div className="flex w-2/3 h-2/3  ">
      <Bar data={data} options={options}></Bar>
    </div>
  );
};

export default courseReport;
