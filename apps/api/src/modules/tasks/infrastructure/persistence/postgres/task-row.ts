export interface TaskRow {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  due_at: Date | null;
  completed_at: Date | null;
  created_at: Date;
  updated_at: Date;
}
