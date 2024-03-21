
import { z } from 'zod';

export const createNoteValidation = z.object({
    title: z.string().min(1, { message: "Title is required!" }),
    content: z.string().optional()
})
export type CreateNoteValidation = z.infer<typeof createNoteValidation>;

export const updateNoteValidation = createNoteValidation.extend({
    id: z.string().min(1)
})

export const deleteNoteValidation = z.object({
    id: z.string().min(1)
})
