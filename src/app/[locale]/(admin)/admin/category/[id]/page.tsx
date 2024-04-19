import { getLanguages } from "@/actions/getLanguages";
import Card from "@/components/Card";
import CreateCategoryForm from "../create/form";
import { GetCategories, GetCategoryById } from "@/actions/category";
import { redirect } from "next/navigation";
import { getPathnames } from "@/actions/getPathnames";
import DeleteCategoryButton from "../components/delete-btn";
import Table from "@/components/Table";
import OrderSelect from "../components/order-select";
import dayjs from "dayjs";
import Link from "next/link";

export default async function Page({
  params: { id },
}: {
  params: { id: string };
}) {
  const { lang } = await getLanguages();
  const category =
    !isNaN(Number(id)) && (await GetCategoryById({ id: Number(id) }));
  const pathnames = await getPathnames();

  if (!category || !category?.data)
    return redirect(pathnames["CATEGORY"]["LIST"]);

  const categoriesLv1 = await GetCategories({ level: 1 });

  return (
    <>
      <Card>
        <div className="border-b border-gray-300 mb-6 flex items-center justify-between">
          <h2 className="font-bold text-xl mb-2">
            {lang["Category"]["Update"]}
          </h2>
          <DeleteCategoryButton lang={lang} />
        </div>

        <div className="text-gray-700 text-base">
          <CreateCategoryForm
            lang={lang}
            defaultData={category.data}
            categoriesLv1={categoriesLv1.data.filter(
              (x) => x.id !== category.data.id
            )}
          />
        </div>
      </Card>

      <div className="my-4" />

      {category.data.children.length ? (
        <Card>
          <div className="text-gray-700 text-base">
            <div className="border-b border-gray-300 mb-6 flex items-center justify-between">
              <h2 className="font-bold text-xl mb-2">
                {lang["Category"]["Sub"]}
              </h2>
            </div>

            <Table
              title={[
                {
                  label: lang["Category"]["Label"]["Order"],
                  dataIndex: "order",
                  key: "order",
                  render: (order) => {
                    return (
                      <OrderSelect
                        defaultValue={order}
                        data={category.data.children}
                      />
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
              data={category.data.children}
            />
          </div>
        </Card>
      ) : null}
    </>
  );
}
