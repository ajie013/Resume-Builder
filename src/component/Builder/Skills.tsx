import React, { ChangeEvent } from 'react';
import './styles/Skills.css'

interface skillsProps{
    skills: string[]
    setSkills: React.Dispatch<React.SetStateAction<string[]>>
}

const Skills : React.FC<skillsProps> = ({skills, setSkills}) =>{
   
    const AddSkill = () :void =>{
        setSkills(prev => [...prev, ""])
    };

    const HandleSkillChange = (e : ChangeEvent<HTMLInputElement> ,index: number) =>{
        const newSkills = [...skills];
        newSkills[index] = e.target.value; 
        setSkills(newSkills); 
    };

    const deleteSkill = (i: number) => {
        const newSkills = skills.filter((_, index) => index !== i);
        setSkills(newSkills);
    };
  
    return(
        <>
            <div className='skills-info-wrapper'>
                <h2>Skills</h2>
                {skills.map((item,index)=>  
                    <div className='skill-item'>
                         <input type="text" placeholder='Skill' value={item} onChange={(e) => HandleSkillChange(e,index)}/>
                         {index > 0 &&
                            <button className='close-button close-button-skill' title='Delete Skill' onClick={() => deleteSkill(index)}>
                                &times;
                            </button> }
                    </div>                
                )}
                          
                <button className='btn btn-dark d-block mx-auto my-3' onClick={AddSkill} >Add Skills</button>
            </div>          
        </>
    )
}

export default Skills;