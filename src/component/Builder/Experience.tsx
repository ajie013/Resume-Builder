import React, { ChangeEvent } from 'react';
import './styles/Experience.css'

interface ExperienceType {
    id: number;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    jobDescription: string;
}

interface experiencProps {
    setExperienceList: React.Dispatch<React.SetStateAction<ExperienceType[]>>;
    experienceList: ExperienceType[];
    setNoExperience: React.Dispatch<React.SetStateAction<boolean>>
    noExperience: boolean
}

const Experience : React.FC<experiencProps>= ({setExperienceList,experienceList,setNoExperience,noExperience}) =>{

    const AddExperience = () =>{
        const newExperience : ExperienceType= {
            id: experienceList.length + 1, 
            company:"", 
            position: "", 
            startDate: '',
            endDate: '',
            jobDescription: ''
        }
        setExperienceList(prev => [...prev, newExperience])
    };

  

    const HandleCompanyChange =(event: ChangeEvent<HTMLInputElement>,id: number) =>{
        setExperienceList(prev => prev.map(item =>item.id == id ? {...item, company: event.target.value } : item))
    }
    const HandlePositionChange = (event: ChangeEvent<HTMLInputElement>,id: number) =>{
        setExperienceList(prev => prev.map(item =>item.id == id ? {...item, position: event.target.value } : item))
    }
    const HandleJobDescriptionChange = (event: ChangeEvent<HTMLTextAreaElement>,id: number) =>{
        setExperienceList(prev => prev.map(item =>item.id == id ? {...item, jobDescription: event.target.value } : item))
    }

    const HandleDateStartedChange = (event: ChangeEvent<HTMLInputElement>,id: number) =>{
        setExperienceList(prev => prev.map(item =>item.id == id ? {...item, startDate: event.target.value } : item))
    }

    const HandleDateEndedChange = (event: ChangeEvent<HTMLInputElement>,id: number) =>{
        setExperienceList(prev => prev.map(item =>item.id == id ? {...item, endDate: event.target.value } : item))
    }
    const handleChangeExperience = () =>{
        setNoExperience(prev => !prev)
    }

    const deleteExperience = (i: number) =>{
        setExperienceList(prev => prev.filter((_,index) => index !== i))
    }
    
    return(
        <>
             <div className='experience-info-wrapper'>
                <div className='experience-header'>
                     <h2 className='experience-info-header'>Experience</h2>
                     <div className='no-experience-wrapper'>
                        <input type="checkbox" onChange={handleChangeExperience}  checked={noExperience}/>
                        <label htmlFor="">NO EXPERIENCE</label>
                     </div>            
                </div>
                
                {experienceList.map((item,index) => 
                    <>                  
                        <div className='experience-item'>
                        {index > 0 &&
                            <button className='close-button close-button-experience' title='Delete Experience' onClick={() => deleteExperience(index)}>
                                &times;
                            </button> }
                     
                        <input type="text" value={item.company} placeholder='Company' onChange={(e) => HandleCompanyChange(e,item.id)} />
                        <input type="text" value={item.position} placeholder='Job Position' onChange={(e) => HandlePositionChange(e,item.id)}/>
                        <div className='duration'>
                            <div>
                                <label htmlFor="">Date Started</label>
                                <input type="date" value={item.startDate}  onChange={(e) => HandleDateStartedChange(e,item.id)}/>
                            </div>
                            <div>
                                <label htmlFor="">Date Ended</label>
                                <input type="date" value={item.endDate} onChange={(e) => HandleDateEndedChange(e,item.id)}/>
                            </div>                  
                        </div>
                        <textarea name="" id="" value={item.jobDescription} placeholder='Job Description' onChange={(e) => HandleJobDescriptionChange(e,item.id)}></textarea>
                        <hr />
                        </div>
                    </>
                  
                )}

                <button className='btn btn-dark d-block mx-auto my-3' onClick={AddExperience}>Add Experience</button>
                    
            </div>
        </>
    )
}


export default Experience