import { Button, Grid, Paper, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { observer } from "mobx-react-lite";
import { useCallback, useState } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import useStore from "../../hooks/useStore";
import Column from "./Column";
import NewTaskDialog from "./NewTaskDialog";

function getListStyle(isDraggingOver) {
  return {
    backgroundColor: isDraggingOver ? "lightblue" : "lightgrey",
    padding: 8,
    minHeight: 500,
  };
}

function Dashboard() {
  const { boards } = useStore();
  const [newTaskToSection, setNewTaskSection] = useState(null);

  const closeDialog = useCallback(() => {
    setNewTaskSection(null);
  }, [setNewTaskSection]);

  const onDragEnd = useCallback(
    (event) => {
      const { source, destination, droppableId: taskId } = event;

      boards.active.moveTask(taskId, source, destination);
    },
    [boards]
  );

  return (
    <Box p={2}>
      <DragDropContext onDragEnd={onDragEnd}>
        <Grid container spacing={2}>
          {boards.active?.sections?.map((section) => (
            <Grid item key={section.id} xs>
              <Paper>
                <Box
                  p={1}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Typography variant="h5">{section?.title}</Typography>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => {
                      setNewTaskSection(section.id);
                    }}
                  >
                    Add
                  </Button>
                </Box>
                <Droppable droppableId={section.id}>
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      style={getListStyle(snapshot.isDraggingOver)}
                    >
                      <Column section={section} />
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </DragDropContext>
      <NewTaskDialog
        open={!!newTaskToSection}
        handleClose={closeDialog}
        activeSection={newTaskToSection}
      />
    </Box>
  );
}

export default observer(Dashboard);
