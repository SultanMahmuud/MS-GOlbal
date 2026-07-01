
"use client";

import { Button } from "../UI/button";
import axios from "axios";
import SendMessage from "./SendMessage";
import { toast } from "sonner";

export const columns = (fetchRegistrations) => [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "number", header: "Number" },
  { accessorKey: "parentName", header: "Parent Name" },
  { accessorKey: "address", header: "Address" },
  { accessorKey: "date", header: "Date" },
  { accessorKey: "level", header: "Level" },
  { accessorKey: "days", header: "Days" },
  { accessorKey: "time", header: "Time" },
  { accessorKey: "interestedSubject", header: "Interested Subject" },
  {
    id: "addLevel",
    header: "Add Level",
    cell: ({ row }) => {
      const email = row.original.email;
      const open = row.original.openLevel;
      return (
        <Button
          variant="outline"
          className="text-xs py-1 px-2 rounded-full"
          onClick={() => open(email)}
        >
          Add Level
        </Button>
      );
    },
  },
  {
    id: "message",
    header: "Message",
    cell: ({ row }) => (
      <SendMessage
        data={{ email: row.original.email, number: row.original.number }}
      />
    ),
  },
  {
    id: "delete",
    header: "Delete",
    cell: ({ row }) => {
      const handleDelete =() => {
 toast.custom(
  (t) => (
    <div className="flex flex-col gap-2 bg-white p-5  shadow-md min-w-96 rounded-lg">
      <span className="font-bold">Want to delete?</span>
      <div className="flex justify-end gap-2">
        <Button
          size="sm"
          variant="destructive"
          onClick={async () => {
            try {
              const id = row.original.id;
              await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/registration/reg/delete/${id}`);
              toast.success("Deleted successfully");
              fetchRegistrations();
              toast.dismiss(t.id);
            } catch (error) {
              toast.error("Error deleting registration");
              toast.dismiss(t.id);
            }
          }}
        >
          Yes
        </Button>
        <Button size="sm" variant="outline" onClick={() => toast.dismiss(t.id)}>
          Cancel
        </Button>
      </div>
    </div>
  ),
  { duration: Infinity, position: "top-right" } // ✅ top-right corner
);

};

      return (
        <Button
          
          size="sm"
          className="text-xs bg-orange-400"
          onClick={handleDelete}
        >
          Delete
        </Button>
      );
    },
  },
];
