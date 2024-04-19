import Card from "@/components/Card";
import CreateCategoryForm from "./form";
import { getLanguages } from "@/actions/getLanguages";
import { GetCategories } from "@/actions/category";

export default async function Page({
  params: { locale },
}: {
  params: { locale: any };
}) {
  const { lang } = await getLanguages();
  const categoriesLv1 = await GetCategories({ level: 1 });

  return (
    <>
      <Card>
        <div className="border-b border-gray-300 mb-6">
          <h2 className="font-bold text-xl mb-2">
            {lang["Category"]["Create"]}
          </h2>
        </div>
        <div className="text-gray-700 text-base">
          <CreateCategoryForm
            lang={lang}
            defaultData={{}}
            categoriesLv1={categoriesLv1.data}
          />
        </div>
      </Card>
    </>
  );
}
