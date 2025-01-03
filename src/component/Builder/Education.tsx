import React, { ChangeEvent } from 'react';
import './styles/Education.css'

interface educationType {
    id: number;
    level: string,
    name: string,
    dateStarted: string;
    dateGraduated?: string;
    degree?: string;
}

interface educcationProps{
    setEducationList : React.Dispatch<React.SetStateAction<educationType[]>>;
    educationList: educationType[]
}

const Education: React.FC<educcationProps> = ({educationList,setEducationList}) =>{
   
    const handleLevelChange = (event: ChangeEvent<HTMLInputElement>,id: number): void => {
        
        setEducationList(prev =>
            prev.map(edu =>
                edu.id === id ? { ...edu, level: event.target.value } : edu
            )
        );
    };

    const handleInstitutionChange = (event: ChangeEvent<HTMLInputElement>,id: number) => {
        const name = event.target.value;
      
        setEducationList(prev =>
            prev.map(edu =>
                edu.id === id ? { ...edu, name } : edu
            )
        );
    };

    const handleDegreeChange = (event: ChangeEvent<HTMLInputElement>,id:number) => {
      
        setEducationList(prev =>
            prev.map(edu =>
                edu.id === id ? { ...edu, degree:  event.target.value } : edu
            )
        );
    };

    const HandleDateStarted = (event : ChangeEvent<HTMLInputElement>,id: number) : void =>{
        setEducationList(prev =>
            prev.map(edu =>
                edu.id === id ? { ...edu, dateStarted: event.target.value} : edu
            )
        );
    }

    console.log(educationList)
    const HandleDateGraduated = (event : ChangeEvent<HTMLInputElement>,id:number) : void =>{
            
        setEducationList(prev =>
            prev.map(edu =>
                edu.id === id ? { ...edu, dateGraduated: event.target.value } : edu
            )
        );
    }
  
    const AddEducation = () =>{
        setEducationList(prev => [...prev, {
            id: educationList.length + 1,
            level: "",
            name: '',
            dateStarted: '', 
            dateGraduated: '',
        }]);
    }

    const deleteEducation = (i : number) =>{
        setEducationList(prev => prev.filter((_, index) => index !== i))
    }

    return(
        <>  
            <div className='education-info-wrapper'>
                <h2 className='education-info-header'>Education</h2>
                {educationList.map((item, index) =>                                               
                   <>                                  
                        <div className='education-item'>
                            {index > 0 &&
                            <button className='close-button close-button-education' title='Delete Education' onClick={() => deleteEducation(index)}>
                                &times;
                            </button> }
                                    
                            <input type="text" placeholder='Education Level' value={item.level} onChange={(e) => handleLevelChange(e, item.id)} required />  
                            <input type="text" placeholder='Institution Name' value={item.name} onChange={(e) => handleInstitutionChange(e, item.id)} required />
                            <div className='duration'>
                                <div>
                                    <label htmlFor="">Date Started</label>
                                    <input type="date" value={item.dateStarted} onChange={(e) => HandleDateStarted(e,item.id)} required />
                                </div>
                                <div>
                                    <label htmlFor="">Date Graduated</label>
                                    <input type="date" value={item.dateGraduated} onChange={(e) => HandleDateGraduated(e, item.id)} required />     
                                </div>           
                            </div>                                           
                            <input type="text" placeholder='Degree (optional)' value={item.degree} onChange={(e) => handleDegreeChange(e, item.id)} required/>
                            <hr />  
                        </div>
                       
                    </>
              
                               
                )}
                <button className='btn btn-dark d-block mx-auto my-3' onClick={AddEducation}>Add Education</button>
                
                
            </div>
            
        </>
    )
};


export default Education