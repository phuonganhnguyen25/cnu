"use server";

import {
  CreateCategorySchema,
  UpdateCategorySchema,
} from "@/app/[locale]/(admin)/admin/category/create/schema";
import { getLanguages } from "./getLanguages";
import { prismaClientSingleton } from "@/prisma-client/setting";
import { ActionRejectInstance, ActionResponseInstance } from "./setting";
import { Category } from "@prisma/client";
import { isEqual } from "lodash";

export interface ICreateCategory {
  name_en: string;
  name_vi: string;
  parent_id?: number;
}

export interface IUpdateCategory extends Partial<ICreateCategory> {
  id: number;
}

export interface IGetCategories {
  level: number;
}

export interface IChangeCategoryOrder {
  current_category_order: number;
  target_category_order: number;
}

export interface ICategory
  extends Pick<
    Category,
    "id" | "level" | "order" | "created_at" | "updated_at"
  > {
  name: {
    name_en: string;
    name_vi: string;
  };
  parent: Pick<ICategory, "id" | "name">;
  children: ICategory[];
}

const categorySelect: any = {
  id: true,
  name: true,
  created_at: true,
  updated_at: true,
  level: true,
  order: true,
  parent: {
    select: {
      id: true,
      name: true,
    },
  },
  children: {
    select: {
      id: true,
      name: true,
      order: true,
    },
    orderBy: {
      order: "asc",
    },
  },
};

async function getNewestCategoryOrder() {
  return (
    (
      await prismaClientSingleton.category.aggregate({
        _max: {
          order: true,
        },
      })
    )._max.order || 1
  );
}

export async function CreateCategory(body: ICreateCategory) {
  const { lang } = await getLanguages();
  const actionResponse = new ActionResponseInstance<any>();
  const actionReject = new ActionRejectInstance<any>();

  try {
    CreateCategorySchema(lang).parse(body);
    // Checking name
    const existingRecordWithName =
      await prismaClientSingleton.category.findFirst({
        where: {
          OR: [
            {
              name: {
                path: ["name_en"],
                equals: body.name_en,
              },
            },
            {
              name: {
                path: ["name_vi"],
                equals: body.name_vi,
              },
            },
          ],
        },
      });

    if (existingRecordWithName) {
      actionReject.set(lang["Category"]["Error_Msg"]["Name_Invalid"]);
      return actionReject.get();
    }
    // Get order
    const level = 1;
    const payload = {
      name: {
        name_en: body.name_en,
        name_vi: body.name_vi,
      },
      level,
      order: (await getNewestCategoryOrder()) + 1,
      parent_id: null as any,
    };
    // Check parent_id

    if (!isNaN(body?.parent_id as number)) {
      if (body.parent_id === 0) {
        payload.parent_id = null;
        payload.level = 1;
      } else {
        payload.parent_id = body.parent_id;
        payload.level = 2;
      }
    }

    await prismaClientSingleton.category.create({
      data: payload,
    });

    actionResponse.set(lang["Category"]["Success_Msg"]["Create"], []);
    return actionResponse.get();
  } catch (error) {
    actionReject.set(lang["Category"]["Error_Msg"]["Create"]);
    return actionReject.get();
  }
}

export async function UpdateCategory(body: IUpdateCategory) {
  const { lang } = await getLanguages();
  const actionResponse = new ActionResponseInstance<any>();
  const actionReject = new ActionRejectInstance<any>();

  try {
    UpdateCategorySchema(lang).parse(body);

    const oldData = (await prismaClientSingleton.category.findUnique({
      where: { id: body.id },
      select: categorySelect,
    })) as ICategory | any;

    const payload: any = {
      name: oldData?.name,
    };

    if (body.name_en && body.name_en !== oldData?.name.name_en) {
      payload.name.name_en = body.name_en;
    }

    if (body.name_vi && body.name_vi !== oldData?.name.name_vi) {
      payload.name.name_vi = body.name_vi;
    }

    if (!isEqual(payload.name, oldData?.name)) {
      // Checking name_en
      const existingRecordWithName =
        await prismaClientSingleton.category.findFirst({
          where: {
            OR: [
              {
                name: {
                  path: ["name_en"],
                  equals: body.name_en,
                },
              },
              {
                name: {
                  path: ["name_vi"],
                  equals: body.name_vi,
                },
              },
            ],
          },
        });

      if (existingRecordWithName) {
        actionReject.set(lang["Category"]["Error_Msg"]["Name_Invalid"]);
        return actionReject.get();
      }
    }

    // Check parent_id
    if (!isNaN(body?.parent_id as number)) {
      if (body.parent_id === 0) {
        payload.parent_id = null;
        payload.level = 1;
      } else {
        payload.parent_id = body.parent_id;
        payload.level = 2;
      }
    }

    await prismaClientSingleton.category
      .update({
        where: { id: oldData?.id },
        data: payload,
      })
      .then(async () => {
        if (payload.parent_id && oldData.children?.length) {
          await prismaClientSingleton.category.updateMany({
            where: {
              id: {
                in: oldData.children.map((x: ICategory) => x.id),
              },
            },
            data: { parent_id: body.parent_id },
          });
        }
      });

    actionResponse.set(lang["Category"]["Success_Msg"]["Update"], []);
    return actionResponse.get();
  } catch (error) {
    actionReject.set(lang["Category"]["Error_Msg"]["Update"]);
    return actionReject.get();
  }
}

export async function GetCategories(body: IGetCategories) {
  const { lang } = await getLanguages();

  const actionResponse = new ActionResponseInstance<ICategory[]>();
  const actionReject = new ActionRejectInstance<ICategory[]>();

  try {
    const categories = (await prismaClientSingleton.category.findMany({
      where: {
        level: body.level,
      },
      take: 1000,
      orderBy: { order: "asc" },
    })) as ICategory[] | any;

    actionResponse.set("", categories);
    return actionResponse.get();
  } catch (error) {
    actionReject.set(lang["Category"]["Error_Msg"]["Create"]);
    return actionReject.get();
  }
}

export async function ChangeOrderCategory(body: IChangeCategoryOrder) {
  const { lang } = await getLanguages();

  const actionResponse = new ActionResponseInstance<any>();
  const actionReject = new ActionRejectInstance<any>();

  try {
    const [current, target] = await prismaClientSingleton.$transaction([
      prismaClientSingleton.category.findFirst({
        where: {
          order: body.current_category_order,
        },
      }),
      prismaClientSingleton.category.findFirst({
        where: {
          order: body.target_category_order,
        },
      }),
    ]);

    if (!current) {
      actionReject.set(
        lang["Category"]["Error_Msg"]["Current_Position_Invalid"]
      );
      return actionReject.get();
    } else if (!target) {
      actionReject.set(
        lang["Category"]["Error_Msg"]["Target_Position_Invalid"]
      );
      return actionReject.get();
    }

    const currentOrder = current.order;
    const targetOrder = target.order;

    await prismaClientSingleton.category.update({
      where: {
        id: target.id,
      },
      data: {
        order: (await getNewestCategoryOrder()) + 1,
      },
    });

    await prismaClientSingleton
      .$transaction([
        prismaClientSingleton.category.update({
          where: {
            id: current.id,
          },
          data: {
            order: targetOrder,
          },
        }),
        prismaClientSingleton.category.update({
          where: {
            id: target.id,
          },
          data: {
            order: currentOrder,
          },
        }),
      ])
      .catch(async () => {
        await prismaClientSingleton.category.update({
          where: {
            id: target.id,
          },
          data: {
            order: targetOrder,
          },
        });
      });

    actionResponse.set(lang["Category"]["Success_Msg"]["Change_Order"], null);
    return actionResponse.get();
  } catch (error) {
    actionReject.set(lang["Category"]["Error_Msg"]["Change_Order"]);
    return actionReject.get();
  }
}

export async function GetCategoryById(body: { id: number }) {
  const actionResponse = new ActionResponseInstance<ICategory>();
  const actionReject = new ActionRejectInstance<ICategory>();
  const { lang } = await getLanguages();

  try {
    const category = (await prismaClientSingleton.category.findUnique({
      where: {
        id: body.id,
      },
      select: categorySelect,
    })) as ICategory | any;

    actionResponse.set("", category);

    return actionResponse.get();
  } catch (error) {
    actionReject.set(lang["Category"]["Error_Msg"]["Not_Found"]);
    return actionReject.get();
  }
}

export async function DeleteCategory(body: { ids: number[] }) {
  const { lang } = await getLanguages();

  const actionResponse = new ActionResponseInstance<any>();
  const actionReject = new ActionRejectInstance<any>();

  try {
    await prismaClientSingleton.category.deleteMany({
      where: {
        id: {
          in: body.ids,
        },
      },
    });

    actionResponse.set(lang["Category"]["Success_Msg"]["Delete"], null);
    return actionResponse.get();
  } catch (error) {
    actionReject.set(lang["Category"]["Error_Msg"]["Delete"]);
    return actionReject.get();
  }
}

export async function EndUserHeaderCategoryList(): Promise<ICategory[]> {
  return (await prismaClientSingleton.category.findMany({
    where: {
      level: 1,
    },
    orderBy: {
      order: "asc",
    },
    select: {
      name: true,
      id: true,
      children: {
        select: {
          name: true,
          id: true,
        },
      },
    },
  })) as ICategory[] | any;
}
