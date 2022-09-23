import { FC, useState } from "react";

interface AutoTableProps {
  tableObj: any;
  addMargin?: boolean;
  isProduct?: boolean;
  tableTitle?: string;
}
/**
 * Generates a table automatically and recursively, should receive the next structure:
 * obj = {...objProps, children: tableObj}
 * tableObj = [obj, obj, obj...]
 */
const AutoTable: FC<AutoTableProps> = ({
  tableObj,
  addMargin = false,
  tableTitle = "",
}) => {
  const [selectedSubTable, setSelectedSubTable] = useState(-1);

  if (!tableObj) return;

  let tableHeaders: string[] = tableObj.table_headers;
  console.log(tableHeaders);
  const objArray = tableObj.instances;

  // grid-cols-4 grid-cols-5 grid-cols-6 grid-cols-7 grid-cols-8

  return (
    <div
      className={`mt-4 overflow-y-auto text-center shadow-md border-3 border-base-200 rounded-t-xl ${
        addMargin && "ml-12"
      }`}
    >
      {tableTitle && (
        <div className="w-full pt-2 text-xl font-bold underline uppercase bg-base-200">
          {tableTitle}
        </div>
      )}
      <div className="grid w-full">
        <div
          className={`grid grid-cols-${tableHeaders.length} w-full bg-base-200 `}
        >
          {tableHeaders.map((header, index) => (
            <div
              key={`header-${header}-${index}`}
              className="w-full my-2 font-bold uppercase font-2xl"
            >
              {header}
            </div>
          ))}
        </div>
        <div className="rounded-b-xl ">
          {objArray.map((obj, rowIndex) => {
            const have_children =
              obj.childrenObj?.instances?.length !== 0 || false;
            return (
              <div
                key={`row-${rowIndex}`}
                className={`${
                  obj.is_inventory_low && "border-r-2 border-error"
                } grid font-bold my-2 grid-cols-${tableHeaders.length} ${
                  have_children && "cursor-pointer"
                }`}
                onClick={() => {
                  setSelectedSubTable(rowIndex);
                }}
              >
                {obj.table_values.map((value: any, index) => (
                  <div key={`cel-${rowIndex}-${index}`}>{value}</div>
                ))}
                {have_children && (
                  <div
                    className={`block col-span-full ${
                      selectedSubTable === rowIndex ? "static" : "hidden"
                    }`}
                  >
                    <AutoTable tableObj={obj.childrenObj} addMargin />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AutoTable;
