import { types } from "mobx-state-tree";
import BoardsStore from "./boards";
import UsersStore from "./users";

const RootStore = types.model("RootStore", {
  users: types.optional(UsersStore, {}),
  boards: types.optional(BoardsStore, {}),
});

export default RootStore;
