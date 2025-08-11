// Drag and Drop Types
export const ItemTypes = {
  TICKET: 'ticket',
} as const;

export interface DragItem {
  type: typeof ItemTypes.TICKET;
  id: string;
  status: string;
}

export interface DropResult {
  status: string;
  columnId: string;
}