import React, { ChangeEvent, useState } from 'react';
import './styles/Builder.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import jsPDF from 'jspdf';
import { popUpMessage } from '../../utils/popUpMessage';




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
    const [noExperience, setNoExperience] = useState<boolean>(false)
    
    const[isloading, setIsLoading] = useState<boolean>(false)

    const links = ['Basic', 'Education', 'Experience', 'Skills'];

    const Navigate = (link: string) => {
        setActiveLink(link);
    };

    const checkInputFields = () => {
        const isAnyBasicInfoEmpty = Object.values(basicData).some(value => value.trim() === '');
        const isAnyEducationInfoEmpty = educationList.some(education => 
            Object.entries(education).some(([key, value]) => 
                key !== 'degree' && typeof value === 'string' && value.trim() === ''
            )
        );
        const isAnyExperiencePropertyEmpty  = noExperience ? false :  experienceList.some(experience => 
            Object.values(experience).some(value => typeof value === 'string' &&  value.trim() === '')
        );
        const checkSkills = skills.some(item => item.trim() === '') 
    
        if(isAnyEducationInfoEmpty || isAnyBasicInfoEmpty || isAnyExperiencePropertyEmpty || checkSkills){
            popUpMessage('Fill out all required information', 'error');
            return false; 
        }
        
        return true; 
    }
    const generatePDF = () => {
        setIsLoading(true)
        const isValid = checkInputFields();

        if (!isValid) {
            return; 
        }
    
        const doc = new jsPDF();
        const pageHeight : number = doc.internal.pageSize.height; 
        const margin = 10; 
        let yOffset = margin;
    
     
        const checkPageOverflow = (additionalHeight : number) => {
            if (yOffset + additionalHeight > pageHeight - margin) {
                doc.addPage();
                yOffset = margin; 
            }
        };
    
        // Title Section
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(24);
        doc.text(basicData.fullName, 105, yOffset, { align: 'center' });
    
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.text(
            `${basicData.contactNumber} | ${basicData.address} | ${basicData.email}`,
            105,
            yOffset + 10,
            { align: 'center' }
        );
    
        doc.line(margin, yOffset + 20, 200, yOffset + 20); 
        yOffset += 30;
    
        // Summary Section
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(15);
        doc.text('SUMMARY', margin, yOffset);
    
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        const summaryLines = doc.splitTextToSize(basicData.summary, 190);
        checkPageOverflow(summaryLines.length * 6);
        doc.text(summaryLines, margin, yOffset + 10);
        yOffset += 20 + summaryLines.length * 6;
    
        // Experience Section
        if (!noExperience) {
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(15);
            doc.text('EXPERIENCE', margin, yOffset);
            yOffset += 10;
    
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(11);
            experienceList.forEach((exp) => {
                checkPageOverflow(25); 
                doc.text(`${exp.startDate} - ${exp.endDate}`, margin, yOffset);
                doc.text(`${exp.position} - ${exp.company}`, margin, yOffset + 6);
    
                const jobLines = doc.splitTextToSize(exp.jobDescription, 190);
                checkPageOverflow(jobLines.length * 5);
                jobLines.forEach((line : number, idx : number) => {
                    doc.text(`   • ${line}`, margin, yOffset + 12 + idx * 5);
                });
    
                yOffset += 18 + jobLines.length * 5; 
            });
        }
    
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(15);
        doc.text('EDUCATION', margin, yOffset);
        yOffset += 10;
    
        educationList.forEach((edu) => {
            checkPageOverflow(20); 
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(11);
            doc.text(`${edu.level}`, margin, yOffset);
            doc.text(`${edu.dateStarted} - ${edu.dateGraduated}`, margin, yOffset + 5);
            doc.text(edu.name, margin, yOffset + 10);
            edu.degree  && doc.text(edu.degree, margin, yOffset + 15);
     
            edu.degree ? yOffset += 25 :  yOffset += 20; 
        });
    
        // Skills Section
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(15);
        checkPageOverflow(15); 
        doc.text('SKILLS', margin, yOffset);
        yOffset += 10;
    
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        skills.forEach((skill, idx) => {
            checkPageOverflow(10);
            doc.text(`• ${skill}`, margin, yOffset + idx * 6);
        });
    
        const pdfOutput = doc.output('blob');
        setPdfBlob(pdfOutput);
        const pdfBlobUrl = URL.createObjectURL(pdfOutput);
        setPdfUrl(pdfBlobUrl);

        setIsModalOpen(true);
        setTimeout(() => {
            setIsLoading(false)
        }, 1000);

        
    };

    const DownlaodPdf = () =>{
        if (pdfBlob) {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(pdfBlob);
            link.download = 'Resume.pdf';
            link.click();
        } else {
            popUpMessage('Please generate the PDF first!','error');
        }
    }
    
    const closeModal = () =>{
        setIsModalOpen(false);
        setPdfUrl(null);
    }

    return (
        <>
            <div className='builder-container'>
                <div className='main'>
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
                    <div className='fields-wrapper'>
                        {activeLink === 'Basic' && <Basic setBasicData={setBasicData} basicData={basicData} />}
                        {activeLink === 'Education' && <Education setEducationList={setEducationList} educationList={educationList} />}
                        {activeLink === 'Experience' && <Experience experienceList={experienceList} setExperienceList={setExperienceList}  setNoExperience={setNoExperience} noExperience={noExperience}/>}
                        {activeLink === 'Skills' && <Skills setSkills={setSkills} skills={skills} />}
                    </div>
                </div>            
            </div>
            <button className='btn btn-dark d-block mx-auto my-3' onClick={generatePDF}>
                Build Resume
            </button>

            
            {isModalOpen && (
        
                <div className='modal-overlay'>
                    {isloading ?  <span className="loader-modal"></span>  : 
                    <>
                    <div className='modal-content'>
                        <button className='close-button close-button-modal' onClick={closeModal}>
                            &times;
                        </button>
                        {pdfUrl && <iframe src={pdfUrl} />}
                    </div>

                    <button onClick={DownlaodPdf} disabled={!pdfBlob} className='download-pdf-btn btn btn-danger'>Download PDF</button>
                    </>}
                    

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
               
                <input type="text" placeholder='Full Name' value={basicData.fullName} onChange={(e) => setBasicData(prev =>({...prev, fullName: e.target.value}))} />
             
                <input type="text" placeholder='Contact Number' value={basicData.contactNumber} onChange={(e) => setBasicData(prev =>({...prev, contactNumber: e.target.value}))} />
               
                <input type="text" placeholder='Address' value={basicData.address}  onChange={(e) => setBasicData(prev =>({...prev, address: e.target.value}))}/>
              
                <input type="text" placeholder='Email' value={basicData.email} onChange={(e) => setBasicData(prev =>({...prev, email: e.target.value}))}/>
              
                <textarea name="" id="" placeholder='Summary' value={basicData.summary} onChange={(e) => setBasicData(prev =>({...prev, summary: e.target.value}))}></textarea>
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

interface experienceObj {
    setExperienceList: React.Dispatch<React.SetStateAction<ExperienceType[]>>;
    experienceList: ExperienceType[];
    setNoExperience: React.Dispatch<React.SetStateAction<boolean>>
    noExperience: boolean
}


const Experience : React.FC<experienceObj>= ({setExperienceList,experienceList,setNoExperience,noExperience}) =>{

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

    const deleteSkill = (i: number) => {
        const newSkills = skills.filter((_, index) => index !== i);
        setSkills(newSkills);
    };
  

    console.log(skills)
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
export default Builder;