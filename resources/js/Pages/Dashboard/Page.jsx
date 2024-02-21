import { BreadcrumbsDefault } from "@/Components/Breadcrumbs";
import DataTable from "@/Components/DataTable";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { tabState } from "@/Utils/TabState";
import {
  ArchiveBoxIcon,
  BuildingOffice2Icon,
  CreditCardIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { Head } from "@inertiajs/react";
import { Option, Select } from "@material-tailwind/react";
import { useState } from "react";
import BarChart from "./Partials/BarChart";
import CardMenu from "./Partials/CardMenu";
import Tabs from "@/Components/Tabs";

export default function Dashboard({ auth, errors, sessions, data }) {
  const [branchId, setBranchId] = useState(0);
  const [area, setArea] = useState("none");
  const { active, params, handleTabChange } = tabState([
    "branch",
    "atm",
    "employee",
    "asset",
  ]);
  const [open, setOpen] = useState(false);
  const handleFilterBranch = (id) => setBranchId(parseInt(id));
  const handleFilterArea = (value) => setArea(value);
  const handleOpen = () => setOpen(!open);
  const groupBy = (array, key) =>
    array.reduce((result, item) => {
      // Extract the value for the current key
      const keyValue = item[key];

      // If the key doesn't exist in the result object, create it with an empty array
      if (!result[keyValue]) {
        result[keyValue] = [];
      }

      // Push the current item to the array associated with the key
      result[keyValue].push(item);

      return result;
    }, {});
  const positionColumns = [
    {
      name: "Jabatan",
      field: "position_name",
    },
    {
      name: "Jumlah",
      field: "jumlah_employee",
    },
  ];

  const cardMenus = [
    {
      label: "Jumlah Cabang",
      data,
      type: "branch",
      Icon: BuildingOffice2Icon,
      active,
      onClick: () => handleTabChange("branch"),
      branchState: branchId,
      areaState: area,
      color: "blue",
    },
    {
      label: "Jumlah ATM",
      data,
      type: "atm",
      Icon: CreditCardIcon,
      active,
      onClick: () => handleTabChange("atm"),
      branchState: branchId,
      areaState: area,
      color: "green",
    },
    {
      label: "Jumlah Karyawan",
      data,
      type: "employee",
      Icon: UserGroupIcon,
      active,
      onClick: () => handleTabChange("employee"),
      branchState: branchId,
      areaState: area,
      color: "orange",
    },
    {
      label: "Jumlah Asset",
      data,
      type: "asset",
      Icon: ArchiveBoxIcon,
      active,
      onClick: () => handleTabChange("asset"),
      branchState: branchId,
      areaState: area,
      color: "purple",
    },
    {
      label: "Perjalanan Dinas",
      data,
      type: "perjalanan_dinas",
      Icon: ArchiveBoxIcon,
      active,
      onClick: () => handleTabChange("perjalanan_dinas"),
      branchState: branchId,
      areaState: area,
      color: "purple",
    },
    {
      label: "Alih Daya",
      data,
      type: "alih_daya",
      Icon: ArchiveBoxIcon,
      active,
      onClick: () => handleTabChange("alih_daya"),
      branchState: branchId,
      areaState: area,
      color: "purple",
    },
    {
      label: "KDO",
      data,
      type: "kdo",
      Icon: ArchiveBoxIcon,
      active,
      onClick: () => handleTabChange("kdo"),
      branchState: branchId,
      areaState: area,
      color: "purple",
    },
    {
      label: "Vendor",
      data,
      type: "vendor",
      Icon: ArchiveBoxIcon,
      active,
      onClick: () => handleTabChange("vendor"),
      branchState: branchId,
      areaState: area,
      color: "purple",
    },
  ];

  const tabsMenu = [
    {
      label: "Jumlah Cabang",
      value: "jumlah-cabang",
    },
    {
      label: "Jumlah Atm",
      value: "jumlah-atm",
    },
    {
      label: "Jumlah Karyawan",
      value: "jumlah-karyawan",
    },
    {
      label: "Jumlah Asset",
      value: "jumlah-asset",
    },
    {
      label: "Perjalanan Dinas",
      value: "perdin",
    },
    {
      label: "Alih Daya",
      value: "alih-daya",
    },
    {
      label: "KDO",
      value: "kdo",
    },
    {
      label: "Vendor",
      value: "vendor",
    },
  ];

  console.log(data);
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
                  return area === "All" ? (
                    <Option key={index} value="none">
                      {area}
                    </Option>
                  ) : (
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
                {data.list_branches
                  .filter((branch) => area === "none" || branch.area === area)
                  .map((branch, index) => {
                    return branch.branch_code === "none" ? (
                      <Option key={index} value="0">
                        {branch.branch_name}
                      </Option>
                    ) : (
                      <Option key={index} value={`${branch.id} `}>
                        {branch.branch_code} - {branch.branch_name}
                      </Option>
                    );
                  })}
              </Select>
            </div>
          </div>
          {/* <Tabs data={tabsMenu} /> */}
          <div className="grid grid-cols-8 p-1 mb-2 gap-x-2">
            {cardMenus.map((menu, index) => (
              <CardMenu
                key={index}
                label={menu.label}
                data={menu.data}
                type={menu.type}
                Icon={menu.Icon}
                active={active}
                onClick={menu.onClick}
                branchState={menu.branchState}
                areaState={menu.areaState}
                color={menu.color}
                tab={true}
              />
            ))}
          </div>
          {active === "branch" && (
            <div className="pt-4 w-full h-[300px] grid grid-cols-2 gap-4">
              <div className="cols-span-1">
                <BarChart
                  label="Jumlah Cabang"
                  type="branch"
                  data={data}
                  branchState={branchId}
                  areaState={area}
                />
              </div>
              <div className="cols-span-1">
                {/* Tabel Cabang */}
                <table className={`text-sm leading-3 bg-white w-full`}>
                  <thead className="sticky top-0 border-b-2 table-fixed border-slate-200">
                    <tr className="[&>th]:p-2 bg-slate-100">
                      <th className="text-center">Tipe Cabang</th>
                      <th className="text-center">Milik</th>
                      <th className="text-center">Sewa</th>
                      <th className="text-center">Pinjam Pakai</th>
                      <th className="text-center">Jumlah</th>
                    </tr>
                  </thead>
                  <tbody className="overflow-y-auto">
                    {Object.keys(data.jumlah_cabang).map((cabang, index) => {
                      return (
                        <tr
                          key={index}
                          className="[&>td]:p-2 hover:bg-slate-200 border-b border-slate-200 divide-x divide-slate-200"
                        >
                          <td>{cabang}</td>
                          <td>
                            {
                              data.jumlah_cabang[cabang].filter(
                                (data) => data.status === "Milik"
                              ).length
                            }
                          </td>
                          <td>
                            {
                              data.jumlah_cabang[cabang].filter(
                                (data) => data.status === "Sewa"
                              ).length
                            }
                          </td>
                          <td>
                            {
                              data.jumlah_cabang[cabang].filter(
                                (data) => data.status === "Pinjam Pakai"
                              ).length
                            }
                          </td>

                          <td>{data.jumlah_cabang[cabang].length}</td>
                        </tr>
                      );
                    })}
                    <tr className="[&>td]:p-2 hover:bg-slate-200 border-b border-slate-200 divide-x divide-slate-200">
                      <td colSpan={4}>
                        <strong>Total</strong>
                      </td>
                      <td>
                        <strong>
                          {Object.keys(data.jumlah_cabang).reduce(
                            (acc, item) => {
                              return acc + data.jumlah_cabang[item].length;
                            },
                            0
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
          {active === "employee" && (
            <div className="w-full pt-4">
              <div className="relative">
                <BarChart
                  label="Jumlah Karyawan"
                  type="employee"
                  data={data}
                  branchState={branchId}
                  areaState={area}
                  height={950}
                />
              </div>
              <div className="overflow-y-auto h-[450px]">
                <DataTable
                  configuration={false}
                  fetchUrl={"/api/dashboard/employee-positions"}
                  columns={positionColumns}
                  fixed={true}
                />
              </div>
            </div>
          )}

          {/* Tabel ATM */}
          {active === "atm" && (
            <div className="pt-4 w-full h-[300px] grid grid-cols-2 gap-4">
              <div className="cols-span-1">
                <BarChart
                  label="Jumlah ATM"
                  type="atm"
                  data={data}
                  branchState={branchId}
                  areaState={area}
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
                  {Object.values(data.summary_assets)
                    .filter((asset) => asset.branch_name === "Kantor Pusat")
                    .map((asset) => (
                      <>
                        <td className="text-center">
                          {asset.depre_jumlah_item}
                        </td>
                        <td className="text-right">
                          {asset.depre_nilai_perolehan.toLocaleString("id-ID")}
                        </td>

                        <td className="text-right">
                          {asset.penyusutan.toLocaleString("id-ID")}
                        </td>

                        {asset.net_book_value > 0 && (
                          <td className="text-right">
                            {asset.net_book_value.toLocaleString("id-ID")}
                          </td>
                        )}
                        <td className="text-center">
                          {asset.non_depre_jumlah_item}
                        </td>
                        <td className="text-right">
                          {asset.non_depre_nilai_perolehan.toLocaleString(
                            "id-ID"
                          )}
                        </td>
                      </>
                    ))}
                </tr>

                <tr
                  onClick={handleOpen}
                  className="[&>td]:p-2 cursor-pointer font-bold text-cyan-600 hover:bg-slate-200 border-b divide-x divide-slate-200 border-slate-200"
                >
                  <td colSpan={2}>Kantor Cabang</td>

                  <td className="text-center">
                    {Object.values(data.summary_assets)
                      .filter((asset) => asset.branch_name !== "Kantor Pusat")
                      .reduce((total, asset) => {
                        return total + asset.depre_jumlah_item;
                      }, 0)}
                  </td>
                  <td className="text-right">
                    {Object.values(data.summary_assets)
                      .filter((asset) => asset.branch_name !== "Kantor Pusat")
                      .reduce((total, asset) => {
                        return total + asset.depre_nilai_perolehan;
                      }, 0)
                      .toLocaleString("id-ID")}
                  </td>

                  <td className="text-right">
                    {Object.values(data.summary_assets)
                      .filter((asset) => asset.branch_name !== "Kantor Pusat")
                      .reduce((total, asset) => {
                        return total + asset.penyusutan;
                      }, 0)
                      .toLocaleString("id-ID")}
                  </td>

                  <td className="text-right">
                    {Object.values(data.summary_assets)
                      .filter((asset) => asset.branch_name !== "Kantor Pusat")
                      .reduce((total, asset) => {
                        return total + asset.net_book_value;
                      }, 0)
                      .toLocaleString("id-ID")}
                  </td>

                  <td className="text-center">
                    {Object.values(data.summary_assets)
                      .filter((asset) => asset.branch_name !== "Kantor Pusat")
                      .reduce((total, asset) => {
                        return total + asset.non_depre_jumlah_item;
                      }, 0)}
                  </td>

                  <td className="text-right">
                    {Object.values(data.summary_assets)
                      .filter((asset) => asset.branch_name !== "Kantor Pusat")
                      .reduce((total, asset) => {
                        return total + asset.non_depre_nilai_perolehan;
                      }, 0)
                      .toLocaleString("id-ID")}
                  </td>
                </tr>

                {open &&
                  Object.values(data.summary_assets)
                    .filter((asset) => asset.branch_name !== "Kantor Pusat")
                    .map((asset) => (
                      <tr className="[&>td]:p-2 hover:bg-slate-200 border-b divide-x divide-slate-200 border-slate-200">
                        <td key={asset.branch_code} colSpan={2}>
                          {`> ${asset.branch_name} `}
                        </td>

                        <td className="text-center">
                          {asset.depre_jumlah_item}
                        </td>
                        <td className="text-right">
                          {asset.depre_nilai_perolehan.toLocaleString("id-ID")}
                        </td>

                        <td className="text-right">
                          {asset.penyusutan.toLocaleString("id-ID")}
                        </td>

                        {asset.net_book_value > 0 && (
                          <td className="text-right">
                            {asset.net_book_value.toLocaleString("id-ID")}
                          </td>
                        )}

                        <td className="text-center">
                          {asset.non_depre_jumlah_item}
                        </td>
                        <td className="text-right">
                          {asset.non_depre_nilai_perolehan.toLocaleString(
                            "id-ID"
                          )}
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          )}
          {/* Tabel Scoring Procurement */}
          {active === "gap_scorings" && (
            <table className={`text-sm leading-3 bg-white mt-2`}>
              <thead className="sticky border-b-2 table-fixed top-16 border-slate-200">
                <tr className="[&>th]:p-2 bg-slate-100 border border-slate-200 divide-x divide-slate-200">
                  <th
                    className="text-center border-r border-slate-200"
                    rowSpan={3}
                    colSpan={2}
                  >
                    Scoring Schedule
                  </th>
                  <th className="text-center" rowSpan={3} colSpan={2}>
                    Jumlah Vendor
                  </th>
                  <th className="text-center" colSpan={7}>
                    Type Scoring
                  </th>
                </tr>
                <tr className="[&>th]:p-2 bg-slate-100 border border-slate-200 divide-x divide-slate-200">
                  <th className="text-center" colSpan={2}>
                    Assessment (PKS)
                  </th>
                  <th className="text-center" colSpan={2}>
                    Project (Non PKS)
                  </th>
                  <th className="text-center" colSpan={3}>
                    SLA
                  </th>
                </tr>
                <tr className="[&>th]:p-2 bg-slate-100 border border-slate-200 divide-x divide-slate-200">
                  <th className="text-center">Done</th>
                  <th className="text-center">On Progress</th>
                  <th className="text-center">Done</th>
                  <th className="text-center">On Progress</th>
                  <th className="text-center">YES</th>
                  <th className="text-center">NO</th>
                  <th className="text-center">On Progress</th>
                </tr>
              </thead>
              <tbody className="overflow-y-auto">
                {Object.entries(
                  groupBy(data.gap_scorings, "schedule_scoring")
                ).map(([key, scoring]) => (
                  <tr className="[&>td]:p-2 hover:bg-slate-200 border-b divide-x divide-slate-200 border-slate-200">
                    <td colSpan={2} className="text-center">
                      {key}
                    </td>
                    <td className="text-center" colSpan={2}>
                      {scoring.length}
                    </td>

                    <td className="text-center">
                      {
                        scoring.filter(
                          (item) =>
                            item.status_pekerjaan === "Done" &&
                            item.type === "Assessment"
                        ).length
                      }
                    </td>
                    <td className="text-center">
                      {
                        scoring.filter(
                          (item) =>
                            item.status_pekerjaan === "On Progress" &&
                            item.type === "Assessment"
                        ).length
                      }
                    </td>

                    <td className="text-center">
                      {
                        scoring.filter(
                          (item) =>
                            item.status_pekerjaan === "Done" &&
                            item.type === "Project"
                        ).length
                      }
                    </td>
                    <td className="text-center">
                      {
                        scoring.filter(
                          (item) =>
                            item.status_pekerjaan === "On Progress" &&
                            item.type === "Project"
                        ).length
                      }
                    </td>
                    <td className="text-center">
                      {
                        scoring.filter(
                          (item) =>
                            item.meet_the_sla === 1 && item.type === "Project"
                        ).length
                      }
                    </td>
                    <td className="text-center">
                      {
                        scoring.filter(
                          (item) =>
                            item.meet_the_sla === 0 && item.type === "Project"
                        ).length
                      }
                    </td>
                  </tr>
                ))}
                <tr className="[&>td]:p-2 hover:bg-slate-200 border-b divide-x divide-slate-200 border-slate-200">
                  <td colSpan={2} className="font-bold text-center">
                    Total
                  </td>
                  <td colSpan={2} className="font-bold text-center">
                    {data.gap_scorings.length}
                  </td>
                  <td className="font-bold text-center">
                    {
                      data.gap_scorings.filter(
                        (item) =>
                          item.status_pekerjaan === "Done" &&
                          item.type === "Assessment"
                      ).length
                    }
                  </td>
                  <td className="font-bold text-center">
                    {
                      data.gap_scorings.filter(
                        (item) =>
                          item.status_pekerjaan === "On Progress" &&
                          item.type === "Assessment"
                      ).length
                    }
                  </td>
                  <td className="font-bold text-center">
                    {
                      data.gap_scorings.filter(
                        (item) =>
                          item.status_pekerjaan === "Done" &&
                          item.type === "Project"
                      ).length
                    }
                  </td>
                  <td className="font-bold text-center">
                    {
                      data.gap_scorings.filter(
                        (item) =>
                          item.status_pekerjaan === "On Progress" &&
                          item.type === "Project"
                      ).length
                    }
                  </td>
                  <td className="font-bold text-center">
                    {
                      data.gap_scorings.filter(
                        (item) =>
                          item.meet_the_sla === 1 && item.type === "Project"
                      ).length
                    }
                  </td>
                  <td className="font-bold text-center">
                    {
                      data.gap_scorings.filter(
                        (item) =>
                          item.meet_the_sla === 0 && item.type === "Project"
                      ).length
                    }
                  </td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
