'use client';

import { useState, useEffect, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

import {
  FileText,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Download,
  Printer,
  Copy,
  RotateCcw,
  Plus,
  Trash2,
  Zap,
  Briefcase,
  GraduationCap,
  FolderGit2,
  Globe,
  Eye,
  Loader2
} from 'lucide-react';

// --- DATA TYPES ---
export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  bullets: string[];
}

export interface EducationItem {
  id: string;
  degree: string;
  school: string;
  location: string;
  startDate: string;
  endDate: string;
  scoreOrGpa: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  technologies: string;
  link: string;
  description: string;
}

export interface CertItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
  link?: string;
}

export interface ResumeData {
  personal: {
    fullName: string;
    jobTitle: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    githubOrPortfolio: string;
    summary: string;
  };
  experiences: ExperienceItem[];
  education: EducationItem[];
  skills: {
    technical: string;
    toolsAndFrameworks: string;
    softSkills: string;
  };
  projects: ProjectItem[];
  certifications: CertItem[];
  languages: string;
}

// 6 Pro ATS Templates
export type TemplateId = 'harvard' | 'modern' | 'executive' | 'minimal' | 'compact' | 'twocolumn';

export interface TemplateConfig {
  id: TemplateId;
  name: string;
  description: string;
  atsScore: string;
  badge: string;
}

const TEMPLATES: TemplateConfig[] = [
  { id: 'harvard', name: 'Ivy League / Harvard Classic', description: 'Standard single-column, horizontal rules, 99.8% ATS pass rate', atsScore: '99%', badge: 'Most Popular' },
  { id: 'modern', name: 'Modern Tech Pro', description: 'Sleek header accent bar, clean metadata tags, high readability', atsScore: '98%', badge: 'Tech & Startups' },
  { id: 'executive', name: 'Executive Leadership', description: 'Prominent role progression, bold corporate styling & metrics focus', atsScore: '97%', badge: 'Management' },
  { id: 'minimal', name: 'Clean Minimalist', description: 'Pure typography, distraction-free layout for high-density information', atsScore: '99%', badge: 'ATS Safe' },
  { id: 'compact', name: 'Compact 1-Page Fit', description: 'Tightly engineered spacing for fresh graduates and 1-page limits', atsScore: '98%', badge: '1-Page Fit' },
  { id: 'twocolumn', name: 'Modern Two-Column (ATS-Safe)', description: 'Single logical text flow designed to parse cleanly in Workday & Greenhouse', atsScore: '95%', badge: 'Creative/Design' },
];

// 8 Professional Accent Color Themes
const COLOR_THEMES = [
  { id: 'navy', name: 'Executive Navy', hex: '#1E3A8A', textHex: '#1E3A8A' },
  { id: 'slate', name: 'Charcoal Slate', hex: '#0F172A', textHex: '#0F172A' },
  { id: 'emerald', name: 'Forest Emerald', hex: '#065F46', textHex: '#065F46' },
  { id: 'burgundy', name: 'Classic Burgundy', hex: '#831843', textHex: '#831843' },
  { id: 'royal', name: 'Royal Blue', hex: '#2563EB', textHex: '#2563EB' },
  { id: 'teal', name: 'Modern Teal', hex: '#0F766E', textHex: '#0F766E' },
  { id: 'graphite', name: 'Graphite Black', hex: '#334155', textHex: '#334155' },
  { id: 'mono', name: 'Pure Monochrome', hex: '#000000', textHex: '#000000' },
];

// Sample Initial Resume Data (Senior Software Engineer / Tech Lead)
const SAMPLE_RESUME: ResumeData = {
  personal: {
    fullName: 'Muhammad Ansar',
    jobTitle: 'Senior Full-Stack Engineer & System Architect',
    email: 'ansar@example.com',
    phone: '+92 300 1234567',
    location: 'Lahore, Pakistan',
    linkedin: 'linkedin.com/in/ansar-tech',
    githubOrPortfolio: 'github.com/ansar-dev',
    summary: 'Results-driven Senior Software Engineer with 6+ years of experience building high-throughput web applications and scalable cloud architecture. Proven track record of reducing latency by 42% and driving 99.98% service uptime across microservices serving over 250,000 daily active users.',
  },
  experiences: [
    {
      id: 'exp-1',
      role: 'Lead Full-Stack Engineer',
      company: 'Apex Cloud Solutions',
      location: 'Lahore, Pakistan',
      startDate: 'Jan 2022',
      endDate: 'Present',
      isCurrent: true,
      bullets: [
        'Architected high-concurrency microservices using Next.js, Node.js, and Redis, reducing page load latency by 45% for 180k+ enterprise users.',
        'Spearheaded migration of legacy relational schemas to PostgreSQL and AWS DynamoDB, slashing operational query overhead by $32,000 annually.',
        'Mentored an agile team of 8 junior and mid-level engineers, establishing automated CI/CD deployment pipelines that increased sprint velocity by 35%.',
        'Implemented end-to-end telemetry and observability with Prometheus and Datadog, cutting incident mean-time-to-resolution (MTTR) by 50%.'
      ]
    },
    {
      id: 'exp-2',
      role: 'Full-Stack Developer',
      company: 'NextGen Digital Systems',
      location: 'Islamabad, Pakistan',
      startDate: 'Mar 2019',
      endDate: 'Dec 2021',
      isCurrent: false,
      bullets: [
        'Engineered responsive single-page web applications utilizing React, TypeScript, and Tailwind CSS, increasing mobile user retention by 28%.',
        'Designed secure RESTful and GraphQL API gateways supporting automated stripe & local payment transactions totaling $4.2M in annual GMV.',
        'Optimized database index structures and caching algorithms, boosting API throughput from 450 to 1,800 requests per second.'
      ]
    }
  ],
  education: [
    {
      id: 'edu-1',
      degree: 'Bachelor of Science in Computer Science (BSCS)',
      school: 'National University of Sciences & Technology (NUST)',
      location: 'Islamabad, Pakistan',
      startDate: '2015',
      endDate: '2019',
      scoreOrGpa: '3.82 / 4.00 (Dean’s Honor Roll)'
    }
  ],
  skills: {
    technical: 'JavaScript, TypeScript, React.js, Next.js, Node.js, Python, PostgreSQL, MongoDB, Redis, GraphQL, REST APIs',
    toolsAndFrameworks: 'Docker, Kubernetes, AWS (S3, EC2, Lambda), Git, GitHub Actions, Tailwind CSS, Jest, Postman',
    softSkills: 'Cross-functional Leadership, Agile / Scrum Methodology, System Architecture, Code Review, Mentorship'
  },
  projects: [
    {
      id: 'proj-1',
      name: 'Ansar Multi-Tool Suite',
      technologies: 'Next.js 16, TypeScript, Tailwind CSS, Canvas API, Web Workers',
      link: 'https://ansartools.com',
      description: 'Built a 100% client-side privacy-first web utility platform featuring PDF compression, image background segmentation, typing tutors, and invoice generators with 0 server dependencies.'
    },
    {
      id: 'proj-2',
      name: 'Distributed Task Queue System',
      technologies: 'Node.js, Redis, BullMQ, Docker',
      link: 'https://github.com/ansar-dev/queue',
      description: 'Developed an asynchronous background worker engine handling 25,000 jobs per minute with automatic exponential backoff retry and real-time dashboard analytics.'
    }
  ],
  certifications: [
    {
      id: 'cert-1',
      name: 'AWS Certified Solutions Architect – Associate',
      issuer: 'Amazon Web Services',
      date: '2023'
    },
    {
      id: 'cert-2',
      name: 'Meta Certified Full-Stack Engineer',
      issuer: 'Meta / Coursera',
      date: '2022'
    }
  ],
  languages: 'English (Fluent / Professional), Urdu (Native)'
};

export default function ResumeMakerPage() {
  // State
  const [resumeData, setResumeData] = useState<ResumeData>(SAMPLE_RESUME);
  const [currentTemplate, setCurrentTemplate] = useState<TemplateId>('harvard');
  const [currentColor, setCurrentColor] = useState<string>(COLOR_THEMES[0].hex);
  const [fontFamily, setFontFamily] = useState<'sans' | 'serif' | 'mono'>('sans');
  const [spacingScale, setSpacingScale] = useState<'compact' | 'normal' | 'spacious'>('normal');
  const [zoom, setZoom] = useState<number>(100); // 70% to 130%
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor'); // For mobile toggle
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState<boolean>(false);
  const [isDownloadingWord, setIsDownloadingWord] = useState<boolean>(false);

  // Auto-Save to LocalStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('ansar_resume_data');
      if (saved) {
        setResumeData(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  const saveToLocal = (data: ResumeData) => {
    setResumeData(data);
    try {
      localStorage.setItem('ansar_resume_data', JSON.stringify(data));
    } catch {
      // ignore
    }
  };

  // -------------------------------------------------------------
  // REAL-TIME ATS SCORE CALCULATOR (0 to 100%)
  // -------------------------------------------------------------
  const atsAnalysis = useMemo(() => {
    let score = 0;
    const tips: { message: string; points: number; passed: boolean }[] = [];

    // 1. Contact Information (+20 pts)
    const hasName = resumeData.personal.fullName.trim().length > 2;
    const hasEmail = resumeData.personal.email.includes('@');
    const hasPhone = resumeData.personal.phone.trim().length > 6;
    const hasLocation = resumeData.personal.location.trim().length > 2;
    const hasLinkedin = resumeData.personal.linkedin.trim().length > 5;

    let contactPts = 0;
    if (hasName) contactPts += 4;
    if (hasEmail) contactPts += 4;
    if (hasPhone) contactPts += 4;
    if (hasLocation) contactPts += 4;
    if (hasLinkedin) contactPts += 4;

    score += contactPts;
    tips.push({
      message: 'Complete Contact Info (Name, Email, Phone, City, LinkedIn)',
      points: 20,
      passed: contactPts >= 16
    });

    // 2. Professional Summary (+15 pts)
    const summaryWords = resumeData.personal.summary.trim().split(/\s+/).filter(Boolean).length;
    const summaryPassed = summaryWords >= 30 && summaryWords <= 120;
    if (summaryPassed) score += 15;
    else if (summaryWords > 10) score += 8;
    tips.push({
      message: `Professional Summary Length (${summaryWords} words, optimal 30-100 words)`,
      points: 15,
      passed: summaryPassed
    });

    // 3. Quantified Impact & Metrics (%, $, numbers) in Experience (+25 pts)
    let numberMatches = 0;
    resumeData.experiences.forEach((exp) => {
      exp.bullets.forEach((b) => {
        if (/\d+[%kKmMbB]?|\$\d+|\d+x|\d+\+/.test(b)) {
          numberMatches++;
        }
      });
    });

    const metricsPassed = numberMatches >= 3;
    if (metricsPassed) score += 25;
    else if (numberMatches >= 1) score += 12;
    tips.push({
      message: `Quantifiable Results & Metrics (${numberMatches} numbers/percentages found, aim for 3+)`,
      points: 25,
      passed: metricsPassed
    });

    // 4. Strong Action Verbs (+20 pts)
    const ACTION_VERBS = [
      'spearheaded', 'architected', 'engineered', 'led', 'designed', 'built',
      'increased', 'reduced', 'optimized', 'boosted', 'slashed', 'delivered',
      'implemented', 'accelerated', 'orchestrated', 'managed', 'developed', 'created'
    ];
    let verbMatches = 0;
    const allExpText = resumeData.experiences.flatMap((e) => e.bullets).join(' ').toLowerCase();
    ACTION_VERBS.forEach((v) => {
      if (allExpText.includes(v)) verbMatches++;
    });

    const verbsPassed = verbMatches >= 3;
    if (verbsPassed) score += 20;
    else if (verbMatches >= 1) score += 10;
    tips.push({
      message: `Power Action Verbs (${verbMatches} verified power verbs found, aim for 3+)`,
      points: 20,
      passed: verbsPassed
    });

    // 5. Hard Skills & Keywords (+10 pts)
    const skillCount = resumeData.skills.technical.split(',').filter((s) => s.trim().length > 1).length;
    const skillsPassed = skillCount >= 6;
    if (skillsPassed) score += 10;
    else if (skillCount >= 3) score += 5;
    tips.push({
      message: `Core Skills Density (${skillCount} technical skills listed, aim for 6+)`,
      points: 10,
      passed: skillsPassed
    });

    // 6. Education & Credentials (+10 pts)
    const hasEdu = resumeData.education.length > 0 && resumeData.education[0].school.trim().length > 2;
    if (hasEdu) score += 10;
    tips.push({
      message: 'Verified Academic Degree & University',
      points: 10,
      passed: hasEdu
    });

    return {
      score: Math.min(100, Math.max(0, score)),
      tips
    };
  }, [resumeData]);

  // -------------------------------------------------------------
  // -------------------------------------------------------------
  // ACTIONS: Direct PDF Download, Direct Word (.docx) Download, Print, Copy
  // -------------------------------------------------------------
  const handleDirectDownloadPdf = async () => {
    const paper = document.getElementById('resume-a4-paper');
    if (!paper) {
      handlePrintPdf();
      return;
    }

    setIsDownloadingPdf(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      // Temporarily store style and reset scale so html2canvas captures exact A4 dimensions
      const originalTransform = paper.style.transform;
      paper.style.transform = 'none';

      const canvas = await html2canvas(paper, {
        scale: 2, // Crisp 2x retina clarity
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      // Restore zoom transform
      paper.style.transform = originalTransform;

      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = 210; // A4 standard width in mm
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      const cleanName = (resumeData.personal.fullName || 'resume')
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_');
      pdf.save(`${cleanName}_ats_resume.pdf`);

      setCopiedNotification('PDF downloaded successfully!');
      setTimeout(() => setCopiedNotification(null), 3000);
    } catch (error) {
      console.error('Direct PDF download error, falling back to print dialog:', error);
      handlePrintPdf();
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const handleDownloadWord = async () => {
    setIsDownloadingWord(true);
    try {
      const { Document, Paragraph, TextRun, BorderStyle, Packer } = await import('docx');

      const p = resumeData.personal;
      const accentHex = (currentColor || '#0f766e').replace('#', '');
      const children: InstanceType<typeof Paragraph>[] = [];

      // 1. Title / Name
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: p.fullName || 'YOUR NAME',
              bold: true,
              size: 36, // 18pt
              color: '0F172A',
            }),
          ],
          spacing: { after: 80 },
        })
      );

      // 2. Job Title
      if (p.jobTitle) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: p.jobTitle,
                bold: true,
                size: 24, // 12pt
                color: accentHex,
              }),
            ],
            spacing: { after: 120 },
          })
        );
      }

      // 3. Contact Info
      const contacts = [p.email, p.phone, p.location, p.linkedin, p.githubOrPortfolio].filter(Boolean);
      if (contacts.length > 0) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: contacts.join('  |  '),
                size: 19, // ~9.5pt
                color: '475569',
              }),
            ],
            spacing: { after: 200 },
          })
        );
      }

      // Helper for Section Heading
      const createSectionHeading = (title: string) => {
        return new Paragraph({
          children: [
            new TextRun({
              text: title.toUpperCase(),
              bold: true,
              size: 22, // 11pt
              color: accentHex,
            }),
          ],
          border: {
            bottom: {
              color: accentHex,
              space: 4,
              style: BorderStyle.SINGLE,
              size: 12,
            },
          },
          spacing: { before: 200, after: 100 },
        });
      };

      // 4. Professional Summary
      if (p.summary) {
        children.push(createSectionHeading('Professional Summary'));
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: p.summary,
                size: 20, // 10pt
                color: '334155',
              }),
            ],
            spacing: { after: 160 },
          })
        );
      }

      // 5. Work Experience
      if (resumeData.experiences.length > 0) {
        children.push(createSectionHeading('Work Experience'));
        for (const exp of resumeData.experiences) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: exp.role,
                  bold: true,
                  size: 21,
                  color: '0F172A',
                }),
                new TextRun({
                  text: ` — ${exp.company}${exp.location ? `, ${exp.location}` : ''}`,
                  size: 20,
                  color: '334155',
                }),
                new TextRun({
                  text: `    (${exp.startDate} - ${exp.isCurrent ? 'Present' : exp.endDate})`,
                  bold: true,
                  size: 19,
                  color: '64748B',
                }),
              ],
              spacing: { before: 100, after: 40 },
            })
          );

          for (const bullet of exp.bullets) {
            if (bullet.trim()) {
              children.push(
                new Paragraph({
                  bullet: { level: 0 },
                  children: [
                    new TextRun({
                      text: bullet,
                      size: 20,
                      color: '334155',
                    }),
                  ],
                  spacing: { after: 40 },
                })
              );
            }
          }
        }
      }

      // 6. Education
      if (resumeData.education.length > 0) {
        children.push(createSectionHeading('Education'));
        for (const edu of resumeData.education) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: edu.degree,
                  bold: true,
                  size: 21,
                  color: '0F172A',
                }),
                new TextRun({
                  text: ` — ${edu.school}${edu.location ? `, ${edu.location}` : ''}`,
                  size: 20,
                  color: '334155',
                }),
                new TextRun({
                  text: `    (${edu.startDate} - ${edu.endDate})`,
                  bold: true,
                  size: 19,
                  color: '64748B',
                }),
              ],
              spacing: { before: 100, after: 40 },
            })
          );
          if (edu.scoreOrGpa) {
            children.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Grade / GPA: ${edu.scoreOrGpa}`,
                    italics: true,
                    size: 19,
                    color: '64748B',
                  }),
                ],
                spacing: { after: 60 },
              })
            );
          }
        }
      }

      // 7. Skills
      const { technical, toolsAndFrameworks, softSkills } = resumeData.skills;
      if (technical || toolsAndFrameworks || softSkills) {
        children.push(createSectionHeading('Skills & Expertise'));
        if (technical) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({ text: 'Technical Skills: ', bold: true, size: 20, color: '0F172A' }),
                new TextRun({ text: technical, size: 20, color: '334155' }),
              ],
              spacing: { after: 50 },
            })
          );
        }
        if (toolsAndFrameworks) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({ text: 'Tools & Technologies: ', bold: true, size: 20, color: '0F172A' }),
                new TextRun({ text: toolsAndFrameworks, size: 20, color: '334155' }),
              ],
              spacing: { after: 50 },
            })
          );
        }
        if (softSkills) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({ text: 'Core Competencies: ', bold: true, size: 20, color: '0F172A' }),
                new TextRun({ text: softSkills, size: 20, color: '334155' }),
              ],
              spacing: { after: 80 },
            })
          );
        }
      }

      // 8. Projects
      if (resumeData.projects.length > 0) {
        children.push(createSectionHeading('Projects'));
        for (const proj of resumeData.projects) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({ text: proj.name, bold: true, size: 21, color: '0F172A' }),
                ...(proj.technologies ? [new TextRun({ text: ` (${proj.technologies})`, italics: true, size: 19, color: '64748B' })] : []),
                ...(proj.link ? [new TextRun({ text: ` — ${proj.link}`, size: 19, color: accentHex })] : []),
              ],
              spacing: { before: 80, after: 30 },
            })
          );
          if (proj.description) {
            children.push(
              new Paragraph({
                children: [new TextRun({ text: proj.description, size: 20, color: '334155' })],
                spacing: { after: 60 },
              })
            );
          }
        }
      }

      // 9. Certifications
      if (resumeData.certifications.length > 0) {
        children.push(createSectionHeading('Certifications'));
        for (const cert of resumeData.certifications) {
          children.push(
            new Paragraph({
              bullet: { level: 0 },
              children: [
                new TextRun({ text: cert.name, bold: true, size: 20, color: '0F172A' }),
                new TextRun({ text: ` — ${cert.issuer} (${cert.date})`, size: 20, color: '334155' }),
              ],
              spacing: { after: 40 },
            })
          );
        }
      }

      // 10. Languages
      if (resumeData.languages) {
        children.push(createSectionHeading('Languages'));
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: resumeData.languages, size: 20, color: '334155' }),
            ],
            spacing: { after: 80 },
          })
        );
      }

      const doc = new Document({
        sections: [
          {
            properties: {
              page: {
                margin: {
                  top: 720,
                  bottom: 720,
                  left: 720,
                  right: 720,
                },
              },
            },
            children,
          },
        ],
      });

      const blob = await Packer.toBlob(doc);
      const cleanName = (p.fullName || 'resume').trim().toLowerCase().replace(/[^a-z0-9]+/g, '_');
      const fileName = `${cleanName}_ats_resume.docx`;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setCopiedNotification('Word document (.docx) downloaded successfully!');
      setTimeout(() => setCopiedNotification(null), 3000);
    } catch (err) {
      console.error('Word export error:', err);
      alert('Error generating Word (.docx) file. Please try again.');
    } finally {
      setIsDownloadingWord(false);
    }
  };

  const handlePrintPdf = () => {
    const paper = document.getElementById('resume-a4-paper');
    if (!paper) {
      window.print();
      return;
    }

    // Remove any previous print frame if exists
    const oldFrame = document.getElementById('ansar-resume-print-frame');
    if (oldFrame) {
      oldFrame.remove();
    }

    const printFrame = document.createElement('iframe');
    printFrame.id = 'ansar-resume-print-frame';
    printFrame.style.position = 'fixed';
    printFrame.style.right = '0';
    printFrame.style.bottom = '0';
    printFrame.style.width = '0';
    printFrame.style.height = '0';
    printFrame.style.border = '0';
    printFrame.style.visibility = 'hidden';
    document.body.appendChild(printFrame);

    const doc = printFrame.contentWindow?.document;
    if (!doc) {
      window.print();
      return;
    }

    // Collect all stylesheets and style tags
    let stylesHtml = '';
    const styleElements = document.querySelectorAll('link[rel="stylesheet"], style');
    styleElements.forEach((el) => {
      stylesHtml += el.outerHTML;
    });

    const fontClass = fontFamily === 'serif' ? 'font-serif' : fontFamily === 'mono' ? 'font-mono' : 'font-sans';
    const paddingStyle = spacingScale === 'compact' ? '12mm 15mm' : spacingScale === 'spacious' ? '20mm 22mm' : '15mm 18mm';

    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>${(resumeData.personal.fullName || 'Resume').replace(/"/g, '&quot;')} - ATS Resume</title>
          ${stylesHtml}
          <style>
            @page {
              size: A4 portrait;
              margin: 0;
            }
            *, *::before, *::after {
              box-sizing: border-box;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
            html, body {
              background: #ffffff !important;
              background-color: #ffffff !important;
              color: #0f172a !important;
              margin: 0 !important;
              padding: 0 !important;
              width: 100% !important;
              font-family: inherit;
            }
            .resume-print-container {
              width: 210mm !important;
              min-height: 297mm !important;
              margin: 0 auto !important;
              padding: ${paddingStyle} !important;
              background: #ffffff !important;
              background-color: #ffffff !important;
              color: #0f172a !important;
              box-shadow: none !important;
              border-radius: 0 !important;
              transform: none !important;
            }
          </style>
        </head>
        <body class="${fontClass}">
          <div class="resume-print-container ${fontClass}">
            ${paper.innerHTML}
          </div>
        </body>
      </html>
    `);
    doc.close();

    // Small delay to let browser render fonts and CSS
    setTimeout(() => {
      try {
        printFrame.contentWindow?.focus();
        printFrame.contentWindow?.print();
      } catch (err) {
        console.error('Iframe print error:', err);
        window.print();
      } finally {
        setTimeout(() => {
          if (printFrame.parentNode) {
            printFrame.parentNode.removeChild(printFrame);
          }
        }, 2500);
      }
    }, 350);
  };

  const handleCopyPlainText = async () => {
    const p = resumeData.personal;
    const plainText = `
${p.fullName.toUpperCase()}
${p.jobTitle}
${p.email} | ${p.phone} | ${p.location} | ${p.linkedin}

PROFESSIONAL SUMMARY
${p.summary}

WORK EXPERIENCE
${resumeData.experiences.map((exp) => `
${exp.role} - ${exp.company}, ${exp.location}
${exp.startDate} - ${exp.isCurrent ? 'Present' : exp.endDate}
${exp.bullets.map((b) => `• ${b}`).join('\n')}
`).join('\n')}

EDUCATION
${resumeData.education.map((edu) => `
${edu.degree} - ${edu.school}, ${edu.location} (${edu.startDate} - ${edu.endDate})
Grade/Score: ${edu.scoreOrGpa}
`).join('\n')}

TECHNICAL SKILLS
• Technical: ${resumeData.skills.technical}
• Tools & Frameworks: ${resumeData.skills.toolsAndFrameworks}
• Soft Skills: ${resumeData.skills.softSkills}

PROJECTS
${resumeData.projects.map((pr) => `
${pr.name} [${pr.technologies}]
${pr.link}
${pr.description}
`).join('\n')}

CERTIFICATIONS
${resumeData.certifications.map((c) => `• ${c.name} - ${c.issuer} (${c.date})`).join('\n')}

LANGUAGES
${resumeData.languages}
    `.trim();

    try {
      await navigator.clipboard.writeText(plainText);
      setCopiedNotification('Plain Text ATS string copied to clipboard!');
      setTimeout(() => setCopiedNotification(null), 3500);
    } catch {
      alert('Could not copy to clipboard.');
    }
  };

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(resumeData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${resumeData.personal.fullName.toLowerCase().replace(/\s+/g, '_')}_resume.json`;
    link.click();
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const parsed = JSON.parse(ev.target?.result as string);
          saveToLocal(parsed);
          alert('Resume profile imported successfully!');
        } catch {
          alert('Invalid JSON file format.');
        }
      };
      reader.readAsText(file);
    }
  };

  // Pre-written Google X-Y-Z Bullet Formulas
  const insertBulletFormula = (expIndex: number) => {
    const formulas = [
      'Accelerated [process/system] by [X]%, resulting in [Y benefit] by implementing [Z technology].',
      'Orchestrated [project name] delivered [X weeks] ahead of schedule, generating $[Y] in new revenue.',
      'Reduced server response latency from [X ms] to [Y ms] by redesigning database indexing on [Z].',
      'Spearheaded cross-functional team of [X members], leading to a [Y]% reduction in customer churn.'
    ];
    const picked = formulas[Math.floor(Math.random() * formulas.length)];

    const updated = { ...resumeData };
    updated.experiences[expIndex].bullets.push(picked);
    saveToLocal(updated);
  };

  return (
    <div className="resume-maker-page min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-emerald-600 selection:text-white print:bg-white print:text-slate-900 print:min-h-0 print:p-0 print:m-0">
      <div className="print:hidden">
        <Navbar />
      </div>

      {/* TOP STUDIO TOOLBAR (Sticky) */}
      <header className="sticky top-0 z-30 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 py-3 px-3 sm:px-6 shadow-xl print:hidden">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-bold text-white tracking-tight">
                  Ansar Pro ATS Resume Maker
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  99% Pass Rate
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Beat automated recruiter screening bots with 100% validated ATS layouts
              </p>
            </div>
          </div>

          {/* REAL-TIME ATS SCORE BADGE */}
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl shadow-inner">
            <div className="relative w-8 h-8 flex items-center justify-center">
              <svg className="w-8 h-8 -rotate-90">
                <circle cx="16" cy="16" r="14" stroke="#1e293b" strokeWidth="3" fill="none" />
                <circle
                  cx="16"
                  cy="16"
                  r="14"
                  stroke={atsAnalysis.score >= 80 ? '#10B981' : atsAnalysis.score >= 60 ? '#F59E0B' : '#EF4444'}
                  strokeWidth="3"
                  strokeDasharray="88"
                  strokeDashoffset={88 - (88 * atsAnalysis.score) / 100}
                  strokeLinecap="round"
                  fill="none"
                  className="transition-all duration-500"
                />
              </svg>
              <span className="absolute text-[10px] font-bold text-white font-mono">
                {atsAnalysis.score}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider block text-slate-400">
                Live ATS Score
              </span>
              <span className={`text-xs font-bold ${
                atsAnalysis.score >= 80 ? 'text-emerald-400' : atsAnalysis.score >= 60 ? 'text-amber-400' : 'text-rose-400'
              }`}>
                {atsAnalysis.score >= 80 ? '🌟 Excellent' : atsAnalysis.score >= 60 ? '⚡ Good' : '⚠️ Needs Work'}
              </span>
            </div>
          </div>

          {/* ACTIONS: Download PDF, Plain Text, Save */}
          <div className="flex items-center gap-2">
            {/* Mobile Tab Switcher */}
            <div className="flex lg:hidden bg-slate-900 border border-slate-800 p-0.5 rounded-xl">
              <button
                type="button"
                onClick={() => setActiveTab('editor')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg ${
                  activeTab === 'editor' ? 'bg-emerald-600 text-white' : 'text-slate-400'
                }`}
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg ${
                  activeTab === 'preview' ? 'bg-emerald-600 text-white' : 'text-slate-400'
                }`}
              >
                Preview
              </button>
            </div>

            {/* 1-Click Direct Download PDF */}
            <button
              type="button"
              onClick={handleDirectDownloadPdf}
              disabled={isDownloadingPdf}
              className="px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-600/25 transition-all hover:scale-105 cursor-pointer disabled:opacity-60"
              title="Direct 1-Click Download ATS PDF"
            >
              {isDownloadingPdf ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <Download className="w-4 h-4 text-white" />
              )}
              <span>{isDownloadingPdf ? 'Creating PDF...' : 'Download PDF'}</span>
            </button>

            {/* 1-Click Direct Download Word (.docx) */}
            <button
              type="button"
              onClick={handleDownloadWord}
              disabled={isDownloadingWord}
              className="px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-blue-600/25 transition-all hover:scale-105 cursor-pointer disabled:opacity-60"
              title="Direct 1-Click Download Microsoft Word Document (.docx)"
            >
              {isDownloadingWord ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <FileText className="w-4 h-4 text-white" />
              )}
              <span>{isDownloadingWord ? 'Creating Word...' : 'Download Word (.docx)'}</span>
            </button>

            {/* Print / Vector PDF */}
            <button
              type="button"
              onClick={handlePrintPdf}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              title="Print / Save via browser print dialog (Ctrl+P)"
            >
              <Printer className="w-3.5 h-3.5 text-slate-400" />
              <span>Print</span>
            </button>

            {/* Copy Plain Text */}
            <button
              type="button"
              onClick={handleCopyPlainText}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              title="Copy plain text formatted for job application textboxes"
            >
              <Copy className="w-3.5 h-3.5 text-blue-400" /> Copy Text
            </button>
          </div>
        </div>

        {/* SUB-BAR: Template Selector, Color Swatches, Spacing */}
        <div className="max-w-7xl mx-auto mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Templates */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
            <span className="text-slate-400 font-semibold shrink-0">Template:</span>
            {TEMPLATES.map((tpl) => (
              <button
                key={tpl.id}
                type="button"
                onClick={() => setCurrentTemplate(tpl.id)}
                className={`px-3 py-1 rounded-lg shrink-0 font-semibold border transition-all ${
                  currentTemplate === tpl.id
                    ? 'bg-emerald-500/10 border-emerald-500 text-emerald-300 shadow-sm'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {tpl.name}
              </button>
            ))}
          </div>

          {/* Color Palettes & Font */}
          <div className="flex items-center gap-4">
            {/* Color circles */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-semibold text-[11px]">Color:</span>
              {COLOR_THEMES.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCurrentColor(c.hex)}
                  className={`w-5 h-5 rounded-full border transition-transform ${
                    currentColor === c.hex ? 'scale-125 ring-2 ring-white border-white' : 'border-slate-700 hover:scale-110'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
            </div>

            {/* Font */}
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-0.5 rounded-lg text-[11px]">
              <button
                type="button"
                onClick={() => setFontFamily('sans')}
                className={`px-2 py-0.5 rounded ${fontFamily === 'sans' ? 'bg-slate-700 text-white font-bold' : 'text-slate-400'}`}
              >
                Sans
              </button>
              <button
                type="button"
                onClick={() => setFontFamily('serif')}
                className={`px-2 py-0.5 rounded font-serif ${fontFamily === 'serif' ? 'bg-slate-700 text-white font-bold' : 'text-slate-400'}`}
              >
                Serif
              </button>
            </div>

            {/* Spacing / 1-Page Fit */}
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-0.5 rounded-lg text-[11px]">
              <span className="px-1 text-slate-500">Fit:</span>
              <button
                type="button"
                onClick={() => setSpacingScale('compact')}
                className={`px-2 py-0.5 rounded ${spacingScale === 'compact' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400'}`}
                title="Tighter spacing to fit more on 1 page"
              >
                1-Page
              </button>
              <button
                type="button"
                onClick={() => setSpacingScale('normal')}
                className={`px-2 py-0.5 rounded ${spacingScale === 'normal' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400'}`}
              >
                Normal
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Copy Notification Toast */}
      {copiedNotification && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom">
          <CheckCircle2 className="w-4 h-4" />
          <span>{copiedNotification}</span>
        </div>
      )}

      {/* MAIN WORKSPACE: SPLIT-VIEW (LEFT: FORM EDITOR, RIGHT: LIVE PAPER PREVIEW) */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 flex flex-col lg:flex-row gap-6 items-start print:p-0 print:m-0 print:max-w-none print:w-full print:block">
        
        {/* =========================================================
           LEFT COLUMN: FORM EDITOR (Structured ATS Inputs)
           ========================================================= */}
        <div className={`w-full lg:w-[48%] flex-col gap-6 print:hidden ${activeTab === 'editor' ? 'flex' : 'hidden lg:flex'}`}>
          
          {/* CARD: ATS AUDIT & TIPS BREAKDOWN */}
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-400" /> Real-Time ATS Optimization Scorecard
              </h3>
              <span className="font-mono text-xs font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-lg">
                {atsAnalysis.score} / 100
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {atsAnalysis.tips.map((t, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-xl border flex items-start gap-2 ${
                    t.passed
                      ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  {t.passed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  )}
                  <span className="text-[11px] leading-tight">{t.message}</span>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 1: PERSONAL INFORMATION */}
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-800 pb-2">
              <Globe className="w-4 h-4 text-emerald-400" /> Personal & Contact Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 text-[11px] font-semibold mb-1">Full Name *</label>
                <input
                  type="text"
                  value={resumeData.personal.fullName}
                  onChange={(e) => saveToLocal({
                    ...resumeData,
                    personal: { ...resumeData.personal, fullName: e.target.value }
                  })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-medium focus:border-emerald-500 outline-none"
                  placeholder="e.g. Muhammad Ansar"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-[11px] font-semibold mb-1">Target Job Title *</label>
                <input
                  type="text"
                  value={resumeData.personal.jobTitle}
                  onChange={(e) => saveToLocal({
                    ...resumeData,
                    personal: { ...resumeData.personal, jobTitle: e.target.value }
                  })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-medium focus:border-emerald-500 outline-none"
                  placeholder="e.g. Senior Software Engineer"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-[11px] font-semibold mb-1">Email Address *</label>
                <input
                  type="email"
                  value={resumeData.personal.email}
                  onChange={(e) => saveToLocal({
                    ...resumeData,
                    personal: { ...resumeData.personal, email: e.target.value }
                  })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-medium focus:border-emerald-500 outline-none"
                  placeholder="ansar@example.com"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-[11px] font-semibold mb-1">Phone Number *</label>
                <input
                  type="text"
                  value={resumeData.personal.phone}
                  onChange={(e) => saveToLocal({
                    ...resumeData,
                    personal: { ...resumeData.personal, phone: e.target.value }
                  })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-medium focus:border-emerald-500 outline-none"
                  placeholder="+92 300 1234567"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-[11px] font-semibold mb-1">Location (City, Country)</label>
                <input
                  type="text"
                  value={resumeData.personal.location}
                  onChange={(e) => saveToLocal({
                    ...resumeData,
                    personal: { ...resumeData.personal, location: e.target.value }
                  })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-medium focus:border-emerald-500 outline-none"
                  placeholder="Lahore, Pakistan"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-[11px] font-semibold mb-1">LinkedIn Profile</label>
                <input
                  type="text"
                  value={resumeData.personal.linkedin}
                  onChange={(e) => saveToLocal({
                    ...resumeData,
                    personal: { ...resumeData.personal, linkedin: e.target.value }
                  })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-medium focus:border-emerald-500 outline-none"
                  placeholder="linkedin.com/in/ansar"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-slate-400 text-[11px] font-semibold">Professional Summary</label>
                <span className="text-[10px] text-slate-500 font-mono">
                  {resumeData.personal.summary.split(/\s+/).filter(Boolean).length} words
                </span>
              </div>
              <textarea
                rows={3}
                value={resumeData.personal.summary}
                onChange={(e) => saveToLocal({
                  ...resumeData,
                  personal: { ...resumeData.personal, summary: e.target.value }
                })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white text-xs leading-relaxed focus:border-emerald-500 outline-none resize-y"
                placeholder="2-4 impactful sentences summarizing your key achievements, core skills, and value proposition..."
              />
            </div>
          </div>

          {/* SECTION 2: WORK EXPERIENCE */}
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-emerald-400" /> Work Experience
              </h3>
              <button
                type="button"
                onClick={() => {
                  const updated = { ...resumeData };
                  updated.experiences.push({
                    id: 'exp-' + Date.now(),
                    role: '',
                    company: '',
                    location: '',
                    startDate: '',
                    endDate: '',
                    isCurrent: false,
                    bullets: ['Led development of key features, achieving a 25% boost in user retention.']
                  });
                  saveToLocal(updated);
                }}
                className="text-[11px] text-emerald-400 hover:underline font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Experience
              </button>
            </div>

            <div className="space-y-4">
              {resumeData.experiences.map((exp, expIdx) => (
                <div key={exp.id} className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Position #{expIdx + 1}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = { ...resumeData };
                        updated.experiences = updated.experiences.filter((_, i) => i !== expIdx);
                        saveToLocal(updated);
                      }}
                      className="text-slate-500 hover:text-rose-400 p-1"
                      title="Delete experience"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="text-[10px] text-slate-400">Job Title / Role *</label>
                      <input
                        type="text"
                        value={exp.role}
                        onChange={(e) => {
                          const updated = { ...resumeData };
                          updated.experiences[expIdx].role = e.target.value;
                          saveToLocal(updated);
                        }}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white"
                        placeholder="e.g. Lead Developer"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400">Company Name *</label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => {
                          const updated = { ...resumeData };
                          updated.experiences[expIdx].company = e.target.value;
                          saveToLocal(updated);
                        }}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white"
                        placeholder="e.g. Google / Microsoft"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400">Location</label>
                      <input
                        type="text"
                        value={exp.location}
                        onChange={(e) => {
                          const updated = { ...resumeData };
                          updated.experiences[expIdx].location = e.target.value;
                          saveToLocal(updated);
                        }}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white"
                        placeholder="e.g. Remote / London, UK"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400">Date Range</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={exp.startDate}
                          onChange={(e) => {
                            const updated = { ...resumeData };
                            updated.experiences[expIdx].startDate = e.target.value;
                            saveToLocal(updated);
                          }}
                          className="w-1/2 bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-white text-[11px]"
                          placeholder="Jan 2022"
                        />
                        <input
                          type="text"
                          value={exp.isCurrent ? 'Present' : exp.endDate}
                          disabled={exp.isCurrent}
                          onChange={(e) => {
                            const updated = { ...resumeData };
                            updated.experiences[expIdx].endDate = e.target.value;
                            saveToLocal(updated);
                          }}
                          className="w-1/2 bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-white text-[11px] disabled:opacity-50"
                          placeholder="Present"
                        />
                      </div>
                      <label className="inline-flex items-center gap-1 text-[10px] text-slate-400 mt-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={exp.isCurrent}
                          onChange={(e) => {
                            const updated = { ...resumeData };
                            updated.experiences[expIdx].isCurrent = e.target.checked;
                            saveToLocal(updated);
                          }}
                          className="rounded accent-emerald-500"
                        />
                        Currently working here
                      </label>
                    </div>
                  </div>

                  {/* Bullets */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-semibold text-slate-300">Achievement Bullets:</span>
                      <button
                        type="button"
                        onClick={() => insertBulletFormula(expIdx)}
                        className="text-[10px] text-amber-400 hover:underline flex items-center gap-1 font-semibold"
                        title="Insert Google X-Y-Z formula bullet point"
                      >
                        <Zap className="w-3 h-3" /> + Power Bullet Formula
                      </button>
                    </div>

                    <div className="space-y-2">
                      {exp.bullets.map((b, bIdx) => (
                        <div key={bIdx} className="flex items-start gap-1.5">
                          <span className="text-slate-500 mt-2 text-xs">•</span>
                          <textarea
                            rows={2}
                            value={b}
                            onChange={(e) => {
                              const updated = { ...resumeData };
                              updated.experiences[expIdx].bullets[bIdx] = e.target.value;
                              saveToLocal(updated);
                            }}
                            className="flex-1 bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white leading-relaxed focus:border-emerald-500 outline-none"
                            placeholder="Accomplished [X], as measured by [Y], by doing [Z]..."
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = { ...resumeData };
                              updated.experiences[expIdx].bullets = updated.experiences[expIdx].bullets.filter((_, i) => i !== bIdx);
                              saveToLocal(updated);
                            }}
                            className="text-slate-600 hover:text-rose-400 p-1 mt-1"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          const updated = { ...resumeData };
                          updated.experiences[expIdx].bullets.push('');
                          saveToLocal(updated);
                        }}
                        className="text-[11px] text-slate-400 hover:text-emerald-400 font-semibold"
                      >
                        + Add Bullet Point
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 3: EDUCATION */}
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-emerald-400" /> Education
              </h3>
              <button
                type="button"
                onClick={() => {
                  const updated = { ...resumeData };
                  updated.education.push({
                    id: 'edu-' + Date.now(),
                    degree: '',
                    school: '',
                    location: '',
                    startDate: '',
                    endDate: '',
                    scoreOrGpa: ''
                  });
                  saveToLocal(updated);
                }}
                className="text-[11px] text-emerald-400 hover:underline font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Degree
              </button>
            </div>

            <div className="space-y-3">
              {resumeData.education.map((edu, eduIdx) => (
                <div key={edu.id} className="p-3 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-white">Degree #{eduIdx + 1}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = { ...resumeData };
                        updated.education = updated.education.filter((_, i) => i !== eduIdx);
                        saveToLocal(updated);
                      }}
                      className="text-slate-500 hover:text-rose-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="text-[10px] text-slate-400">Degree & Major *</label>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => {
                          const updated = { ...resumeData };
                          updated.education[eduIdx].degree = e.target.value;
                          saveToLocal(updated);
                        }}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white"
                        placeholder="e.g. BS in Computer Science"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400">University / College *</label>
                      <input
                        type="text"
                        value={edu.school}
                        onChange={(e) => {
                          const updated = { ...resumeData };
                          updated.education[eduIdx].school = e.target.value;
                          saveToLocal(updated);
                        }}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white"
                        placeholder="e.g. Stanford University"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400">Graduation Year</label>
                      <input
                        type="text"
                        value={edu.endDate}
                        onChange={(e) => {
                          const updated = { ...resumeData };
                          updated.education[eduIdx].endDate = e.target.value;
                          saveToLocal(updated);
                        }}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white"
                        placeholder="2019"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400">Score / GPA / Honors</label>
                      <input
                        type="text"
                        value={edu.scoreOrGpa}
                        onChange={(e) => {
                          const updated = { ...resumeData };
                          updated.education[eduIdx].scoreOrGpa = e.target.value;
                          saveToLocal(updated);
                        }}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white"
                        placeholder="3.8 / 4.0 (Magna Cum Laude)"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 4: SKILLS */}
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-800 pb-2">
              <Zap className="w-4 h-4 text-emerald-400" /> Skills & Core Competencies
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 text-[11px] font-semibold mb-1">
                  Technical & Programming Skills (Comma separated) *
                </label>
                <input
                  type="text"
                  value={resumeData.skills.technical}
                  onChange={(e) => saveToLocal({
                    ...resumeData,
                    skills: { ...resumeData.skills, technical: e.target.value }
                  })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  placeholder="JavaScript, Python, React, Next.js, Node.js, SQL..."
                />
              </div>

              <div>
                <label className="block text-slate-400 text-[11px] font-semibold mb-1">
                  Tools, Frameworks & Cloud (Comma separated)
                </label>
                <input
                  type="text"
                  value={resumeData.skills.toolsAndFrameworks}
                  onChange={(e) => saveToLocal({
                    ...resumeData,
                    skills: { ...resumeData.skills, toolsAndFrameworks: e.target.value }
                  })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  placeholder="AWS, Docker, Git, Redis, Tailwind CSS, Kubernetes..."
                />
              </div>

              <div>
                <label className="block text-slate-400 text-[11px] font-semibold mb-1">
                  Soft Skills & Methodologies (Comma separated)
                </label>
                <input
                  type="text"
                  value={resumeData.skills.softSkills}
                  onChange={(e) => saveToLocal({
                    ...resumeData,
                    skills: { ...resumeData.skills, softSkills: e.target.value }
                  })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  placeholder="Team Leadership, Agile/Scrum, Problem Solving, Communication..."
                />
              </div>
            </div>
          </div>

          {/* SECTION 5: PROJECTS & CERTIFICATIONS */}
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <FolderGit2 className="w-4 h-4 text-emerald-400" /> Key Projects & Certifications
              </h3>
              <button
                type="button"
                onClick={() => {
                  const updated = { ...resumeData };
                  updated.projects.push({
                    id: 'proj-' + Date.now(),
                    name: '',
                    technologies: '',
                    link: '',
                    description: ''
                  });
                  saveToLocal(updated);
                }}
                className="text-[11px] text-emerald-400 hover:underline font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Project
              </button>
            </div>

            <div className="space-y-3">
              {resumeData.projects.map((pr, prIdx) => (
                <div key={pr.id} className="p-3 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <input
                      type="text"
                      value={pr.name}
                      onChange={(e) => {
                        const updated = { ...resumeData };
                        updated.projects[prIdx].name = e.target.value;
                        saveToLocal(updated);
                      }}
                      className="bg-transparent font-bold text-white border-b border-slate-700 outline-none w-2/3"
                      placeholder="Project Name"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = { ...resumeData };
                        updated.projects = updated.projects.filter((_, i) => i !== prIdx);
                        saveToLocal(updated);
                      }}
                      className="text-slate-500 hover:text-rose-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={pr.technologies}
                      onChange={(e) => {
                        const updated = { ...resumeData };
                        updated.projects[prIdx].technologies = e.target.value;
                        saveToLocal(updated);
                      }}
                      className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-white text-[11px]"
                      placeholder="Tech Stack (e.g. Next.js, Redis)"
                    />
                    <input
                      type="text"
                      value={pr.link}
                      onChange={(e) => {
                        const updated = { ...resumeData };
                        updated.projects[prIdx].link = e.target.value;
                        saveToLocal(updated);
                      }}
                      className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-white text-[11px]"
                      placeholder="Live URL / GitHub link"
                    />
                  </div>
                  <textarea
                    rows={2}
                    value={pr.description}
                    onChange={(e) => {
                      const updated = { ...resumeData };
                      updated.projects[prIdx].description = e.target.value;
                      saveToLocal(updated);
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white text-[11px]"
                    placeholder="Short description of what the project does and its impact..."
                  />
                </div>
              ))}
            </div>

            {/* Profile Import / Export Tools */}
            <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleExportJson}
                  className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-700 rounded-lg text-[11px] text-slate-300 font-semibold transition-all"
                >
                  Export JSON Backup
                </button>
                <label className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-700 rounded-lg text-[11px] text-slate-300 font-semibold cursor-pointer transition-all">
                  Import JSON
                  <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
                </label>
              </div>

              <button
                type="button"
                onClick={() => saveToLocal(SAMPLE_RESUME)}
                className="text-[11px] text-slate-400 hover:text-emerald-400 flex items-center gap-1 font-semibold"
              >
                <RotateCcw className="w-3 h-3" /> Load Tech Lead Demo Profile
              </button>
            </div>
          </div>
        </div>

        {/* =========================================================
           RIGHT COLUMN: LIVE A4 PAPER PREVIEW (WYSIWYG)
           ========================================================= */}
        <div className={`w-full lg:w-[52%] sticky top-28 flex flex-col items-center gap-3 print:flex print:static print:w-full print:p-0 print:m-0 print:top-0 ${activeTab === 'preview' ? 'flex' : 'hidden lg:flex'}`}>
          
          {/* Paper View Controls */}
          <div className="w-full flex items-center justify-between text-xs text-slate-400 px-2 print:hidden">
            <div className="flex items-center gap-2">
              <span className="font-semibold flex items-center gap-1 text-slate-300">
                <Eye className="w-4 h-4 text-emerald-400" /> A4 Live Paper Preview
              </span>
              <div className="hidden sm:flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleDirectDownloadPdf}
                  disabled={isDownloadingPdf}
                  className="px-2.5 py-0.5 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/30 rounded-md text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer disabled:opacity-50"
                  title="Direct Download PDF"
                >
                  {isDownloadingPdf ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Download className="w-3 h-3" />
                  )}
                  <span>PDF</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownloadWord}
                  disabled={isDownloadingWord}
                  className="px-2.5 py-0.5 bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 border border-blue-500/30 rounded-md text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer disabled:opacity-50"
                  title="Direct Download Word (.docx)"
                >
                  {isDownloadingWord ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <FileText className="w-3 h-3" />
                  )}
                  <span>Word (.docx)</span>
                </button>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setZoom((z) => Math.max(70, z - 10))}
                className="px-2 py-0.5 bg-slate-900 hover:bg-slate-800 rounded text-slate-300 text-[11px]"
              >
                -
              </button>
              <span className="font-mono text-[11px]">{zoom}%</span>
              <button
                type="button"
                onClick={() => setZoom((z) => Math.min(130, z + 10))}
                className="px-2 py-0.5 bg-slate-900 hover:bg-slate-800 rounded text-slate-300 text-[11px]"
              >
                +
              </button>
              <button
                type="button"
                onClick={() => setZoom(100)}
                className="text-[10px] text-emerald-400 hover:underline ml-1"
              >
                Reset
              </button>
            </div>
          </div>

          {/* =========================================================
             THE PRINTABLE RESUME A4 PAPER
             ========================================================= */}
          <div className="w-full overflow-auto flex justify-center py-2 print:overflow-visible print:p-0 print:m-0 print:block">
            <div
              id="resume-a4-paper"
              className={`bg-white text-slate-900 shadow-2xl rounded-sm print:shadow-none print:rounded-none print:m-0 print:w-full origin-top transition-transform ${
                fontFamily === 'serif' ? 'font-serif' : fontFamily === 'mono' ? 'font-mono' : 'font-sans'
              }`}
              style={{
                width: '210mm',
                minHeight: '297mm',
                padding: spacingScale === 'compact' ? '12mm 15mm' : spacingScale === 'spacious' ? '20mm 22mm' : '15mm 18mm',
                transform: `scale(${zoom / 100})`,
                transformOrigin: 'top center',
              }}
            >
              {/* RENDER TEMPLATE */}
              {renderTemplateComponent(currentTemplate, resumeData, currentColor, spacingScale)}
            </div>
          </div>
        </div>
      </main>

      {/* PRINT STYLESHEET OVERRIDES */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media print {
              @page {
                size: A4 portrait;
                margin: 0;
              }
              *, *::before, *::after {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                color-adjust: exact !important;
              }
              html, body {
                background: #ffffff !important;
                background-color: #ffffff !important;
                color: #0f172a !important;
                margin: 0 !important;
                padding: 0 !important;
                width: 100% !important;
              }
              .resume-maker-page {
                background: #ffffff !important;
                background-color: #ffffff !important;
                color: #0f172a !important;
                min-height: 0 !important;
                padding: 0 !important;
                margin: 0 !important;
              }
              header, nav, footer, .print\\:hidden, [class*="print:hidden"] {
                display: none !important;
              }
              #resume-a4-paper {
                box-shadow: none !important;
                border-radius: 0 !important;
                transform: none !important;
                margin: 0 auto !important;
                width: 100% !important;
                max-width: 210mm !important;
                min-height: 297mm !important;
                background: #ffffff !important;
                background-color: #ffffff !important;
                color: #0f172a !important;
              }
            }
          `,
        }}
      />

      <div className="print:hidden">
        <Footer />
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// TEMPLATE RENDER ENGINE
// -------------------------------------------------------------
function renderTemplateComponent(
  templateId: TemplateId,
  data: ResumeData,
  accentColor: string,
  spacing: 'compact' | 'normal' | 'spacious'
) {
  const p = data.personal;
  const lineSpacingClass = spacing === 'compact' ? 'space-y-2' : spacing === 'spacious' ? 'space-y-4' : 'space-y-3';
  const itemGapClass = spacing === 'compact' ? 'space-y-1.5' : 'space-y-2.5';
  const headingMargin = spacing === 'compact' ? 'mb-1' : 'mb-2';

  // --- TEMPLATE 1: HARVARD / IVY LEAGUE CLASSIC ---
  if (templateId === 'harvard') {
    return (
      <div className={`text-slate-900 text-[13px] leading-relaxed ${lineSpacingClass}`}>
        {/* Header */}
        <div className="text-center border-b-2 pb-3" style={{ borderColor: accentColor }}>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase">
            {p.fullName}
          </h1>
          <p className="text-xs font-bold mt-0.5" style={{ color: accentColor }}>
            {p.jobTitle}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-0.5 text-[11px] text-slate-600 mt-1.5">
            {p.location && <span>{p.location}</span>}
            {p.phone && <span>• {p.phone}</span>}
            {p.email && <span>• {p.email}</span>}
            {p.linkedin && <span>• {p.linkedin}</span>}
            {p.githubOrPortfolio && <span>• {p.githubOrPortfolio}</span>}
          </div>
        </div>

        {/* Professional Summary */}
        {p.summary && (
          <div>
            <h2 className={`text-xs font-bold uppercase tracking-wider border-b pb-0.5 ${headingMargin}`} style={{ borderColor: accentColor, color: accentColor }}>
              Professional Summary
            </h2>
            <p className="text-[12px] text-slate-700 leading-normal text-justify">
              {p.summary}
            </p>
          </div>
        )}

        {/* Experience */}
        {data.experiences.length > 0 && (
          <div>
            <h2 className={`text-xs font-bold uppercase tracking-wider border-b pb-0.5 ${headingMargin}`} style={{ borderColor: accentColor, color: accentColor }}>
              Work Experience
            </h2>
            <div className={itemGapClass}>
              {data.experiences.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-slate-900 text-[13px]">{exp.role}</h3>
                    <span className="text-[11px] font-semibold text-slate-600">
                      {exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline text-[11.5px] text-slate-700 italic">
                    <span>{exp.company}</span>
                    <span>{exp.location}</span>
                  </div>
                  <ul className="list-disc list-outside ml-4 mt-1 space-y-0.5 text-[12px] text-slate-700 leading-snug">
                    {exp.bullets.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <div>
            <h2 className={`text-xs font-bold uppercase tracking-wider border-b pb-0.5 ${headingMargin}`} style={{ borderColor: accentColor, color: accentColor }}>
              Education
            </h2>
            <div className={itemGapClass}>
              {data.education.map((edu) => (
                <div key={edu.id} className="flex justify-between items-baseline">
                  <div>
                    <h3 className="font-bold text-slate-900 text-[12.5px]">{edu.degree}</h3>
                    <div className="text-[11.5px] text-slate-700 italic">
                      {edu.school}, {edu.location}
                      {edu.scoreOrGpa && <span className="font-semibold not-italic"> — {edu.scoreOrGpa}</span>}
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-600">{edu.endDate}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Technical Skills */}
        {(data.skills.technical || data.skills.toolsAndFrameworks || data.skills.softSkills) && (
          <div>
            <h2 className={`text-xs font-bold uppercase tracking-wider border-b pb-0.5 ${headingMargin}`} style={{ borderColor: accentColor, color: accentColor }}>
              Technical Skills & Core Competencies
            </h2>
            <div className="space-y-0.5 text-[12px] text-slate-700">
              {data.skills.technical && (
                <div><strong className="text-slate-900">Languages & Core:</strong> {data.skills.technical}</div>
              )}
              {data.skills.toolsAndFrameworks && (
                <div><strong className="text-slate-900">Frameworks & Cloud:</strong> {data.skills.toolsAndFrameworks}</div>
              )}
              {data.skills.softSkills && (
                <div><strong className="text-slate-900">Professional Skills:</strong> {data.skills.softSkills}</div>
              )}
            </div>
          </div>
        )}

        {/* Projects */}
        {data.projects.length > 0 && (
          <div>
            <h2 className={`text-xs font-bold uppercase tracking-wider border-b pb-0.5 ${headingMargin}`} style={{ borderColor: accentColor, color: accentColor }}>
              Projects & Engineering Work
            </h2>
            <div className={itemGapClass}>
              {data.projects.map((pr) => (
                <div key={pr.id}>
                  <div className="flex justify-between items-baseline text-[12.5px]">
                    <span className="font-bold text-slate-900">{pr.name}</span>
                    {pr.technologies && <span className="text-[11px] font-mono text-slate-600">[{pr.technologies}]</span>}
                  </div>
                  <p className="text-[12px] text-slate-700 leading-snug mt-0.5">{pr.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {data.certifications.length > 0 && (
          <div>
            <h2 className={`text-xs font-bold uppercase tracking-wider border-b pb-0.5 ${headingMargin}`} style={{ borderColor: accentColor, color: accentColor }}>
              Certifications & Honors
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[12px] text-slate-700">
              {data.certifications.map((c) => (
                <div key={c.id}>
                  • <strong className="text-slate-900">{c.name}</strong> — {c.issuer} ({c.date})
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // --- TEMPLATE 2: MODERN TECH PRO ---
  if (templateId === 'modern') {
    return (
      <div className={`text-slate-900 text-[13px] leading-relaxed ${lineSpacingClass}`}>
        {/* Modern Accent Bar Header */}
        <div className="flex items-start justify-between border-l-4 pl-4 py-1" style={{ borderColor: accentColor }}>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{p.fullName}</h1>
            <p className="text-xs font-bold tracking-wide uppercase mt-0.5" style={{ color: accentColor }}>
              {p.jobTitle}
            </p>
          </div>
          <div className="text-right text-[11px] text-slate-600 space-y-0.5">
            <div>{p.email}</div>
            <div>{p.phone} • {p.location}</div>
            {p.linkedin && <div>{p.linkedin}</div>}
          </div>
        </div>

        {/* Summary */}
        {p.summary && (
          <div className="bg-slate-50 p-2.5 rounded border border-slate-200 text-[12px] text-slate-700">
            {p.summary}
          </div>
        )}

        {/* Experience */}
        {data.experiences.length > 0 && (
          <div>
            <h2 className={`text-xs font-black uppercase tracking-wider flex items-center gap-2 ${headingMargin}`} style={{ color: accentColor }}>
              <span>WORK EXPERIENCE</span>
              <span className="flex-1 h-px bg-slate-200" />
            </h2>
            <div className={itemGapClass}>
              {data.experiences.map((exp) => (
                <div key={exp.id} className="relative pl-3 border-l-2 border-slate-200">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-slate-900 text-[13px]">{exp.role}</h3>
                    <span className="text-[11px] font-mono text-slate-500 font-semibold">
                      {exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <div className="text-[11.5px] font-semibold text-slate-600">
                    {exp.company} • {exp.location}
                  </div>
                  <ul className="list-disc list-outside ml-4 mt-1 space-y-0.5 text-[12px] text-slate-700 leading-snug">
                    {exp.bullets.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Technical Skills */}
        {(data.skills.technical || data.skills.toolsAndFrameworks) && (
          <div>
            <h2 className={`text-xs font-black uppercase tracking-wider flex items-center gap-2 ${headingMargin}`} style={{ color: accentColor }}>
              <span>SKILLS & TECHNOLOGIES</span>
              <span className="flex-1 h-px bg-slate-200" />
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[12px]">
              <div className="p-2 bg-slate-50 rounded border border-slate-200">
                <strong className="block text-slate-900 text-[11px] uppercase tracking-wider mb-0.5">Core Languages</strong>
                <p className="text-slate-700">{data.skills.technical}</p>
              </div>
              <div className="p-2 bg-slate-50 rounded border border-slate-200">
                <strong className="block text-slate-900 text-[11px] uppercase tracking-wider mb-0.5">Tools & Cloud</strong>
                <p className="text-slate-700">{data.skills.toolsAndFrameworks}</p>
              </div>
            </div>
          </div>
        )}

        {/* Education & Projects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {data.education.length > 0 && (
            <div>
              <h2 className={`text-xs font-black uppercase tracking-wider ${headingMargin}`} style={{ color: accentColor }}>
                EDUCATION
              </h2>
              {data.education.map((edu) => (
                <div key={edu.id} className="text-[12px]">
                  <strong className="text-slate-900">{edu.degree}</strong>
                  <div className="text-slate-600">{edu.school}</div>
                  <div className="text-[11px] text-slate-500 font-mono">{edu.endDate} • {edu.scoreOrGpa}</div>
                </div>
              ))}
            </div>
          )}

          {data.certifications.length > 0 && (
            <div>
              <h2 className={`text-xs font-black uppercase tracking-wider ${headingMargin}`} style={{ color: accentColor }}>
                CERTIFICATIONS
              </h2>
              <div className="space-y-1 text-[12px]">
                {data.certifications.map((c) => (
                  <div key={c.id}>
                    • <strong className="text-slate-900">{c.name}</strong> ({c.issuer})
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- TEMPLATE 3: EXECUTIVE LEADERSHIP ---
  if (templateId === 'executive') {
    return (
      <div className={`text-slate-900 text-[13px] leading-relaxed ${lineSpacingClass}`}>
        <div className="border-b-4 pb-3" style={{ borderColor: accentColor }}>
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-black uppercase tracking-wider text-slate-900">{p.fullName}</h1>
              <p className="text-sm font-bold tracking-wide mt-1" style={{ color: accentColor }}>
                {p.jobTitle}
              </p>
            </div>
            <div className="text-right text-[11px] text-slate-600 font-medium">
              <div>{p.location} | {p.phone}</div>
              <div>{p.email}</div>
              {p.linkedin && <div>{p.linkedin}</div>}
            </div>
          </div>
        </div>

        {p.summary && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 mb-1">
              Executive Profile
            </h2>
            <p className="text-[12px] text-slate-700 leading-normal">{p.summary}</p>
          </div>
        )}

        {/* Experience */}
        {data.experiences.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b pb-1 mb-2">
              Career History & Milestones
            </h2>
            <div className={itemGapClass}>
              {data.experiences.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-slate-900 text-[13px]">{exp.role}</span>
                    <span className="text-[11px] font-bold" style={{ color: accentColor }}>
                      {exp.startDate} — {exp.isCurrent ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <div className="text-[12px] font-semibold text-slate-700 mb-1">
                    {exp.company} | {exp.location}
                  </div>
                  <ul className="list-disc list-outside ml-4 space-y-0.5 text-[12px] text-slate-700">
                    {exp.bullets.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education & Core Competencies */}
        <div className="grid grid-cols-2 gap-4 border-t pt-2">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 mb-1">Education</h2>
            {data.education.map((edu) => (
              <div key={edu.id} className="text-[12px]">
                <div className="font-bold text-slate-900">{edu.degree}</div>
                <div className="text-slate-600">{edu.school}, {edu.endDate}</div>
              </div>
            ))}
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 mb-1">Core Expertise</h2>
            <p className="text-[12px] text-slate-700 leading-snug">{data.skills.technical}</p>
          </div>
        </div>
      </div>
    );
  }

  // --- TEMPLATE 4: CLEAN MINIMALIST (Pure ATS Parser Optimized) ---
  if (templateId === 'minimal') {
    return (
      <div className={`text-slate-900 text-[12.5px] leading-relaxed ${lineSpacingClass}`}>
        <div className="mb-2">
          <h1 className="text-2xl font-bold text-slate-900">{p.fullName}</h1>
          <div className="text-xs font-semibold text-slate-700">{p.jobTitle}</div>
          <div className="text-[11px] text-slate-600 mt-1">
            {p.email} • {p.phone} • {p.location} • {p.linkedin}
          </div>
        </div>

        {p.summary && (
          <div>
            <div className="font-bold uppercase text-[11px] tracking-wider text-slate-900 border-b pb-0.5 mb-1">Summary</div>
            <p className="text-[12px] text-slate-700">{p.summary}</p>
          </div>
        )}

        {data.experiences.length > 0 && (
          <div>
            <div className="font-bold uppercase text-[11px] tracking-wider text-slate-900 border-b pb-0.5 mb-1.5">Experience</div>
            <div className={itemGapClass}>
              {data.experiences.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>{exp.role}, {exp.company}</span>
                    <span className="font-normal text-slate-600 text-[11px]">{exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}</span>
                  </div>
                  <ul className="list-disc list-outside ml-4 mt-0.5 space-y-0.5 text-slate-700 text-[11.5px]">
                    {exp.bullets.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.education.length > 0 && (
          <div>
            <div className="font-bold uppercase text-[11px] tracking-wider text-slate-900 border-b pb-0.5 mb-1">Education</div>
            {data.education.map((edu) => (
              <div key={edu.id} className="flex justify-between text-[12px]">
                <span><strong>{edu.degree}</strong>, {edu.school}</span>
                <span className="text-slate-600">{edu.endDate}</span>
              </div>
            ))}
          </div>
        )}

        <div>
          <div className="font-bold uppercase text-[11px] tracking-wider text-slate-900 border-b pb-0.5 mb-1">Skills</div>
          <div className="text-[11.5px] text-slate-700">
            <div><strong>Technical:</strong> {data.skills.technical}</div>
            {data.skills.toolsAndFrameworks && <div><strong>Tools:</strong> {data.skills.toolsAndFrameworks}</div>}
          </div>
        </div>
      </div>
    );
  }

  // --- TEMPLATE 5: COMPACT 1-PAGE FIT ---
  if (templateId === 'compact') {
    return (
      <div className="text-slate-900 text-[11.5px] leading-snug space-y-2">
        <div className="text-center border-b pb-1.5">
          <h1 className="text-xl font-bold uppercase tracking-tight text-slate-900">{p.fullName}</h1>
          <div className="text-xs font-semibold" style={{ color: accentColor }}>{p.jobTitle}</div>
          <div className="text-[10.5px] text-slate-600 mt-0.5">
            {p.email} | {p.phone} | {p.location} | {p.linkedin}
          </div>
        </div>

        {p.summary && (
          <p className="text-[11px] text-slate-700 text-justify">{p.summary}</p>
        )}

        {data.experiences.length > 0 && (
          <div>
            <h2 className="text-[11px] font-bold uppercase tracking-wider border-b pb-0.5 mb-1" style={{ color: accentColor }}>
              Experience
            </h2>
            <div className="space-y-1.5">
              {data.experiences.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between font-bold text-[11.5px]">
                    <span>{exp.role} — <span className="font-semibold text-slate-700">{exp.company}</span></span>
                    <span className="text-[10px] text-slate-600">{exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}</span>
                  </div>
                  <ul className="list-disc list-outside ml-3.5 mt-0.5 space-y-0.5 text-[11px] text-slate-700">
                    {exp.bullets.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.education.length > 0 && (
          <div>
            <h2 className="text-[11px] font-bold uppercase tracking-wider border-b pb-0.5 mb-1" style={{ color: accentColor }}>
              Education
            </h2>
            {data.education.map((edu) => (
              <div key={edu.id} className="flex justify-between text-[11px]">
                <span><strong>{edu.degree}</strong>, {edu.school}</span>
                <span className="text-slate-600 font-mono">{edu.endDate}</span>
              </div>
            ))}
          </div>
        )}

        <div>
          <h2 className="text-[11px] font-bold uppercase tracking-wider border-b pb-0.5 mb-1" style={{ color: accentColor }}>
            Skills
          </h2>
          <p className="text-[11px] text-slate-700"><strong>Skills:</strong> {data.skills.technical}</p>
        </div>
      </div>
    );
  }

  // --- TEMPLATE 6: TWO-COLUMN (ATS-SAFE LINEAR FLOW) ---
  return (
    <div className={`text-slate-900 text-[12.5px] leading-relaxed ${lineSpacingClass}`}>
      {/* Header */}
      <div className="bg-slate-900 text-white p-4 rounded-t -mx-4 -mt-4 mb-3" style={{ backgroundColor: accentColor }}>
        <h1 className="text-2xl font-black tracking-tight">{p.fullName}</h1>
        <p className="text-xs font-semibold text-white/90">{p.jobTitle}</p>
        <div className="flex flex-wrap gap-x-3 text-[11px] text-white/80 mt-1">
          <span>{p.email}</span>
          <span>• {p.phone}</span>
          <span>• {p.location}</span>
          {p.linkedin && <span>• {p.linkedin}</span>}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Left Column (2/3 width): Experience & Projects */}
        <div className="col-span-2 space-y-3">
          {p.summary && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b pb-0.5 mb-1">
                Profile
              </h2>
              <p className="text-[12px] text-slate-700">{p.summary}</p>
            </div>
          )}

          {data.experiences.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b pb-0.5 mb-1.5">
                Work Experience
              </h2>
              <div className="space-y-2">
                {data.experiences.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-baseline">
                      <span className="font-bold text-[12.5px] text-slate-900">{exp.role}</span>
                      <span className="text-[10.5px] text-slate-500 font-mono">{exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}</span>
                    </div>
                    <div className="text-[11px] text-slate-600 font-semibold">{exp.company}</div>
                    <ul className="list-disc list-outside ml-3.5 mt-0.5 space-y-0.5 text-[11.5px] text-slate-700">
                      {exp.bullets.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column (1/3 width): Skills, Education, Certifications */}
        <div className="col-span-1 space-y-3 bg-slate-50 p-3 rounded border border-slate-200 text-[11.5px]">
          <div>
            <h3 className="font-bold uppercase tracking-wider text-slate-900 text-[11px] border-b pb-0.5 mb-1">
              Skills
            </h3>
            <p className="text-slate-700">{data.skills.technical}</p>
          </div>

          {data.education.length > 0 && (
            <div>
              <h3 className="font-bold uppercase tracking-wider text-slate-900 text-[11px] border-b pb-0.5 mb-1">
                Education
              </h3>
              {data.education.map((edu) => (
                <div key={edu.id} className="mb-1">
                  <div className="font-bold text-slate-900">{edu.degree}</div>
                  <div className="text-slate-600">{edu.school}</div>
                  <div className="text-slate-500 font-mono text-[10px]">{edu.endDate}</div>
                </div>
              ))}
            </div>
          )}

          {data.certifications.length > 0 && (
            <div>
              <h3 className="font-bold uppercase tracking-wider text-slate-900 text-[11px] border-b pb-0.5 mb-1">
                Certifications
              </h3>
              {data.certifications.map((c) => (
                <div key={c.id} className="text-slate-700 mb-0.5">
                  • <strong>{c.name}</strong> ({c.date})
                </div>
              ))}
            </div>
          )}

          {data.languages && (
            <div>
              <h3 className="font-bold uppercase tracking-wider text-slate-900 text-[11px] border-b pb-0.5 mb-1">
                Languages
              </h3>
              <p className="text-slate-700">{data.languages}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
