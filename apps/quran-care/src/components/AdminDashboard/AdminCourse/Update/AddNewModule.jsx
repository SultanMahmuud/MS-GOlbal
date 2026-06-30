import { Button } from "@/components/UI/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/UI/dialog";
import * as React from "react";



const AddNewModule = ({
  open,
  setOpen,
  setNewModuleTitle,

}) => {
  const [newModule, setNewModule] = React.useState("");

  const submitCurriculum = () => {
    if (newModule?.length) {
      setNewModuleTitle(newModule);
      setOpen(false);
      setNewModule("");
    }
  };



  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-4 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Module</DialogTitle>
          <DialogDescription>
            Add a new module to the curriculum.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 mt-4">
          <label className="text-sm font-medium">Module Title</label>
          <input
            className="border-none text-sm p-3 rounded-lg outline-gray-300 shadow-md mt-2 w-full"
            value={newModule}
            onChange={(e) => {
              setNewModule(e.target.value);
            }}
            placeholder="Module Title"
          />

          <Button
            onClick={submitCurriculum}
            size="small"
            variant="outline"
            className="mt-4 py-2 px-4 rounded-lg text-white bg-blue-600 hover:bg-blue-700"
            disabled={!newModule?.length}
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewModule;
