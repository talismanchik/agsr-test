import { Box, IconButton, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Card } from '@/shared/ui';
import { TaskList } from '@/shared/types/list';

type ListCardProps = {
  list: TaskList;
  taskCount: number;
  onDelete: (id: string) => void;
  onClick: (id: string) => void;
};

export const ListCard = ({ list, taskCount, onDelete, onClick }: ListCardProps) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(list.id);
  };

  return (
    <Box sx={{ position: 'relative' }}>
      <Box onClick={() => onClick(list.id)} sx={{ cursor: 'pointer' }}>
        <Card>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
            <Typography variant="h6">{list.title}</Typography>
            <IconButton size="small" color="error" onClick={handleDelete}>
              <DeleteIcon />
            </IconButton>
          </Box>
          <Typography variant="caption" color="text.secondary">
            Задач: {taskCount}
          </Typography>
        </Card>
      </Box>
    </Box>
  );
}; 