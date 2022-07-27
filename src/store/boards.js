import { flow, getParent, onSnapshot, types } from "mobx-state-tree";
import ApiCall from "../api";
import { User } from "./users";
import { v4 as uuidv4 } from "uuid";

const Task = types.model("Task", {
  id: types.identifier,
  title: types.string,
  description: types.string,
  assignee: types.safeReference(User), // Сделаем так что бы поле ссылалось на юзера
});

const BoardSection = types
  .model("BoardSection", {
    id: types.identifier,
    title: types.string,
    tasks: types.array(Task),
  })
  .actions((self) => {
    return {
      // Каждая секция будет отправлять запросы только за своими задачами
      // Так как некоторые секции могут быть скрыты, то скрытые секции не будут отправлять запросы
      load: flow(function* () {
        // Так как mobx-state-tree - это дерево, нам нужно подняться вверх и взять id родителя (на 2 уровня выше)
        const { id: boardId } = getParent(self, 2);
        const { id: status } = self;
        const { tasks } = yield ApiCall.get(
          `boards/${boardId}/tasks/${status}`
        );

        self.tasks = tasks;

        onSnapshot(self, self.save);
      }),
      afterCreate() {
        self.load();
      },
      save: flow(function* ({ tasks }) {
        const { id: boardId } = getParent(self, 2);
        const { id: status } = self;

        yield ApiCall.put(`boards/${boardId}/tasks/${status}`, { tasks });
      }),
    };
  });

const Board = types
  .model("Board", {
    id: types.identifier,
    title: types.string,
    sections: types.array(BoardSection),
  })
  .actions((self) => {
    return {
      moveTask(id, source, destinations) {
        const fromSection = self.sections.find(
          (section) => section.id === source.droppableId
        );
        const toSection = self.sections.find(
          (section) => section.id === destinations.droppableId
        );
        const taskToMoveIndex = fromSection.tasks.findIndex(
          (task) => task.id === id
        );
        const [task] = fromSection.tasks.splice(taskToMoveIndex, 1);

        toSection.tasks.splice(destinations.index, 0, task.toJSON());
      },
      addTask(sectionId, taskPayload) {
        const section = self.sections.find(
          (section) => section.id === sectionId
        );

        section.tasks.push({
          id: uuidv4(),
          ...taskPayload,
        });
      },
    };
  });

const BoardsStore = types
  .model("BoardsStore", {
    boards: types.optional(types.array(Board), []),
    // reference - не может быть underfind
    // safeReference - может
    // Берем id и ищем в сторе, возвращаем найденную сущность (Перехватывает через proxy значение active и подставляет правльный объект)
    active: types.safeReference(Board),
  })
  .actions((self) => {
    return {
      selectBoard(id) {
        self.active = id;
      },
      load: flow(function* () {
        self.boards = yield ApiCall.get("boards");
        self.active = "MAIN";
      }),
      afterCreate() {
        self.load();
      },
    };
  })
  .views((self) => ({
    get list() {
      return self.boards.map(({ id, title }) => ({
        id,
        title,
      }));
    },
  }));

export default BoardsStore;
