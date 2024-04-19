import { FC } from "react";

const Table: FC<{
  title: {
    key: number | string;
    dataIndex: string;
    label: string | React.ReactNode;
    render?: (target: any, record: any, key: number) => any;
  }[];
  data: any[];
}> = (props) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="sticky top-0 bg-gray-50 z-10">
          <tr>
            {props.title.map((t, i) => (
              <th
                key={t.key}
                scope="col"
                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-40 relative ${
                  i !== props.title.length - 1 ? "pr-4" : ""
                }`}
              >
                {t.label}
                {/* <span>{t.key === 'asc' ? ' ▲' : ' ▼'}</span> */}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {props.data.map((d, di) => {
            return (
              <tr key={di}>
                {props.title.map((t) =>
                  typeof t?.render === "function" ? (
                    <td
                      key={t.key}
                      className="px-6 py-4 whitespace-nowrap min-w-40"
                      
                    >
                      {t.render(d?.[t.dataIndex], d, di)}
                    </td>
                  ) : (
                    <td
                      key={t.key}
                      className="px-6 py-4 whitespace-nowrap min-w-40"
                    >
                      {d?.[t.dataIndex]}
                    </td>
                  )
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
