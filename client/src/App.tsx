// client/src/App.tsx
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import {
  Container,
  Typography,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Stack,
  Chip,
} from '@mui/material';

// تعریف کوئری واکشی تسک‌ها
const GET_TASKS = gql`
  query GetTasks {
    tasks {
      id
      title
      description
      status
      priority
    }
  }
`;

interface TaskItem {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
}

export default function App() {
  const { data, loading, error } = useQuery<{ tasks: TaskItem[] }>(GET_TASKS);

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 5 }}>
        <Alert severity="error">خطا در دریافت اطلاعات: {error.message}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }} gutterBottom>
        داشبورد وظایف (Task Tracker)
      </Typography>

      <Stack spacing={2} sx={{ mt: 3 }}>
        {data?.tasks.map((task) => (
          <Card key={task.id} variant="outlined">
            <CardContent>
              <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">{task.title}</Typography>
                <Stack direction="row" spacing={1}>
                  <Chip label={task.status} color="primary" size="small" />
                  <Chip label={task.priority} variant="outlined" size="small" />
                </Stack>
              </Stack>
              {task.description && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {task.description}
                </Typography>
              )}
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Container>
  );
}