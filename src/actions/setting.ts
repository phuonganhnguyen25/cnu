export interface ICreateCategoryActionResponse<T> {
  data: T;
  message: string;
  status: boolean;
}

export class ActionResponseInstance<T> {
  private instance = {
    data: [] as T,
    message: "",
    status: true,
  };

  set(message: string, data: T) {
    this.instance.data = data;
    this.instance.message = message;
  }

  get() {
    return this.instance;
  }
}

export class ActionRejectInstance<T> {
  private instance = {
    data: null as T,
    message: "",
    status: false as boolean,
  };

  set(message: string) {
    this.instance.message = message;
  }

  get() {
    return this.instance;
  }
}
