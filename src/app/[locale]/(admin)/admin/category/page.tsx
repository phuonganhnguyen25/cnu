import { getDictionary } from "@/messages/setting";
import Card from "@/components/Card";
import Table from "@/components/Table";
import { GetCategories } from "@/actions/category";
import { getPathnames } from "@/actions/getPathnames";
import Link from "next/link";
import OrderSelect from "./components/order-select";
import { redirect } from "next/navigation";
import dayjs from "dayjs";

export default async function Home({
  params: { locale },
}: {
  params: { locale: any };
}) {
  const lang = await getDictionary(locale);
  const categories = await GetCategories({ level: 1 });
  const pathnames = await getPathnames();

  if (!categories.status) return redirect(pathnames.CATEGORY.LIST);

  return (
    <Card>
      <div className="border-b border-gray-300 mb-6 flex items-center justify-between">
        <h2 className="font-bold text-xl mb-2">{lang["Category"]["List"]}</h2>
        <a href={pathnames.CATEGORY.CREATE}>
          <button className="mb-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            {lang["Common_Text"]["Create"]}
          </button>
        </a>
      </div>

      <div className="text-gray-700 text-base">
        <Table
          title={[
            {
              label: lang["Category"]["Label"]["Order"],
              dataIndex: "order",
              key: "order",
              render: (order) => {
                return (
                  <OrderSelect defaultValue={order} data={categories.data} />
                );
              },
            },
            {
              label: lang["Category"]["Label"]["Name_EN"],
              dataIndex: "name",
              key: "name_en",
              render: (name) => name.name_en,
            },
            {
              label: lang["Category"]["Label"]["Name_VI"],
              dataIndex: "name",
              key: "name_vi",
              render: (name) => name.name_vi,
            },
            {
              label: lang["Common_Text"]["Created_At"],
              dataIndex: "created_at",
              key: "created_at",
              render: (date) => dayjs(date).format("DD/MM/YYYY HH:mm"),
            },
            {
              label: lang["Common_Text"]["Updated_At"],
              dataIndex: "updated_at",
              key: "updated_at",
              render: (date) => dayjs(date).format("DD/MM/YYYY HH:mm"),
            },
            {
              label: "",
              dataIndex: "action",
              key: "action",
              render: (action, record) => {
                return (
                  <Link href={pathnames.CATEGORY.LIST + `/${record.id}`}>
                    <button
                      type="button"
                      className="mb-2 bg-transparent hover:bg-blue-50 text-blue-500 font-thin py-1 px-2 rounded inline-flex items-center"
                    >
                      {lang["Common_Text"]["Update"]}
                    </button>
                  </Link>
                );
              },
            },
          ]}
          data={categories.data}
        />
      </div>
    </Card>
  );
}
