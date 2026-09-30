import { useState } from "react";
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
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  InputAdornment,
  IconButton,
  Paper,
  Chip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import FilterListIcon from "@mui/icons-material/FilterList";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string>("ALL");

  const { data, loading, error } = useQuery<{ tasks: Task[] }>(GET_TASKS);

  const [createTask] = useMutation<{ createTask: Task }>(CREATE_TASK, {
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

  const allTasks = data?.tasks || [];
  const filteredTasks = allTasks.filter((task) => {
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      task.title.toLowerCase().includes(query) ||
      (task.description
        ? task.description.toLowerCase().includes(query)
        : false);

    const matchesPriority =
      priorityFilter === "ALL" || task.priority === priorityFilter;

    return matchesSearch && matchesPriority;
  });

  const isFiltered = searchQuery.trim() !== "" || priorityFilter !== "ALL";

  const handleResetFilters = () => {
    setSearchQuery("");
    setPriorityFilter("ALL");
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f8fafc", py: 4 }}>
      <Container maxWidth="lg">
        {/* Board Header */}
        <Box sx={{ mb: 4 }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", sm: "center" },
              mb: 3,
            }}
          >
            <div>
              <Typography variant="h4" sx={{ fontWeight: 700 }} color="#0f172a">
                Task Board
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
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

          {/* Filtering Controls */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 2.5,
              border: "1px solid #e2e8f0",
              backgroundColor: "#ffffff",
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: { xs: "stretch", md: "center" },
              gap: 2,
            }}
          >
            <TextField
              size="small"
              placeholder="Search tasks by title or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ flex: 1 }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon
                        fontSize="small"
                        sx={{ color: "text.secondary" }}
                      />
                    </InputAdornment>
                  ),
                  endAdornment: searchQuery ? (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        aria-label="clear search"
                        onClick={() => setSearchQuery("")}
                        edge="end"
                      >
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ) : null,
                },
              }}
            />

            <FormControl
              size="small"
              sx={{ minWidth: { xs: "100%", sm: 180 } }}
            >
              <InputLabel id="priority-filter-label">Priority</InputLabel>
              <Select
                labelId="priority-filter-label"
                id="priority-filter"
                value={priorityFilter}
                label="Priority"
                onChange={(e) => setPriorityFilter(e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <FilterListIcon
                      fontSize="small"
                      sx={{ color: "text.secondary" }}
                    />
                  </InputAdornment>
                }
              >
                <MenuItem value="ALL">All Priorities</MenuItem>
                <MenuItem value="LOW">
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ alignItems: "center" }}
                  >
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        bgcolor: "#10b981",
                      }}
                    />
                    <span>Low</span>
                  </Stack>
                </MenuItem>
                <MenuItem value="MEDIUM">
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ alignItems: "center" }}
                  >
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        bgcolor: "#f59e0b",
                      }}
                    />
                    <span>Medium</span>
                  </Stack>
                </MenuItem>
                <MenuItem value="HIGH">
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ alignItems: "center" }}
                  >
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        bgcolor: "#ef4444",
                      }}
                    />
                    <span>High</span>
                  </Stack>
                </MenuItem>
              </Select>
            </FormControl>

            {isFiltered && (
              <Stack
                direction="row"
                spacing={1.5}
                sx={{
                  alignItems: "center",
                  alignSelf: { xs: "flex-start", md: "center" },
                }}
              >
                <Chip
                  size="small"
                  label={`${filteredTasks.length} of ${allTasks.length} tasks`}
                  variant="outlined"
                  sx={{ borderColor: "#cbd5e1", color: "#475569" }}
                />

                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<ClearIcon fontSize="small" />}
                  onClick={handleResetFilters}
                  sx={{
                    color: "text.secondary",
                    borderColor: "divider",
                    textTransform: "none",
                    fontSize: "0.8125rem",
                    "&:hover": {
                      color: "text.primary",
                      borderColor: "text.secondary",
                      backgroundColor: "action.hover",
                    },
                  }}
                >
                  Clear filters
                </Button>
              </Stack>
            )}
          </Paper>
        </Box>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Grid container spacing={3}>
            {COLUMNS.map((col) => {
              const columnTasks = filteredTasks.filter(
                (t) => t.status === col.id,
              );
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
