"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Users, Github, Linkedin, Mail, Languages } from "lucide-react"

const translations = {
  en: {
    meetTeam: "Meet Our Team",
    meetSubtitle: "A passionate group of developers, engineers, and designers building the future of smart agriculture.",
    descBRK: "Specializes in React and Next.js. Designed and built the responsive web dashboard with real-time data visualization.",
    descNJ: "Expert in Node.js and Firebase. Built the secure API infrastructure and real-time data synchronization systems.",
    descGRS: "IoT specialist with expertise in ESP32 and sensor integration. Designed the hardware architecture and firmware.",
    descBD: "Software and Hardware Coordinator. Machine learning expert. Developed the predictive models for weather analysis and crop recommendations.",
    joinTitle: "Join Our Team",
    joinDesc: "We are always looking for talented individuals passionate about agriculture and technology.",
    roles: {
      "Frontend Developer": "Frontend Developer",
      "Backend Developer": "Backend Developer",
      "Hardware Engineer": "Hardware Engineer",
      "Team Leader": "Team Leader"
    }
  },
  kn: {
    meetTeam: "ನಮ್ಮ ತಂಡವನ್ನು ಭೇಟಿಯಾಗಿ",
    meetSubtitle: "ಸ್ಮಾರ್ಟ್ ಕೃಷಿಯ ಭವಿಷ್ಯವನ್ನು ರೂಪಿಸುತ್ತಿರುವ ಡೆವಲಪರ್‌ಗಳ, ಎಂಜಿನಿಯರ್‌ಗಳ ಮತ್ತು ವಿನ್ಯಾಸಕರ ಭಾವನಾತ್ಮಕ ತಂಡ.",
    descBRK: "React ಮತ್ತು Next.js ನಲ್ಲಿ ಪರಿಣತಿ ಹೊಂದಿದ್ದಾರೆ. ನೈಜ-ಸಮಯದ ಡೇಟಾ ವಿಶ್ಲೇಷಣಾ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ವಿನ್ಯಾಸಗೊಳಿಸಿದವರು.",
    descNJ: "Node.js ಮತ್ತು Firebase ತಜ್ಞರು. ಸುರಕ್ಷಿತ API ಮತ್ತು ಲೈವ್ ಡೇಟಾ ವ್ಯವಸ್ಥೆಗಳನ್ನು ನಿರ್ಮಿಸಿದ್ದಾರೆ.",
    descGRS: "IoT ತಜ್ಞ. ESP32 ಹಾಗೂ ಸೆನ್ಸಾರ್ ಅಳವಡಿಕೆಯಲ್ಲಿ ಪರಿಣತರು. ಹಾರ್ಡ್‌ವೇರ್ ವಿನ್ಯಾಸವನ್ನು ರೂಪಿಸಿದ್ದಾರೆ.",
    descBD: "ಸಾಫ್ಟ್‌ವೇರ್ ಮತ್ತು ಹಾರ್ಡ್‌ವೇರ್ ಸಂಯೋಜಕಿ. ಕೃತಕ ಬುದ್ಧಿಮತ್ತೆ (AI) ತಜ್ಞೆ. ಹವಾಮಾನ ಮಾದರಿಗಳನ್ನು ಅಭಿವೃದ್ಧಿಪಡಿಸಿದ್ದಾರೆ.",
    joinTitle: "ನಮ್ಮ ತಂಡಕ್ಕೆ ಸೇರಿ",
    joinDesc: "ಕೃಷಿ ಮತ್ತು ತಂತ್ರಜ್ಞಾನದಲ್ಲಿ ಆಸಕ್ತಿ ಇರುವ ಪ್ರತಿಭಾವಂತರನ್ನು ನಾವು ಯಾವಾಗಲೂ ಸ್ವಾಗತಿಸುತ್ತೇವೆ.",
    roles: {
      "Frontend Developer": "ಫ್ರಂಟ್-ಎಂಡ್ ಡೆವಲಪರ್",
      "Backend Developer": "ಬ್ಯಾಕ್-ಎಂಡ್ ಡೆವಲಪರ್",
      "Hardware Engineer": "ಹಾರ್ಡ್‌ವೇರ್ ಎಂಜಿನಿಯರ್",
      "Team Leader": "ತಂಡದ ನಾಯಕಿ"
    }
  }
}

interface TeamMember {
  name: string
  roleKey: string
  department: string
  descKey: string
  initials: string
  color: string
  linkedin?: string
  github?: string
  email?: string
  image?: string
}

const teamMembersData: TeamMember[] = [
  {
    name: "FATHIMATH SHIBA",
    roleKey: "Team Leader",
    department: "AI",
    descKey: "descBD",
    initials: "FS",
    color: "bg-accent/10 text-accent-foreground",
    linkedin: "https://www.linkedin.com/in/fathimath-shiba-49930633b?utm_source=share_via&utm_content=profile&utm_medium=member_ios",
    email: "mailto:shibafathima916@gmail.com",
    image: "/images/team/shiba.jpg"
  },
  {
    name: "FATHIMATH SIMANA B K",
    roleKey: "Frontend Developer",
    department: "Frontend",
    descKey: "descBRK",
    initials: "FSB",
    color: "bg-primary/10 text-primary",
    linkedin: "https://www.linkedin.com/in/fathimath-shimana-b-k-b29619342?utm_source=share_via&utm_content=profile&utm_medium=member_ios",
    email: "mailto:shimana633@gmail.com",
    image: "/images/team/simana.jpg"
  },
  {
    name: "FATHIMATH SUHA",
    roleKey: "Backend Developer",
    department: "Backend",
    descKey: "descNJ",
    initials: "FS",
    color: "bg-secondary/10 text-secondary",
    linkedin: "https://www.linkedin.com/in/fathimath-suha-45779338?utm_source=share_via&utm_content=profile&utm_medium=member_ios",
    email: "mailto:fathimasuh497@gmail.com",
    image: "/images/team/suha.jpg"
  },
  {
    name: "RAFIYA G",
    roleKey: "Hardware Engineer",
    department: "Hardware",
    descKey: "descGRS",
    initials: "RG",
    color: "bg-warning/10 text-warning-foreground",
    linkedin: "https://www.linkedin.com/in/rafiya-ibrahim-111675353?utm_source=share_via&utm_content=profile&utm_medium=member_ios",
    email: "mailto:rafeeyaibrahim22@gmail.com",
    image: "/images/team/rafiya.jpg"
  },
]

function getDepartmentColor(department: string) {
  switch (department) {
    case "Frontend": return "bg-primary/10 text-primary border-primary/20"
    case "Backend": return "bg-secondary/10 text-secondary border-secondary/20"
    case "Hardware": return "bg-warning/10 text-warning-foreground border-warning/20"
    case "AI": return "bg-accent/10 text-accent-foreground border-accent/20"
    default: return "bg-muted text-muted-foreground border-border"
  }
}

export default function TeamPage() {
  type LangKey = 'en' | 'kn';
  const [lang, setLang] = useState<LangKey>('en');
  const t = translations[lang];

  return (
    <div className="min-h-screen bg-background font-sans transition-colors duration-300">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/5 via-background to-background py-16 relative">
          <div className="absolute top-6 right-6 z-10 hidden sm:flex items-center gap-2 bg-white/60 backdrop-blur-md px-4 py-2 rounded-full shadow-sm border border-slate-200">
            <Languages className="w-5 h-5 text-slate-500" />
            <button 
               onClick={() => setLang('en')} 
               className={`text-sm font-semibold transition-all px-2 py-1 rounded-md ${lang === 'en' ? 'bg-primary text-white' : 'text-slate-500 hover:bg-slate-100'}`}
            >
               English
            </button>
            <button 
               onClick={() => setLang('kn')} 
               className={`text-sm font-semibold transition-all px-2 py-1 rounded-md ${lang === 'kn' ? 'bg-primary text-white' : 'text-slate-500 hover:bg-slate-100'}`}
            >
               ಕನ್ನಡ
            </button>
          </div>

          <div className="container mx-auto px-4 relative">
             <div className="flex sm:hidden justify-center mb-6 items-center gap-2 bg-white/60 backdrop-blur-md px-4 py-2 rounded-full shadow-sm border border-slate-200 w-fit mx-auto">
                <Languages className="w-5 h-5 text-slate-500" />
                <button 
                   onClick={() => setLang('en')} 
                   className={`text-sm font-semibold transition-all px-2 py-1 rounded-md ${lang === 'en' ? 'bg-primary text-white' : 'text-slate-500 hover:bg-slate-100'}`}
                >
                   EN
                </button>
                <button 
                   onClick={() => setLang('kn')} 
                   className={`text-sm font-semibold transition-all px-2 py-1 rounded-md ${lang === 'kn' ? 'bg-primary text-white' : 'text-slate-500 hover:bg-slate-100'}`}
                >
                   ಕನ್ನಡ
                </button>
             </div>

            <div className="mx-auto max-w-3xl text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h1 className="mb-4 text-4xl font-extrabold text-foreground sm:text-5xl text-balance tracking-tight">
                {t.meetTeam}
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed text-pretty max-w-2xl mx-auto">
                {t.meetSubtitle}
              </p>
            </div>
          </div>
        </section>

        {/* Team Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {teamMembersData.map((member) => (
                <Card key={member.name} className="border-border/50 bg-card shadow-lg hover:shadow-xl transition-all duration-300 group rounded-[2rem]">
                  <CardContent className="p-8">
                    <div className="flex flex-col items-center text-center">
                      {/* Avatar */}
                      <Avatar className="h-40 w-40 mb-6 ring-[6px] ring-primary/10 shadow-xl transition-transform duration-500 group-hover:scale-[1.05] group-hover:-translate-y-2">
                        {member.image ? (
                           <img src={member.image} alt={member.name} className="object-cover w-full h-full rounded-full" />
                        ) : (
                          <AvatarFallback className={`text-3xl font-bold ${member.color}`}>
                            {member.initials}
                          </AvatarFallback>
                        )}
                      </Avatar>

                      {/* Name & Role */}
                      <h3 className="text-xl font-bold text-slate-900 mb-1">{member.name}</h3>
                      <p className="text-[15px] font-medium text-primary/80 mb-3 tracking-wide">{t.roles[member.roleKey as keyof typeof t.roles]}</p>

                      {/* Department Badge */}
                      <Badge variant="outline" className={`mb-5 px-3 py-1 font-semibold ${getDepartmentColor(member.department)}`}>
                        {member.department}
                      </Badge>

                      {/* Description */}
                      <p className="text-sm text-muted-foreground leading-relaxed mb-6 font-light">
                        {t[member.descKey as keyof typeof t]}
                      </p>

                      {/* Social Links */}
                      <div className="flex items-center gap-4 mt-auto">
                        {member.github && (
                          <a href={member.github} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-600 hover:bg-slate-900 hover:text-white hover:scale-110 shadow-sm transition-all duration-300">
                            <Github className="h-5 w-5" />
                          </a>
                        )}
                        {member.linkedin && (
                          <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-blue-600 hover:bg-blue-600 hover:text-white hover:scale-110 shadow-sm transition-all duration-300">
                            <Linkedin className="h-5 w-5" />
                          </a>
                        )}
                        {member.email && (
                          <a href={member.email} className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-emerald-600 hover:bg-emerald-600 hover:text-white hover:scale-110 shadow-sm transition-all duration-300">
                            <Mail className="h-5 w-5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Join CTA */}
        <section className="py-20 bg-gradient-to-t from-primary/5 to-transparent">
          <div className="container mx-auto px-4">
            <Card className="max-w-3xl mx-auto border-none shadow-[0_20px_50px_rgba(0,0,0,0.05)] bg-white rounded-3xl overflow-hidden">
              <CardContent className="p-12 text-center relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] -z-0"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-secondary/5 rounded-tr-[80px] -z-0"></div>
                
                <h2 className="text-3xl font-extrabold text-slate-900 mb-4 relative z-10">{t.joinTitle}</h2>
                <p className="text-slate-500 mb-8 max-w-lg mx-auto text-lg font-light leading-relaxed relative z-10">
                  {t.joinDesc}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4 relative z-10">
                  <Badge variant="outline" className="px-4 py-2 text-sm bg-primary/5 border-primary/20 text-primary">Frontend</Badge>
                  <Badge variant="outline" className="px-4 py-2 text-sm bg-secondary/5 border-secondary/20 text-secondary">Backend</Badge>
                  <Badge variant="outline" className="px-4 py-2 text-sm bg-warning/5 border-warning/20 text-amber-600">IoT/Hardware</Badge>
                  <Badge variant="outline" className="px-4 py-2 text-sm bg-accent/5 border-accent/20 text-purple-600">AI/ML</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
