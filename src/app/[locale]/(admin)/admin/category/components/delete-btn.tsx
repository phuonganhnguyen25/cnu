"use client";

import { DeleteCategory } from "@/actions/category";
import { useModal } from "@/components/Modal";
import { useNotification } from "@/components/Notification";
import { ILanguages } from "@/messages/setting";
import { isNaN } from "lodash";
import { useParams, useRouter } from "next/navigation";

export default function DeleteCategoryButton({ lang }: { lang: ILanguages }) {
  const { showModal, hideModal, setModalLoading, modalLoading } = useModal();
  const { showNotification } = useNotification();
  const router = useRouter();
  const params = useParams();

  const onDeleteCategory = () => {
    showModal(
      <h2>{lang["Category"]["Delete"]}</h2>,
      <div>
        <p>{lang["Category"]["Placeholder"]["Delete_Confirm"]}</p>
        <p className="text-red-400">
          {lang["Category"]["Placeholder"]["Delete_Confirm_Level_1"]}
        </p>
      </div>,
      <div>
        <button
          onClick={hideModal}
          className="text-gray-700 hover:text-gray-900 bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-lg"
        >
          {lang["Common_Text"]["Close"]}
        </button>
        <button
          onClick={async () => {
            if (isNaN(Number(params.id))) return;
            setModalLoading(true);
            await DeleteCategory({ ids: [Number(params.id)] })
              .then((res) => {
                showNotification(res.message, res.status ? "success" : "error");
                hideModal();
                router.refresh();
              })
              .catch((e) => {});
          }}
          className="ml-2 text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg"
          disabled={modalLoading}
        >
          {lang["Common_Text"]["Delete"]}
        </button>
      </div>
    );
  };

  return (
    <>
      <button
        onClick={onDeleteCategory}
        className="mb-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
      >
        {lang["Common_Text"]["Delete"]}
      </button>
    </>
  );
}
