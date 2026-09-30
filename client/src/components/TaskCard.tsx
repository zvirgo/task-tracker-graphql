import React from 'react';
import { Card, CardContent, Typography, Chip, Stack, IconButton, Box, Tooltip } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Draggable } from '@hello-pangea/dnd';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  createdAt?: string;
}

interface TaskCardProps {
  task: Task;
  index: number;
  onDelete: (id: string) => void;
}

const priorityConfig: Record<Task['priority'], { color: string; label: string; chipColor: 'success' | 'warning' | 'error' }> = {
  LOW: { color: '#10b981', label: 'کم', chipColor: 'success' },
  MEDIUM: { color: '#f59e0b', label: 'متوسط', chipColor: 'warning' },
  HIGH: { color: '#ef4444', label: 'فوری', chipColor: 'error' },
};

export const TaskCard: React.FC<TaskCardProps> = ({ task, index, onDelete }) => {
  const priority = priorityConfig[task.priority] || priorityConfig.MEDIUM;

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          elevation={snapshot.isDragging ? 6 : 0}
          sx={{
            position: 'relative',
            mb: 1.5,
            borderRadius: 2,
            border: '1px solid',
            borderColor: snapshot.isDragging ? 'primary.main' : '#e2e8f0',
            backgroundColor: '#ffffff',
            overflow: 'hidden',
            transition: 'border-color 0.2s, box-shadow 0.2s',
            transform: snapshot.isDragging ? 'scale(1.02)' : 'none',
            '&:hover': {
              borderColor: '#cbd5e1',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
            },
          }}
        >
          {/* نوار رنگی اولویت مشابه بورد Syncfusion */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              width: 5,
              backgroundColor: priority.color,
            }}
          />

          <CardContent sx={{ p: 2, pl: 2.5, '&:last-child': { pb: 2 } }}>
            <Stack direction="row" spacing={1} sx={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                <Box {...provided.dragHandleProps} sx={{ display: 'flex', color: '#94a3b8', cursor: 'grab' }}>
                  <DragIndicatorIcon fontSize="small" />
                </Box>
                <Typography variant="subtitle2" fontWeight={600} color="#1e293b" sx={{ wordBreak: 'break-word' }}>
                  {task.title}
                </Typography>
              </Stack>

              <Tooltip title="حذف تسک">
                <IconButton size="small" onClick={() => onDelete(task.id)} sx={{ color: '#94a3b8', '&:hover': { color: 'error.main' } }}>
                  <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>
            </Stack>

            {task.description && (
              <Typography variant="body2" color="#64748b" sx={{ mt: 1, mb: 1.5, fontSize: '0.82rem', lineHeight: 1.5 }}>
                {task.description}
              </Typography>
            )}

            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mt: 1.5 }}>
              <Chip
                label={priority.label}
                size="small"
                color={priority.chipColor}
                variant="outlined"
                sx={{ height: 22, fontSize: '0.7rem', fontWeight: 600, borderRadius: 1 }}
              />

              <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', color: '#94a3b8' }}>
                <AccessTimeIcon sx={{ fontSize: 14 }} />
                <Typography variant="caption" sx={{ fontSize: '0.72rem' }}>
                  {task.id.slice(0, 6)}
                </Typography>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      )}
    </Draggable>
  );
};