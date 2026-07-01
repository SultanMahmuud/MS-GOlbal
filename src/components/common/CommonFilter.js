
const CommonFilter = ({value,setValue,values}) => {

    const handleChange = (e) => {
        setValue(e.target.value);
        
      };
    return (
        <div>
             <select
              id="contentInput" 
              name="country" 
              style={{ width: "100%",border:'1px solid gray' }}
              className="py-2 rounded-md"
               value={value}
             onChange={handleChange}
             
              >
                {
                    values.map(item=> <option value={item} key={item}>{item}</option>)
                }
                <input></input>
        </select>
        </div>
    );
};

export default CommonFilter;