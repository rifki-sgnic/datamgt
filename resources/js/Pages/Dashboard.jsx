import { BreadcrumbsDefault } from "@/Components/Breadcrumbs";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
  ArchiveBoxIcon,
  BuildingOffice2Icon,
  CreditCardIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { Head } from "@inertiajs/react";
import { Option, Select, Typography } from "@material-tailwind/react";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useState } from "react";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard({
  auth,
  errors,
  sessions,
  data,
  branches,
  dataCabang,
}) {
  const [branchId, setBranchId] = useState(0);
  const [area, setArea] = useState("none");
  const [active, setActive] = useState("cabang");
  const [totalBranch, setTotalBranch] = useState(0);
  const [open, setOpen] = useState(false);
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      datalabels: {
        anchor: "end",
        align: "end",
        formatter: (value, context) => {
          return value; // Menampilkan nilai data di dalam bar chart
        },
      },
      legend: {
        position: "top",
      },
    },
    scales: {
      y: {
        display: false,
        grid: {
          display: false,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const columns = [
    { name: "Kantor Pusat (KP)", field: "kantor_pusat" },
    { name: "Kantor Cabang (KC)", field: "kantor_cabang" },
    { name: "Kantor Cabang Pembantu", field: "kantor_cabang_pembantu" },
    {
      name: "Kantor Fungsional Operasional (KFO)",
      field: "kantor_fungsional_operasional",
    },
    {
      name: "Kantor Fungsional Non Operasional (KFNO)",
      field: "kantor_fungsional_non_operasional",
    },
  ];

  const handleFilterBranch = (id) => {
    setBranchId(parseInt(id));
  };
  const handleFilterArea = (value) => {
    console.log(value);
    setArea(value);
  };

  const handleOpen = (value) => setOpen(!open);

  let labels = data.employee_positions.map(
    (position) => position.position_name
  );

  const test = {
    labels,
    datasets: [
      {
        label: "Jumlah Karyawan",
        data: labels.map((label) =>
          branchId
            ? data.employees.filter(
                (employee) =>
                  employee.employee_positions.position_name === label &&
                  employee.branch_id === branchId &&
                  (area === "none" || employee.branches.area === area)
              ).length
            : data.employees.filter(
                (employee) =>
                  employee.employee_positions.position_name === label &&
                  (area === "none" || employee.branches.area === area)
              ).length
        ),
        backgroundColor: "rgba(255, 56, 56  , 1)",
      },
    ],
  };
  labels = Object.keys(data.jumlah_cabang_alt);
  const branchChart = {
    labels,
    datasets: [
      {
        label: "Jumlah Cabang",
        data: labels.map(
          (label) =>
            data.jumlah_cabang_alt[label].filter(
              (branch) =>
                (branchId === 0 || branch.id === branchId) &&
                (area === "none" || branch.area === area)
            ).length
        ),
        backgroundColor: "rgba(255, 56, 56  , 1)",
      },
    ],
  };
  labels = Object.keys(data.jumlah_atm);
  const atmChart = {
    labels,
    datasets: [
      {
        label: "Jumlah ATM",
        data: labels.map(
          (label) =>
            data.jumlah_atm[label].filter(
              (branch) =>
                (branchId === 0 || branch.id === branchId) &&
                (area === "none" || branch.area === area)
            ).length
        ),
        backgroundColor: "rgba(255, 56, 56  , 1)",
      },
    ],
  };

  return (
    <AuthenticatedLayout auth={auth} errors={errors}>
      <Head title="Dashboard" />
      <BreadcrumbsDefault />
      <div className="p-4 border-2 border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
        <div className="flex flex-col mb-4 rounded">
          <div>{sessions.status && <Alert sessions={sessions} />}</div>
          <div className="flex flex-col">
            <h2 className="text-2xl font-semibold text-left w-80">Dashboard</h2>
            <div className="flex my-4 gap-x-4">
              <Select
                label="Area"
                value=""
                onChange={(e) => handleFilterArea(e)}
                className="bg-white"
              >
                {data.areas.map((area, index) => {
                  if (index === 0) {
                    return (
                      <Option key={0} value="none">
                        All
                      </Option>
                    );
                  }
                  return (
                    <Option key={index} value={`${area}`}>
                      {area}
                    </Option>
                  );
                })}
              </Select>
              <Select
                label="Branch"
                value=""
                onChange={(e) => handleFilterBranch(e)}
                className="bg-white"
              >
                {data.branches
                  .filter((branch) => area === "none" || branch.area === area)
                  .map((branch, index) => {
                    if (index === 0) {
                      return (
                        <Option key={0} value="0">
                          All
                        </Option>
                      );
                    }
                    return (
                      <Option key={index} value={`${branch.id}`}>
                        {branch.branch_code} - {branch.branch_name}
                      </Option>
                    );
                  })}
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-x-4">
            <div
              onClick={() => setActive("cabang")}
              className="flex items-center px-4 py-2 bg-white border cursor-pointer gap-x-4 border-slate-400 rounded-xl"
            >
              <BuildingOffice2Icon className="w-10 h-10" />
              <div className="flex flex-col">
                <Typography variant="h5">Jumlah Cabang</Typography>
                <Typography>
                  {branchId
                    ? data.branches.filter(
                        (branch) =>
                          (branch.id == branchId && area === "none") ||
                          branch.area === area
                      ).length
                    : data.branches.filter(
                        (branch) => area === "none" || branch.area === area
                      ).length}
                </Typography>
              </div>
            </div>
            <div
              onClick={() => setActive("atm")}
              className={`flex items-center px-4 py-2 border cursor-pointer gap-x-4 border-slate-400 rounded-xl ${
                active === "atm"
                  ? "hover:bg-slate-200 bg-slate-100"
                  : "bg-white hover:bg-slate-200"
              } transition-all duration-300`}
            >
              <CreditCardIcon className="w-10 h-10" />
              <div className="flex flex-col">
                <Typography variant="h5">Jumlah ATM</Typography>
                <Typography>
                  {Object.keys(data.jumlah_atm).reduce((acc, atm) => {
                    return (
                      acc +
                      data.jumlah_atm[atm].filter(
                        (branch) =>
                          (branchId === 0 || branch.id === branchId) &&
                          (area === "none" || branch.area === area)
                      ).length
                    );
                  }, 0)}
                </Typography>
              </div>
            </div>
            <div
              onClick={() => setActive("karyawan")}
              className={`flex items-center px-4 py-2 border cursor-pointer gap-x-4 border-slate-400 rounded-xl ${
                active === "karyawan"
                  ? "hover:bg-slate-200 bg-slate-100"
                  : "bg-white hover:bg-slate-200"
              } transition-all duration-300`}
            >
              <UserGroupIcon className="w-10 h-10" />
              <div className="flex flex-col">
                <Typography variant="h5">Jumlah Karyawan</Typography>
                <Typography>
                  {branchId
                    ? data.jumlahKaryawan.filter(
                        (employee) =>
                          employee.branch_id == branchId &&
                          (area === "none" || employee.branches.area === area)
                      ).length
                    : data.jumlahKaryawan.filter(
                        (employee) =>
                          area === "none" || employee.branches.area === area
                      ).length}
                </Typography>
              </div>
            </div>
            <div
              onClick={() => setActive("asset")}
              className={`flex items-center px-4 py-2 border cursor-pointer gap-x-4 border-slate-400 rounded-xl ${
                active === "asset"
                  ? "hover:bg-slate-200 bg-slate-100"
                  : "bg-white hover:bg-slate-200"
              } transition-all duration-300`}
            >
              <ArchiveBoxIcon className="w-10 h-10" />
              <div className="flex flex-col">
                <Typography variant="h5">Jumlah Asset</Typography>
                <Typography>
                  {
                    data.assets.filter(
                      (asset) =>
                        (branchId === 0 || asset.branch_id == branchId) &&
                        (area === "none" || asset.branches.area == area)
                    ).length
                  }
                </Typography>
              </div>
            </div>
          </div>
          {active === "cabang" && (
            <div className="pt-4 w-full h-[200px] grid grid-cols-2 gap-4">
              <div className="cols-span-1">
                <Bar
                  options={options}
                  data={branchChart}
                  plugins={[ChartDataLabels]}
                />
              </div>
              <div className="cols-span-1">
                {/* Tabel Cabang */}
                <table className={`text-sm leading-3 bg-white w-full`}>
                  <thead className="sticky top-0 border-b-2 table-fixed border-slate-200">
                    <tr className="[&>th]:p-2 bg-slate-100">
                      <th className="text-center">Tipe Cabang</th>
                      <th className="text-center">Jumlah</th>
                    </tr>
                  </thead>
                  <tbody className="overflow-y-auto">
                    <tr className="[&>td]:p-2 hover:bg-slate-200 border-b border-slate-200 divide-x divide-slate-200">
                      <td>Kantor Pusat</td>
                      <td>1</td>
                    </tr>
                    {Object.keys(data.jumlah_cabang).map((cabang) => {
                      return (
                        <tr className="[&>td]:p-2 hover:bg-slate-200 border-b border-slate-200 divide-x divide-slate-200">
                          <td>{cabang}</td>
                          <td>{data.jumlah_cabang[cabang].length}</td>
                        </tr>
                      );
                    })}
                    <tr className="[&>td]:p-2 hover:bg-slate-200 border-b border-slate-200 divide-x divide-slate-200">
                      <td>
                        <strong>Total</strong>
                      </td>
                      <td>
                        <strong>
                          {Object.keys(data.jumlah_cabang).reduce(
                            (acc, item) => {
                              return acc + data.jumlah_cabang[item].length;
                            },
                            1
                          )}
                        </strong>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tabel Karyawan */}
          {active === "karyawan" && (
            <div className="pt-4 w-full h-[200px] grid grid-cols-2 gap-4">
              <div className="cols-span-1">
                <Bar
                  options={options}
                  data={test}
                  plugins={[ChartDataLabels]}
                />
              </div>

              <div className="cols-span-1">
                <table className={`text-sm leading-3 bg-white w-full`}>
                  <thead className="sticky top-0 border-b-2 table-fixed border-slate-200">
                    <tr className="[&>th]:p-2 bg-slate-100">
                      <th className="text-center">Jabatan</th>
                      <th className="text-center">Jumlah</th>
                    </tr>
                  </thead>
                  <tbody className="overflow-y-auto">
                    {data.employee_positions.map((position) => (
                      <tr className="[&>td]:p-2 hover:bg-slate-200 border-b border-slate-200 divide-x divide-slate-200">
                        <td className="text-center">
                          {position.position_name}
                        </td>
                        <td className="text-center">
                          {
                            data.employees
                              .filter(
                                (employee) =>
                                  employee.employee_positions.position_name ===
                                  position.position_name
                              )
                              .filter(
                                (employee) =>
                                  area === "none" ||
                                  employee.branches.area === area
                              ).length
                          }
                        </td>
                      </tr>
                    ))}
                    <tr className="[&>td]:p-2 hover:bg-slate-200 border-b border-slate-200 divide-x divide-slate-200">
                      <td className="text-center">
                        <strong>Total</strong>
                      </td>
                      <td className="text-center">
                        <strong>
                          {
                            data.employees.filter(
                              (employee) =>
                                area === "none" ||
                                employee.branches.area === area
                            ).length
                          }
                        </strong>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tabel ATM */}
          {active === "atm" && (
            <div className="pt-4 w-full h-[200px] grid grid-cols-2 gap-4">
              <div className="cols-span-1">
                <Bar
                  options={options}
                  data={atmChart}
                  plugins={[ChartDataLabels]}
                />
              </div>
              <div className="cols-span-1">
                <table className={`text-sm leading-3 bg-white w-full`}>
                  <thead className="sticky top-0 border-b-2 table-fixed border-slate-200">
                    <tr className="[&>th]:p-2 bg-slate-100">
                      <th className="text-center">Fungsi</th>
                      <th className="text-center">Jumlah</th>
                    </tr>
                  </thead>
                  <tbody className="overflow-y-auto">
                    {Object.keys(data.jumlah_atm).map((atm) => (
                      <tr className="[&>td]:p-2 hover:bg-slate-200 border-b border-slate-200 divide-x divide-slate-200">
                        <td className="text-center">{atm}</td>
                        <td className="text-center">
                          {
                            data.jumlah_atm[atm].filter(
                              (branch) =>
                                (branchId === 0 || branch.id === branchId) &&
                                (area === "none" || branch.area === area)
                            ).length
                          }
                        </td>
                      </tr>
                    ))}

                    <tr className="[&>td]:p-2 hover:bg-slate-200 border-b border-slate-200 divide-x divide-slate-200">
                      <td className="text-center">
                        <strong>Total</strong>
                      </td>
                      <td className="text-center">
                        <strong>
                          {Object.keys(data.jumlah_atm).reduce((acc, atm) => {
                            return (
                              acc +
                              data.jumlah_atm[atm].filter(
                                (branch) =>
                                  (branchId === 0 || branch.id === branchId) &&
                                  (area === "none" || branch.area === area)
                              ).length
                            );
                          }, 0)}
                        </strong>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Jumlah Asset */}
          {active === "asset" && (
            <table className={`text-sm leading-3 bg-white mt-2`}>
              <thead className="sticky border-b-2 table-fixed top-16 border-slate-200">
                <tr className="[&>th]:p-2 bg-slate-100 border border-slate-200 divide-x divide-slate-200">
                  <th
                    className="text-center border-r border-slate-200"
                    rowSpan={2}
                    colSpan={2}
                  >
                    Lokasi
                  </th>
                  <th className="text-center" colSpan={4}>
                    Kategori A (Depresiasi)
                  </th>
                  <th className="text-center" colSpan={4}>
                    Kategori B (Non-Depresiasi)
                  </th>
                  {/* Lokasi: Kantor Pusat, Cabang */}
                  {/* Kategori A (Asset Depresiasi) */}
                  {/* Kategori A (Asset Non-Depresiasi) */}
                </tr>
                <tr className="[&>th]:p-2 bg-slate-100 border border-slate-200 divide-x divide-slate-200">
                  <th className="text-center">Item</th>
                  <th className="text-center">Nilai Perolehan</th>
                  <th className="text-center">Penyusutan</th>
                  <th className="text-center">Net Book Value</th>
                  <th className="text-center">Item</th>
                  <th className="text-center">Nilai Perolehan</th>
                </tr>
              </thead>
              <tbody className="overflow-y-auto">
                <tr className="[&>td]:p-2 hover:bg-slate-200 border-b divide-x divide-slate-200 border-slate-200">
                  <td colSpan={2}>Kantor Pusat</td>
                  {data.summary_assets["Kantor Pusat"] &&
                    Object.entries(data.summary_assets["Kantor Pusat"]).map(
                      ([key, item]) =>
                        key === "Depre" ? (
                          <>
                            <td className="text-center">{item.jumlah_item}</td>
                            <td className="text-right">
                              {item.nilai_perolehan.toLocaleString("id-ID")}
                            </td>

                            <td className="text-right">
                              {item.penyusutan.toLocaleString("id-ID")}
                            </td>

                            {item.net_book_value > 0 && (
                              <td className="text-right">
                                {item.net_book_value.toLocaleString("id-ID")}
                              </td>
                            )}
                          </>
                        ) : (
                          <>
                            <td className="text-center">{item.jumlah_item}</td>
                            <td className="text-center">
                              {item.nilai_perolehan}
                            </td>
                          </>
                        )
                    )}
                </tr>

                <tr
                  onClick={handleOpen}
                  className="[&>td]:p-2 cursor-pointer font-bold text-cyan-600 hover:bg-slate-200 border-b divide-x divide-slate-200 border-slate-200"
                >
                  <td colSpan={2}>Kantor Cabang</td>

                          <td className="text-center">
                            {
                              data.assets.filter(
                                (item) =>
                                  item.branch_name !== "Kantor Pusat" &&
                                  item.category === "Depre"
                              ).length
                            }
                          </td>
                          <td className="text-right">{
                            data.assets.filter(
                              (item) =>
                                item.branch_name !== "Kantor Pusat" &&
                                item.category === "Depre"
                            ).reduce((total, item) => {
                              return total + item.asset_cost
                            }, 0).toLocaleString('id-ID')
                          }</td>

                          <td className="text-center">{data.assets
                              .filter(
                                (item) =>
                                  item.branch_name !== "Kantor Pusat" &&
                                  item.category === "Depre"
                              )
                              .reduce((total, item) => {
                                return total + item.accum_depre;
                              }, 0).toLocaleString('id-ID')}</td>

                          <td className="text-center">
                            {data.assets
                              .filter(
                                (item) =>
                                  item.branch_name !== "Kantor Pusat" &&
                                  item.category === "Depre"
                              )
                              .reduce((total, item) => {
                                return total + item.net_book_value;
                              }, 0).toLocaleString('id-ID')}
                          </td>


                          <td className="text-center">
                            {
                              data.assets.filter(
                                (item) =>
                                  item.branch_name !== "Kantor Pusat" &&
                                  item.category === "Non-Depre"
                              ).length
                            }
                          </td>
                          <td className="text-center">

                          </td>


                </tr>

                {open &&
                  Object.keys(data.summary_assets).map(
                    (lokasi, index) =>
                      lokasi !== "Kantor Pusat" && (
                        <tr className="[&>td]:p-2 hover:bg-slate-200 border-b divide-x divide-slate-200 border-slate-200">
                          <td key={index} colSpan={2}>
                            {`> ${lokasi}`}
                          </td>
                          {Object.entries(data.summary_assets[lokasi]).map(
                            ([key, item]) =>
                              key === "Depre" ? (
                                <>
                                  <td className="text-center">
                                    {item.jumlah_item}
                                  </td>
                                  <td className="text-right">
                                    {item.nilai_perolehan.toLocaleString(
                                      "id-ID"
                                    )}
                                  </td>

                                  <td className="text-right">
                                    {item.penyusutan.toLocaleString("id-ID")}
                                  </td>

                                  {item.net_book_value > 0 && (
                                    <td className="text-right">
                                      {item.net_book_value.toLocaleString(
                                        "id-ID"
                                      )}
                                    </td>
                                  )}
                                </>
                              ) : (
                                <>
                                  <td className="text-center">
                                    {item.jumlah_item}
                                  </td>
                                  <td className="text-center">
                                    {item.nilai_perolehan}
                                  </td>
                                </>
                              )
                          )}
                        </tr>
                      )
                  )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
