import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import { debounce } from "lodash";
import { useEffect, useRef, useState } from "react";
import Paginator from "./Paginator";

const SORT_ASC = "asc";
const SORT_DESC = "desc";

export default function DataTable({
  columns = { name: "", value: "", field: "", type: "", render: (any) => any },
  fetchUrl,
  refreshUrl = false,
  dataArr,
  reverseArray = false,
}) {
  const [data, setData] = useState([]);
  const [perPage, setPerPage] = useState(15);
  const [sortColumn, setSortColumn] = useState(columns[0].field);
  const [sortOrder, setSortOrder] = useState("asc");
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  const [loading, setLoading] = useState(false);

  const handleSort = (column) => {
    if (column === sortColumn) {
      sortOrder === SORT_ASC ? setSortOrder(SORT_DESC) : setSortOrder(SORT_ASC);
    } else {
      setSortColumn(column);
      setSortOrder(SORT_ASC);
    }
  };

  const handleSearch = useRef(
    debounce((query) => {
      setSearch(query);
      setCurrentPage(1);
      setSortOrder(SORT_ASC);
      setSortColumn(columns[0].name);
    }, 500)
  ).current;

  const handlePerPage = (perPage) => {
    setCurrentPage(1);
    setPerPage(perPage);
  };

  const fetchData = async () => {
    setLoading(true);
    const params = {
      page: currentPage,
      perpage: perPage,
      sort_field: sortColumn,
      sort_order: sortOrder,
      search,
    };

    if (fetchUrl) {
      const { data } = await axios.get(fetchUrl, { params });
      console.log(data);
      setData(data.data instanceof Object ? Object.values(data.data) : data.data);
      setPagination(data.meta ? data.meta : data);
      setLoading(false);
    }

    if (dataArr) {
      console.log(dataArr);
      setData(dataArr);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [perPage, sortColumn, sortOrder, search, currentPage, refreshUrl]);

  const getNestedValue = (obj, field) => {
    const keys = field.split(".");
    let value = obj;

    for (const key of keys) {
      if (value !== null && value.hasOwnProperty(key)) {
        value = value[key];
      } else {
        value = null;
        break;
      }
    }

    return value;
  };

  const convertDate = (date) => {
    if (date === null) return "-";
    const d = new Date(date);
    const options = {
      day: "numeric",
      month: "short",
      year: "numeric",
    };
    return d.toLocaleDateString("id-ID", options);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-x-2">
          Show
          <select
            name="perpage"
            id="perpage"
            className="rounded-lg form-select"
            value={perPage}
            onChange={(e) => handlePerPage(e.target.value)}
          >
            <option value="15">15</option>
            <option value="30">30</option>
            <option value="45">45</option>
            <option value="60">60</option>
          </select>
          entries
        </div>
        <div>
          <div className="flex items-center gap-2">
            <InputLabel htmlFor="search">Search : </InputLabel>
            <TextInput
              type="search"
              name="search"
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="relative overflow-x-auto border-2 rounded-lg border-slate-200">
        <table className="w-full text-sm leading-3">
          <thead className="border-b-2 border-slate-200">
            <tr className="[&>th]:p-2 bg-slate-100">
              <th className="text-center">No</th>
              {columns.map((column, i) => (
                <th key={column.name}>
                  {column.sortable === true ? (
                    <div
                      className="cursor-pointer hover:underline"
                      onClick={(e) => handleSort(column.field)}
                    >
                      <div className="flex items-center gap-x-1">
                        {column.name}
                        <span className="flex flex-col gap-y-1">
                          <ChevronUpIcon
                            className={`${
                              sortOrder === SORT_ASC &&
                              column.field === sortColumn
                                ? "text-slate-900"
                                : "text-gray-400"
                            } w-3 h-3`}
                          />
                          <ChevronDownIcon
                            className={`${
                              sortOrder === SORT_DESC &&
                              column.field === sortColumn
                                ? "text-slate-900"
                                : "text-gray-400"
                            } w-3 h-3`}
                          />
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div>{column.name}</div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="p-2 text-lg font-semibold text-center transition-colors duration-75 bg-slate-200 animate-pulse"
                >
                  Loading ...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="p-2 text-lg font-semibold text-center bg-slate-200"
                >
                  Tidak ada data tersedia
                </td>
              </tr>
            ) : reverseArray ? (
              data.map((main, index) => (
                <tr
                  key={index}
                  className="[&>td]:p-2 hover:bg-slate-200 border-b border-slate-200"
                >
                  <td className="text-center p-0">
                    {Object.keys(pagination).length === 0
                      ? index + 1
                      : pagination.from + index}
                  </td>
                  {columns.map((column, id) =>
                    column.field ? (
                      column.field === "action" ? (
                        <td
                          key={column.field}
                          className={column.className + " p-0"}
                        >
                          {column.render(data)}
                        </td>
                      ) : (
                        <td
                          key={column.field}
                          className={column.className + " p-0"}
                        >
                          {column.type === "date"
                            ? convertDate(getNestedValue(data, column.field))
                            : column.type === "custom"
                            ? column.render(data)
                            : getNestedValue(data, column.field) || "-"}
                        </td>
                      )
                    ) : (
                      <td key={id} className={column.className + " p-0"}>
                        {column.value || "-"}
                      </td>
                    )
                  )}
                </tr>
              ))
            ) : (
              data.map((data, index) => (
                <tr
                  key={index}
                  className="[&>td]:p-2 hover:bg-slate-200 border-b border-slate-200"
                >
                  <td className="text-center">
                    {Object.keys(pagination).length === 0
                      ? index + 1
                      : pagination.from + index}
                  </td>
                  {columns.map((column, id) =>
                    column.field ? (
                      column.field === "action" ? (
                        <td
                          class
                          key={column.field}
                          className={column.className}
                        >
                          {column.render(data)}
                        </td>
                      ) : (
                        <td key={column.field} className={column.className}>
                          {column.type === "date"
                            ? convertDate(getNestedValue(data, column.field))
                            : column.type === "custom"
                            ? column.render(data)
                            : getNestedValue(data, column.field) || "-"}
                        </td>
                      )
                    ) : (
                      <td key={id} className={column.className}>
                        {column.value || "-"}
                      </td>
                    )
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {data.length > 0 && !loading && (
        <Paginator
          pagination={pagination}
          pageChanged={(page) => setCurrentPage(page)}
          totalItems={data.length}
        />
      )}
    </>
  );
}
