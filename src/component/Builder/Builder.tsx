import React, { ChangeEvent, useState } from 'react';
import './styles/Builder.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import jsPDF from 'jspdf';

// import { popUpMessage } from '../../utils/popUpMessage';


interface basicType {
    fullName: string;
    contactNumber: string;
    address: string
    email: string;
    summary: string

}

interface educationType {
    id: number;
    level: string,
    name: string,
    dateStarted: string;
    dateGraduated?: string;
    degree?: string;
}

interface ExperienceType {
    id: number;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    jobDescription: string;
}


const Builder: React.FC = () => {
    const [activeLink, setActiveLink] = useState<string>('Basic');
    const [basicData, setBasicData] = useState<basicType>({
        fullName: '',
        contactNumber: '',
        address: '',
        email: '',
        summary: '',
    });
    const [educationList, setEducationList] = useState<educationType[]>([
        { id: 1, level: '', name: '', dateStarted: '', dateGraduated: '' },
    ]);
    const [experienceList, setExperienceList] = useState<ExperienceType[]>([
        { id: 1, company: "", position: "", startDate: "", endDate: "", jobDescription: "" }
    ]);
    const [skills, setSkills] = useState<string[]>(['']);
    const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    

    const links = ['Basic', 'Education', 'Experience', 'Skills'];

    const Navigate = (link: string) => {
        setActiveLink(link);
    };

    const generatePDF = () => {
        const doc = new jsPDF();
    
        // Title Section
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(20);
        doc.text(basicData.fullName, 105, 20, { align: 'center' });
    
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(12);
        doc.text(
            `${basicData.contactNumber} | ${basicData.address} | ${basicData.email}`,
            105,
            30,
            { align: 'center' }
        );
    
        doc.line(10, 40, 200, 40); // Horizontal line
    
        // Summary Section
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.text('SUMMARY', 10, 50);
    
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(12);
        const summaryLines = doc.splitTextToSize(basicData.summary, 190);
        doc.text(summaryLines, 10, 60);
    
        // Experience Section
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.text('EXPERIENCE', 10, 80);
    
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(12);
        let yOffset = 90; // Dynamic vertical position
        experienceList.forEach((exp: ExperienceType) => {
            doc.text(`${exp.startDate} - ${exp.endDate}`, 10, yOffset);
            doc.text(`${exp.position} - ${exp.company}`, 10, yOffset + 10);
        
            const jobLines = doc.splitTextToSize(exp.jobDescription, 190);
            jobLines.forEach((line: string, idx: number) => {
                doc.text(`• ${line}`, 10, yOffset + 20 + idx * 10);
            });
        
            yOffset += 40 + jobLines.length * 10;
        });
        
    
        // Education Section
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.text('EDUCATION', 10, yOffset + 10);
    
        yOffset += 20;
        educationList.forEach((edu) => {
            doc.setFont('helvetica', 'bold');
            doc.text(`${edu.level}`, 10, yOffset);
            doc.setFont('helvetica', 'normal');
            doc.text(`${edu.dateStarted} - ${edu.dateGraduated}`, 10, yOffset + 10);
            doc.text(edu.name, 10, yOffset + 20);
            yOffset += 30;
        });
    
        // Skills Section
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.text('SKILLS', 10, yOffset + 10);
    
       
       
        doc.setFont('helvetica', 'normal');
        skills.forEach((skill, idx) => {
            doc.text(`• ${skill}`, 10, yOffset + 30 + idx * 10);
        });
    
      
    
    
        // Generate PDF blob and URL
        const pdfOutput = doc.output('blob');
        const pdfBlobUrl = URL.createObjectURL(pdfOutput);
        setPdfUrl(pdfBlobUrl);

        // Open modal
        setIsModalOpen(true);
    };
    
    const closeModal = () =>{
        setIsModalOpen(false);
        setPdfUrl(null);
    }


    return (
        <>
            <div className='builder-container'>
                <div className='fields-wrapper'>
                    <div className='button-wrapper'>
                        {links.map((link) => (
                            <button
                                key={link}
                                onClick={() => Navigate(link)}
                                className={`${activeLink === link ? 'button-link active-link' : 'button-link'}`}
                            >
                                {link}
                            </button>
                        ))}
                    </div>
                    <div className='input-wrapper'>
                        {activeLink === 'Basic' && <Basic setBasicData={setBasicData} basicData={basicData} />}
                        {activeLink === 'Education' && <Education setEducationList={setEducationList} educationList={educationList} />}
                        {activeLink === 'Experience' && <Experience experienceList={experienceList} setExperienceList={setExperienceList} />}
                        {activeLink === 'Skills' && <Skills setSkills={setSkills} skills={skills} />}
                    </div>
                </div>
                <div className='canvas-wrapper'></div>
            </div>
            <button className='btn btn-dark' onClick={generatePDF}>
                Build Resume
            </button>

            
            {isModalOpen && (
                <div className='modal-overlay'>
                    <div className='modal-content'>
                        <button className='close-button' onClick={closeModal}>
                            &times;
                        </button>
                        {pdfUrl && <iframe src={pdfUrl} width='100%' height='500px' />}
                    </div>
                </div>
            )}


        </>
    );
};
interface basic{
    setBasicData: React.Dispatch<React.SetStateAction<basicType>>;
    basicData : basicType
}

const Basic: React.FC<basic> = ({setBasicData,basicData}) =>{

    return(
        <>  
            <div className='basic-info-wrapper'>
                <h2 className='basic-info-header'>Basic Information</h2>
                <label htmlFor="">Full Name</label>
                <input type="text" placeholder='Enter Full Name' value={basicData.fullName} onChange={(e) => setBasicData(prev =>({...prev, fullName: e.target.value}))} />
                <label htmlFor="">Contact Number</label>
                <input type="text" placeholder='Enter Contact Number' value={basicData.contactNumber} onChange={(e) => setBasicData(prev =>({...prev, contactNumber: e.target.value}))} />
                <label htmlFor="">Address</label>
                <input type="text" placeholder='Enter Address' value={basicData.address}  onChange={(e) => setBasicData(prev =>({...prev, address: e.target.value}))}/>
                <label htmlFor="">Email</label>
                <input type="text" placeholder='Enter Email' value={basicData.email} onChange={(e) => setBasicData(prev =>({...prev, email: e.target.value}))}/>
                <label htmlFor="">Summary</label>
                <textarea name="" id="" placeholder='Enter Summary' value={basicData.summary} onChange={(e) => setBasicData(prev =>({...prev, summary: e.target.value}))}></textarea>
            </div>
            
        </>
    )
};


interface educObj{
    setEducationList : React.Dispatch<React.SetStateAction<educationType[]>>;
    educationList: educationType[]
}
const Education: React.FC<educObj> = ({educationList,setEducationList}) =>{
   
   
   
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
            level: "Select level",
            name: '',
            dateStarted: '', 
            dateGraduated: ''
        }]);
    }

    return(
        <>  
            <div className='education-info-wrapper'>
                <h2 className='basic-info-header'>Education</h2>
                {educationList.map(item => 
                                               
                   <>                            
                        <input type="text" placeholder='Education Level' value={item.level} onChange={(e) => handleLevelChange(e, item.id)} required />  
                        <input type="text" placeholder='Institution Name' value={item.name} onChange={(e) => handleInstitutionChange(e, item.id)} required />
                        <div className='duration'>
                            <div>
                                <label htmlFor="">Date Started</label>
                                <input type="date" onChange={(e) => HandleDateStarted(e,item.id)} required />
                            </div>
                            <div>
                                <label htmlFor="">Date Graduated</label>
                                <input type="date" onChange={(e) => HandleDateGraduated(e, item.id)} required />     
                            </div>           
                        </div>
                                             
                        <input type="text" placeholder='Degree (optional)' value={item.degree} onChange={(e) => handleDegreeChange(e, item.id)} required/>
                    </>
              
                               
                )}
                <button className='btn btn-dark d-block mx-auto my-3' onClick={AddEducation}>Add Education</button>
                
                
            </div>
            
        </>
    )
};

interface experienceObj {
    setExperienceList: React.Dispatch<React.SetStateAction<ExperienceType[]>>;
    experienceList: ExperienceType[];
}


const Experience : React.FC<experienceObj>= ({setExperienceList,experienceList}) =>{

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
   
    return(
        <>
             <div className='experience-info-wrapper'>
                <h2 className='basic-info-header'>Experience</h2>
                {experienceList.map(item => 
                <div className='experience-item'>
                    {/* <label htmlFor="">Company Name</label> */}
                    <input type="text" value={item.company} placeholder='Company' onChange={(e) => HandleCompanyChange(e,item.id)} />
                    <input type="text" value={item.position} placeholder='Job Position' onChange={(e) => HandlePositionChange(e,item.id)}/>
                     <div className='duration'>
                        <div>
                            <label htmlFor="">Date Started</label>
                            <input type="date"  onChange={(e) => HandleDateStartedChange(e,item.id)}/>
                        </div>
                        <div>
                            <label htmlFor="">Date Ended</label>
                            <input type="date" onChange={(e) => HandleDateEndedChange(e,item.id)}/>
                        </div>                  
                     </div>
                     <textarea name="" id="" placeholder='Job Description' onChange={(e) => HandleJobDescriptionChange(e,item.id)}></textarea>
                </div> )}
                <button className='btn btn-dark d-block mx-auto my-3' onClick={AddExperience}>Add Experience</button>
                
                
            </div>
        </>
    )
}

interface skillsObj{
    skills: string[]
    setSkills: React.Dispatch<React.SetStateAction<string[]>>
}
const Skills : React.FC<skillsObj> = ({skills, setSkills}) =>{
   

    const AddSkill = () :void =>{
        setSkills(prev => [...prev, ""])
    }
    const HandleSkillChange = (e : ChangeEvent<HTMLInputElement> ,index: number) =>{
        const newSkills = [...skills];
        newSkills[index] = e.target.value; 
        setSkills(newSkills); 
    }

  

    return(
        <>
            <div className='skills-info-wrapper'>
                <h2>Skills</h2>
                {skills.map((item,index)=>   <input type="text" placeholder='Skill' value={item} onChange={(e) => HandleSkillChange(e,index)}/>)}
              
                
                <button className='btn btn-dark d-block mx-auto my-3' onClick={AddSkill} >Add Skills</button>
            </div>
            
        </>
    )
}
export default Builder;