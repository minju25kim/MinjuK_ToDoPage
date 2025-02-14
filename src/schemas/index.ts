import { z } from 'zod';

export const TodoSchema = z.object({
  id: z.string().uuid(),
  content: z.string().min(1, "Todo cannot be empty")
});

export const BoardSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Board name cannot be empty"),
  todos: z.array(TodoSchema)
});

export type Board = z.infer<typeof BoardSchema>;
export type Todo = z.infer<typeof TodoSchema>;