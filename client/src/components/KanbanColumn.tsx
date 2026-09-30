import React from 'react';
import { Paper, Box, Typography, Stack } from '@mui/material';
import { Droppable } from '@hello-pangea/dnd';
import { TaskCard, type Task } from './TaskCard';

interface KanbanColumnProps {
  id: Task['status'];
  title: string;
  tasks: Task[];
  accentColor: string;
  onDelete: (id: string) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  id,
  title,
  tasks,
  accentColor,
  onDelete,
}) => {
  return (
    <Paper
      elevation={0}
      sx={{
        width: { xs: 300, md: '100%' },
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#f8fafc',
        borderRadius: 3,
        border: '1px solid #e2e8f0',
        overflow: 'hidden',
      }}
    >
      {/* هدر ستون با خط مرزی رنگی */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#ffffff',
          borderBottom: '2px solid',
          borderColor: accentColor,
        }}
      >
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: accentColor }} />
          <Typography variant="subtitle2" fontWeight={700} color="#334155">
            {title}
          </Typography>
        </Stack>
        <Box
          sx={{
            backgroundColor: '#f1f5f9',
            color: '#475569',
            px: 1.2,
            py: 0.2,
            borderRadius: 5,
            fontSize: '0.75rem',
            fontWeight: 700,
          }}
        >
          {tasks.length}
        </Box>
      </Box>

      {/* ناحیه رهاسازی تسک‌ها (Droppable Area) */}
      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <Box
            ref={provided.innerRef}
            {...provided.droppableProps}
            sx={{
              p: 1.5,
              flexGrow: 1,
              minHeight: 480,
              backgroundColor: snapshot.isDraggingOver ? '#f1f5f9' : 'transparent',
              transition: 'background-color 0.2s',
            }}
          >
            {tasks.map((task, index) => (
              <TaskCard key={task.id} task={task} index={index} onDelete={onDelete} />
            ))}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>
    </Paper>
  );
};