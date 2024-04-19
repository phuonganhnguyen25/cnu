"use client";

import { ILanguages } from "@/messages/setting";
import { FC } from "react";
import { useForm, SubmitHandler, FieldError } from "react-hook-form";
import _ from "lodash";
// @ts-ignore
import { zodResolver } from "@hookform/resolvers/zod";
import TCL_Row from "@/components/TwoColLayout/Row";
import TCL_Col from "@/components/TwoColLayout/Col";
import {
  ICreateCategory,
  CreateCategory,
  ICategory,
  UpdateCategory,
} from "@/actions/category";
import { CreateCategorySchema } from "./schema";
import { useParams } from "next/navigation";
import { useNotification } from "@/components/Notification";

const CreateCategoryForm: FC<{
  lang: ILanguages;
  defaultData: ICategory | any;
  categoriesLv1: ICategory[];
}> = ({ lang, defaultData, categoriesLv1 }) => {
  const params = useParams();
  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
    setValue,
    reset,
  } = useForm<ICreateCategory>({
    resolver: zodResolver(CreateCategorySchema(lang)),
    defaultValues: !defaultData
      ? {}
      : {
          name_en: defaultData.name?.name_en,
          name_vi: defaultData.name?.name_vi,
          parent_id: defaultData.parent?.id,
        },
  });

  const { showNotification } = useNotification();

  const onSubmit: SubmitHandler<ICreateCategory> = async (data) => {
    const res = params.id
      ? await UpdateCategory({ ...data, id: Number(params.id) })
      : await CreateCategory(data);

    showNotification(res.message, res.status ? "success" : "error");

    if (res.status) {
      !params.id && reset();
    }
  };

  return (
    <>
      <form
        id="create-form"
        onSubmit={handleSubmit(onSubmit)}
        className="w-full"
      >
        <TCL_Row>
          <TCL_Col side="left">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="name_en"
            >
              {lang["Category"]["Label"]["Name_EN"]}
            </label>
            <input
              defaultValue=""
              {...register("name_en")}
              id="name_en"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder={lang["Category"]["Placeholder"]["Name_Input"]}
              onChange={(e) => {
                setValue("name_en", e.target.value);
                trigger("name_en");
              }}
            />
            {errors.name_en && (
              <span className="text-red-500">{errors.name_en.message}</span>
            )}
          </TCL_Col>

          <TCL_Col side="right">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="name_vi"
            >
              {lang["Category"]["Label"]["Name_VI"]}
            </label>
            <input
              defaultValue=""
              {...register("name_vi")}
              id="name_vi"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder={lang["Category"]["Placeholder"]["Name_Input"]}
              onChange={(e) => {
                setValue("name_vi", e.target.value);
                trigger("name_vi");
              }}
            />
            {errors.name_vi && (
              <span className="text-red-500">{errors.name_vi.message}</span>
            )}
          </TCL_Col>
        </TCL_Row>

        <TCL_Row>
          <TCL_Col side="left">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="parent_id"
            >
              {lang["Category"]["Label"]["Parent"]}
            </label>
            <div className="relative">
              <select
                defaultValue={0}
                {...register("parent_id", { valueAsNumber: true })}
                id="parent_id"
                className="block appearance-none w-full border border-gray-300 py-2 px-3 pr-8 rounded leading-tight focus:outline-none focus:border-gray-500"
                onChange={(e) => {
                  if (!_.isNaN(e.target.value)) {
                    setValue("parent_id", Number(e.target.value));
                    trigger("parent_id");
                  } else {
                    setValue("parent_id", 0);
                  }
                }}
              >
                <option value={0} className="text-gray-500">
                  Select Category
                </option>
                {/* Replace "categories" with your actual array of category names */}
                {categoriesLv1.map((category, index) => (
                  <option key={index} value={Number(category.id)}>
                    {category.name.name_en}/{category.name.name_vi}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M6.293 7.293a1 1 0 011.414 0L10 9.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            {errors.parent_id && (
              <span className="text-red-500">{errors.parent_id.message}</span>
            )}
          </TCL_Col>
        </TCL_Row>

        <input
          value={lang["Common_Text"]["Submit"]}
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline cursor-pointer"
        />
      </form>
    </>
  );
};

export default CreateCategoryForm;
