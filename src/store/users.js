import { types, flow } from "mobx-state-tree";
import ApiCall from "../api";

export const User = types.model("User", {
  id: types.identifier,
  createdAt: types.string,
  name: types.string,
  avatar: types.string,
});

// Создаем новую модель на основе модели User, но с другим названием
const ActiveUser = User.named("ActiveUser");

const UsersStore = types
  .model("UsersStore", {
    users: types.maybe(types.array(User)),
    me: types.maybe(ActiveUser),
  })
  // Такие геттеры как view мемоизируются и не вычисляются каждый раз
  .views((self) => {
    return {
      get list() {
        if (self.users && self.users.length > 0) {
          return self.users?.map(({ id, name }) => ({ id, name }));
        }

        return [];
      },
    };
  })
  // self - альтернативное название this для этой функции
  .actions((self) => {
    return {
      // Для работы с асинхронным кодом в mobx используются генераторы
      load: flow(function* () {
        self.users = yield ApiCall.get("users");
        self.me = yield ApiCall.get("me");
      }),
      afterCreate() {
        self.load();
      },
    };
  });

export default UsersStore;
