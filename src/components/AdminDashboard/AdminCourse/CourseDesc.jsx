import JoditEditor from 'jodit-react';
import { useRef } from 'react';

const CourseDesc = ({savedValue,setValue}) => {
  
  const getValue = (value) => {
    
    setValue(value);
  };
  const editor = useRef(null);
  const config = {
    buttons: ["bold", "italic", "link", "unlink", "underline", "source"],
  };
    return (
        <div>
           <JoditEditor
               ref={editor}
               value={savedValue}
               config={config}
               
               tabIndex={1}
               onBlur={(newContent) => getValue(newContent)}
             />
        </div>
    );
};

export default CourseDesc;