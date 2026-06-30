'use client'

import React, { useEffect, useState } from 'react';
import { AiOutlinePlusCircle } from "react-icons/ai";
import { BiEdit, BiEditAlt } from "react-icons/bi";
import { MdDeleteForever, MdExpandMore, MdOndemandVideo } from "react-icons/md";

import AddLessonModal from './AddLessonModal';
import AddNewModule from './AddNewModule';
import EditLesson from './EditLesson';

const EditCuriCulumn = ({
  curriculumData,
  handleDeleteLesson,
  handleEditLesson,
  AddNewLessonFunc,
  handleDeleteModule,
  handleAddNewModule
}) => {
  const [open, setOpen] = React.useState(false);
  const [addModal, SetAddModal] = useState(false);
  const [editLesson, setEditLesson] = React.useState();
  const [newLesson, setNewLesson] = useState();
  const [addIndex, setAddIndex] = useState({});
  const [OpenCurr, setOpenCurr] = useState();
  const [newModuleTitle, setNewModuleTitle] = useState();
  const [newModuleIndex, setNewModuleIndex] = useState();

  useEffect(() => {}, [newLesson]);

  useEffect(() => {
    handleEditLesson(editLesson);
  }, [editLesson]);

  const handleAddLesson = (indexes) => {
    setAddIndex(indexes);
    SetAddModal(true);
  };

  useEffect(() => {
    AddNewLessonFunc(newLesson, addIndex);
  }, [newLesson]);

  const handleAddCurr = (Mindex) => {
    setOpenCurr(true);
    setNewModuleIndex(Mindex);
  };

  useEffect(() => {
    if (newModuleTitle?.length) {
      const newModule = {
        module: {
          moduleName: newModuleTitle,
          lessons: []
        },
        Mindex: newModuleIndex
      };
      handleAddNewModule(newModule);
    }
  }, [OpenCurr]);

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Course syllabus</h2>

      <div>
        {curriculumData?.map((data, Mindex) => (
          <div key={Mindex} className="border rounded-lg mb-3">
            {/* Accordion Header */}
            <button
              className="w-full flex justify-between items-center px-4 py-2 bg-gray-200  rounded-lg"
              onClick={(e) => {
                const content = e.currentTarget.nextElementSibling;
                content.classList.toggle('hidden');
              }}
            >
              <span>{data?.moduleName}</span>
              <div className="flex items-center gap-2">
                
                <AiOutlinePlusCircle
                  className="cursor-pointer"
                  onClick={() => handleAddCurr(Mindex)}
                />
                <MdDeleteForever
                  className="cursor-pointer text-red-500"
                  onClick={() => handleDeleteModule(Mindex)}
                />
                <MdExpandMore className="text-xl" />
              </div>
            </button>

            {/* Accordion Content */}
            <div className={`${Mindex === 0 ? '' : 'hidden'} px-4 py-2`}>
              {data?.lessons?.length === 0 ? (
                <div className="flex items-center gap-2 py-2">
                  <button
                    className="bg-blue-500 text-white text-sm px-3 py-1 rounded-md"
                    onClick={() => handleAddLesson({ Mindex, Lindex: 0 })}
                  >
                    Add Lesson
                  </button>
                </div>
              ) : (
                data?.lessons?.map((lesson, Lindex) => (
                  <div
                    key={Lindex}
                    className="flex justify-between items-center py-2 border-b last:border-0"
                  >
                    <div className="flex items-center gap-2">
                      <MdOndemandVideo />
                      <span className="text-sm">
                        Video 0{Lindex + 1} - {lesson?.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <BiEditAlt
                        className="cursor-pointer"
                        onClick={() => {
                          setEditLesson({
                            Mindex,
                            Lindex,
                            lesson,
                            moduleName: data?.moduleName
                          });
                          setOpen(true);
                        }}
                      />
                      <AiOutlinePlusCircle
                        className="cursor-pointer"
                        onClick={() => handleAddLesson({ Mindex, Lindex })}
                      />
                      <MdDeleteForever
                        className="cursor-pointer text-red-500"
                        onClick={() =>
                          handleDeleteLesson({ Mindex, lesson, Lindex })
                        }
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    <AddLessonModal
        open={addModal}
        setOpen={SetAddModal}
        setNewLesson={setNewLesson}
        newLesson={newLesson}
      /> 
   <EditLesson
        editableLesson={editLesson}
        open={open}
        setOpen={setOpen}
        setEditLesson={setEditLesson}
      />

<AddNewModule
        open={OpenCurr}
        setOpen={setOpenCurr}
        setNewModuleTitle={setNewModuleTitle}
        newModuleTitle={newModuleTitle}
      /> 
    
    </div>
  );
};

export default EditCuriCulumn;
