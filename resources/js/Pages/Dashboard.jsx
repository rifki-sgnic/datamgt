import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { BuildingOffice2Icon } from "@heroicons/react/24/outline";
import { UserGroupIcon } from "@heroicons/react/24/solid";
import { Head } from "@inertiajs/react";
import { Typography } from "@material-tailwind/react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard({ auth, errors, sessions, data }) {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Jumlah Karyawan BSS",
      },
    },
  };

  const labels = data.employee_positions.map(
    (position) => position.position_name
  );

  const test = {
    labels,
    datasets: [
      {
        label: "Karyawan",
        data: labels.map(
          (label) =>
            data.employees.filter(
              (employee) => employee.employee_positions.position_name === label
            ).length
        ),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  console.log(data);
  return (
    <AuthenticatedLayout auth={auth} errors={errors}>
      <Head title="Dashboard" />
      <div className="p-4 border-2 border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
        <div className="flex flex-col mb-4 rounded">
          <div>{sessions.status && <Alert sessions={sessions} />}</div>
          <h2 className="mb-4 text-2xl font-semibold text-center">Dashboard</h2>
          <div className="grid grid-cols-4 gap-x-4">
            <div className="flex items-center px-4 py-2 bg-white border gap-x-4 border-slate-400 rounded-xl">
              <BuildingOffice2Icon className="w-10 h-10" />
              <div className="flex flex-col">
                <Typography variant="h5">Jumlah Cabang</Typography>
                <Typography>{data.jumlahCabang}</Typography>
              </div>
            </div>
            <div className="flex items-center px-4 py-2 bg-white border gap-x-4 border-slate-400 rounded-xl">
              <BuildingOffice2Icon className="w-10 h-10" />
              <div className="flex flex-col">
                <Typography variant="h5">
                  Jumlah Layanan ATM (24 Jam)
                </Typography>
                <Typography>{data.jumlahATM24Jam}</Typography>
              </div>
            </div>
            <div className="flex items-center px-4 py-2 bg-white border gap-x-4 border-slate-400 rounded-xl">
              <UserGroupIcon className="w-10 h-10" />
              <div className="flex flex-col">
                <Typography variant="h5">Jumlah Karyawan</Typography>
                <Typography>{data.jumlahKaryawan}</Typography>
              </div>
            </div>
            <div className="flex items-center px-4 py-2 bg-white border gap-x-4 border-slate-400 rounded-xl">
              <UserGroupIcon className="w-10 h-10" />
              <div className="flex flex-col">
                <Typography variant="h5">Jumlah BSO</Typography>
                <Typography>{data.jumlahKaryawanBSO}</Typography>
              </div>
            </div>
          </div>
          <Bar options={options} data={test} />
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
