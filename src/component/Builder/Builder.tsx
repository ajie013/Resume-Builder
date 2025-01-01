import React, { ChangeEvent, useState } from 'react';
import './styles/Builder.css';
import 'bootstrap/dist/css/bootstrap.min.css';
// import { popUpMessage } from '../../utils/popUpMessage';

const Builder: React.FC = () => {
    const [activeLink, setActiveLink] = useState<string>('Basic');

    const links = ['Basic', 'Education', 'Experience', 'Skills'];

    const Navigate = (link: string) => {
        setActiveLink(link);
       
    };

    return (
        <div className='builder-container'>
            <div className='fields-wrapper'>
                <div className='button-wrapper'>
                    {links.map(link => (
                        <button onClick={() => Navigate(link)} className={` ${activeLink === link ? 'button-link active-link' : 'button-link'}`}> {link} </button>
                    ))}
                </div>
                <div className='input-wrapper'>
                    {activeLink === "Basic" && <Basic/>}
                    {activeLink === "Education" && <Education/>}
                </div>
            </div>
            <div className='canvas-wrapper'></div>
        </div>
    );
};

const Basic: React.FC = () =>{
    return(
        <>  
            <div className='basic-info-wrapper'>
                <h2 className='basic-info-header'>Basic Information</h2>
                <label htmlFor="">Full Name</label>
                <input type="text" placeholder='Enter Full Name' />
                <label htmlFor="">Contact Number</label>
                <input type="text" placeholder='Enter Contact Number'  />
                <label htmlFor="">Address</label>
                <input type="text" placeholder='Enter Address' />
                <label htmlFor="">Email</label>
                <input type="text" placeholder='Enter Email'/>
                <label htmlFor="">Summary</label>
                <textarea name="" id="" placeholder='Enter Summary'></textarea>
            </div>
            
        </>
    )
};

interface Education {
    id: number;
    level: string,
    name: string,
    dateStarted?: Date;
    dateEnded?: Date;
    degree?: string;
}

const Education: React.FC = () =>{
   
    const[educationList, setEducationList] = useState<Education[]>([
        {id: 1,level: "Select level", name:"", }
    ])
   
    console.log(educationList)
    const AddEducation = () =>{
        setEducationList(prev => [...prev, {
            id: educationList.length + 1,
            level: "Select level",
            name: ''
        }])
    }
    return(
        <>  
            <div className='education-info-wrapper'>
                <h2 className='basic-info-header'>Education</h2>
                {educationList.map(item => <EducationInfo item={item} setEducationList={setEducationList}/>)}
                <button className='btn btn-dark d-block mx-auto my-3' onClick={AddEducation}>Add Education</button>
                
                
            </div>
            
        </>
    )
};

interface info {
    item: Education
    setEducationList: React.Dispatch<React.SetStateAction<Education[]>>
}

const EducationInfo: React.FC<info> = ({ item, setEducationList }) => {
    // const [isOpen,setIsOpen] = useState(true);
    const [selectedLevel, setSelectedLevel] = useState(item.level);
    const [institutionName, setInstitutionName] = useState(item.name);
    const [degree, setDegree] = useState(item.degree || '');
    const [isShowContent, setIsShowContent] = useState<boolean>(false);

    const SelectLevel = (event: ChangeEvent<HTMLSelectElement>): void => {
        const selectedLvl = event.target.value;

        if (selectedLvl === "Select level") return;

        setSelectedLevel(selectedLvl);
        setIsShowContent(true);
        setEducationList(prev =>
            prev.map(edu =>
                edu.id === item.id ? { ...edu, level: selectedLvl } : edu
            )
        );
    };

    const handleInstitutionChange = (event: ChangeEvent<HTMLInputElement>) => {
        const name = event.target.value;
        setInstitutionName(name);
        setEducationList(prev =>
            prev.map(edu =>
                edu.id === item.id ? { ...edu, name } : edu
            )
        );
    };

    const handleDegreeChange = (event: ChangeEvent<HTMLInputElement>) => {
        const degreeValue = event.target.value;
        setDegree(degreeValue);
        setEducationList(prev =>
            prev.map(edu =>
                edu.id === item.id ? { ...edu, degree: degreeValue } : edu
            )
        );
    };

    return (
        <>
       
        <div className='education-item'>
            <label htmlFor="">Select a level</label>
            <select name="" id="" value={selectedLevel} onChange={SelectLevel}>
                <option value="Select level" disabled>Select Level</option>
                <option value="Primary">Primary Education</option>
                <option value="Secondary">Secondary Education</option>
                <option value="Tertiary">Tertiary Education</option>
            </select>
            {isShowContent && (
                <>
                    <label htmlFor="">Institution Name</label>
                    <input
                        type="text"
                        placeholder='Enter Institution Name'
                        value={institutionName}
                        onChange={handleInstitutionChange}
                    />
                    <label htmlFor="">Date Started</label>
                    <input type="date" />
                    <label htmlFor="">Date Graduated</label>
                    <input type="date" />
                    {selectedLevel === "Tertiary" && (
                        <>
                            <label htmlFor="">Degree</label>
                            <input
                                type="text"
                                placeholder='Enter Degree'
                                value={degree}
                                onChange={handleDegreeChange}
                            />
                        </>
                    )}
                </>
            )}
        </div>
        <hr />
            
        </>
    );
};

export default Builder;