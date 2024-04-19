"use client";

import { ChangeOrderCategory, ICategory } from "@/actions/category";
import { useNotification } from "@/components/Notification";
import Select from "@/components/Select";
import { useRouter } from "next/navigation";

export default function OrderSelect({
  data,
  defaultValue,
}: {
  data: ICategory[];
  defaultValue: number;
}) {
  const { showNotification } = useNotification();
  const router = useRouter();

  return (
    <>
      <Select
        defaultValue={defaultValue}
        onChange={async (value) => {
          const res = await ChangeOrderCategory({
            current_category_order: defaultValue,
            target_category_order: Number(value),
          });

          showNotification(res.message, res.status ? "success" : "error");
          router.refresh();
        }}
        data={data.map((x, i) => ({
          label: i + 1,
          value: x.order,
        }))}
      />
    </>
  );
}
