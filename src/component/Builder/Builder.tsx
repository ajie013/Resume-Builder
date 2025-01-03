import React, { useState } from 'react';
import './styles/Builder.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import jsPDF from 'jspdf';
import { popUpMessage } from '../../utils/popUpMessage';
import Basic from './Basic';
import Education from './Education';
import Experience from './Experience';
import Skills from './Skills';

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
    };

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

    const DownloadPDF = () =>{
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
            <button className='btn btn-dark d-block mx-auto my-3' onClick={generatePDF}>Build Resume</button>
         
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
                        <button onClick={DownloadPDF} disabled={!pdfBlob} className='download-pdf-btn btn btn-danger'>Download PDF</button>
                    </>}            
                </div>
            )}
        </>
    );
};



export default Builder;