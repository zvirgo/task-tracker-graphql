import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Stack,
  CircularProgress,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import {
  GET_TASKS,
  CREATE_TASK,
  UPDATE_TASK,
  DELETE_TASK,
} from "./graphql/operations";
import { type Task } from "./components/TaskCard";
import { KanbanColumn } from "./components/KanbanColumn";
import { CreateTaskDialog } from "./components/CreateTaskDialog";

const COLUMNS: { id: Task["status"]; title: string; color: string }[] = [
  { id: "TODO", title: "To Do", color: "#64748b" },
  { id: "IN_PROGRESS", title: "In Progress", color: "#0284c7" },
  { id: "DONE", title: "Done", color: "#16a34a" },
];

export default function App() {
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data, loading, error } = useQuery<{ tasks: Task[] }>(GET_TASKS);

  const [createTask] = useMutation(CREATE_TASK, {
    update(cache, { data: mutationData }) {
      if (!mutationData?.createTask) return;
      const existingData = cache.readQuery<{ tasks: Task[] }>({
        query: GET_TASKS,
      });
      if (existingData) {
        cache.writeQuery({
          query: GET_TASKS,
          data: {
            tasks: [mutationData.createTask, ...existingData.tasks],
          },
        });
      }
    },
  });

  const [updateTask] = useMutation(UPDATE_TASK);

  const [deleteTask] = useMutation(DELETE_TASK, {
    update(cache, _result, { variables }) {
      const existingData = cache.readQuery<{ tasks: Task[] }>({
        query: GET_TASKS,
      });
      if (existingData && variables?.id) {
        cache.writeQuery({
          query: GET_TASKS,
          data: {
            tasks: existingData.tasks.filter((t) => t.id !== variables.id),
          },
        });
      }
    },
  });

  const handleCreateTask = async (
    title: string,
    description: string,
    priority: string,
  ) => {
    await createTask({
      variables: {
        input: { title, description, priority },
      },
    });
  };

  const handleStatusChange = async (id: string, nextStatus: Task["status"]) => {
    await updateTask({
      variables: {
        id,
        input: { status: nextStatus },
      },
      optimisticResponse: {
        updateTask: {
          __typename: "Task",
          id,
          status: nextStatus,
        },
      },
    });
  };

  const handleDeleteTask = async (id: string) => {
    await deleteTask({
      variables: { id },
    });
  };

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    if (destination.droppableId !== source.droppableId) {
      await handleStatusChange(
        draggableId,
        destination.droppableId as Task["status"],
      );
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 5 }}>
        <Alert severity="error">Task retrieval failed: {error.message}</Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f8fafc", py: 4 }}>
      <Container maxWidth="lg">
        <Stack
          direction="row"
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <div>
            <Typography variant="h4" fontWeight={700} color="#0f172a">
              Task Board
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Real-Time Task Management with GraphQL and SQLite
            </Typography>
          </div>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setDialogOpen(true)}
            sx={{ textTransform: "none", px: 2.5, py: 1, borderRadius: 2 }}
          >
          New Task
          </Button>
        </Stack>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Grid container spacing={3}>
            {COLUMNS.map((col) => {
              const columnTasks =
                data?.tasks.filter((t) => t.status === col.id) || [];
              return (
                <Grid size={{ xs: 12, md: 4 }} key={col.id}>
                  <KanbanColumn
                    id={col.id}
                    title={col.title}
                    tasks={columnTasks}
                    accentColor={col.color}
                    onDelete={handleDeleteTask}
                  />
                </Grid>
              );
            })}
          </Grid>
        </DragDropContext>

        <CreateTaskDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onSubmit={handleCreateTask}
        />
      </Container>
    </Box>
  );
}
