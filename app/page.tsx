'use client'

import { memo, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import {
  ArrowUpRight,
  Link2,
  AtSign,
  Mail,
  Phone,
  MapPin,
  Moon,
  Sun,
  Check,
  Sparkles,
  Code2,
  Layers3,
  Gauge,
  Send,
  LoaderCircle,
  CircleCheck,
  Clock3,
  Briefcase,
  Store,
} from 'lucide-react'
import { TypeText, type TypeSegment } from '@/components/type-text'
import { AtomOrbits } from '@/components/atom-orbits'
import { Globe } from '@/components/globe'
import { useInView } from '@/lib/use-in-view'

type Project = {
  title: string
  category?: string
  description: string
  image: string
  link: string
  linkLabel?: string
  repo?: string
  tags: string[]
  stack: string[]
  features?: string[]
}

const projects: Project[] = [
  {
    title: 'Secure Infra From Scratch',
    category: 'Infrastructure | DevSecOps | Live production',
    description: 'From the ISP line to a live, secured hospital app: pfSense HA, VMware vCenter, a hardened HAProxy + Nginx edge, Docker with HashiCorp Vault, and Let\'s Encrypt via DNS-01 behind double NAT, with security scanning at every stage.',
    image: '/projects/secure-infra.png',
    link: 'https://clinicloud.duckdns.org:9443',
    linkLabel: 'View live demo',
    repo: 'https://github.com/askmuhammadtayyab786-max/secure-infra-from-scratch',
    tags: ['pfSense HA', 'VMware', 'HAProxy', 'Docker', 'Vault'],
    stack: ['DevSecOps', 'Infrastructure'],
    features: ['69 threats modeled (STRIDE)', 'Snyk vulnerabilities 9 → 0', 'Trivy CVEs 85 → 0', 'Non-root containers, no capabilities', 'Admin MFA, demo accounts locked', 'Auto-renewing TLS without opening a port'],
  },
  {
    title: 'Traffic Flow AI Dashboard',
    description: 'AI-powered traffic management dashboard with analytics, monitoring, and intelligent insights.',
    image: '/projects/traffic.png',
    link: 'https://trafficflowaidashboard.vercel.app/',
    tags: ['Next.js', 'AI integrations', 'Analytics'],
    stack: ['React', 'Next.js', 'AI'],
  },
  {
    title: 'Smart Parking Management System',
    description: 'Modern parking management dashboard with monitoring, management workflows, and analytics.',
    image: '/projects/parking.png',
    link: 'https://v0-parking-system-dashboard.vercel.app/',
    tags: ['React.js', 'Node.js', 'Dashboard'],
    stack: ['React', 'Node.js', 'MERN'],
  },
  {
    title: 'Hospital Doctor Dashboard',
    description: 'Healthcare dashboard interface for doctors with patient records, medical workflows, and management features.',
    image: '/projects/hospital.png',
    link: 'https://v0-hospital-doctor-dashboard.vercel.app/records',
    tags: ['Next.js', 'REST APIs', 'Healthcare'],
    stack: ['React', 'Next.js'],
  },
  {
    title: 'BuildCore Construction Platform',
    description: 'Enterprise construction management platform with project tracking, analytics, reporting, and operational workflows.',
    image: '/projects/buildcore.png',
    link: 'https://buildcore-ebon.vercel.app/',
    tags: ['Full-stack', 'PostgreSQL', 'Reporting'],
    stack: ['Full-stack'],
  },
  {
    title: 'Custom Trading Dashboard',
    category: 'FinTech Dashboard | Trading Platform',
    description: 'A modern financial dashboard for market visualization, portfolio monitoring, analytics, and confident trading workflows.',
    image: '/projects/custom-trading.png',
    link: 'https://v0-custom-trading-dashboard-chi.vercel.app/',
    tags: ['Next.js', 'React.js', 'TypeScript', 'Tailwind CSS', 'Data visualization'],
    stack: ['React', 'Next.js', 'FinTech'],
    features: ['Trading analytics', 'Portfolio overview', 'Market insights', 'Interactive charts', 'Performance tracking'],
  },
  {
    title: 'Crypto Trading & Analytics Platform',
    category: 'Crypto Platform | Financial Analytics',
    description: 'A crypto analytics platform with financial reports, market insights, dashboards, and decision-ready data visualization.',
    image: '/projects/crypto-reports.png',
    link: 'https://v0-crypto-trading-website-mauve.vercel.app/reports',
    tags: ['Next.js', 'React.js', 'TypeScript', 'Tailwind CSS', 'Charts & analytics'],
    stack: ['React', 'Next.js', 'FinTech'],
    features: ['Crypto analytics', 'Financial reports', 'Market insights', 'Trading interface', 'Data visualization'],
  },
  {
    title: 'Restaurant Management & Ordering Platform',
    category: 'Food & Business Applications',
    description: 'A modern restaurant web application delivering an engaging menu experience and digital ordering solution for food businesses.',
    image: '/projects/restaurant.png',
    link: 'https://reestaturant.vercel.app/',
    tags: ['React.js', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Responsive UI'],
    stack: ['React', 'Next.js'],
    features: ['Restaurant landing page', 'Menu browsing', 'Food categories', 'Product showcase', 'Online ordering', 'Mobile responsive design'],
  },
]

// Filter buttons in display order; any without matching projects are hidden.
const projectFilters = ['All', 'DevSecOps', 'Infrastructure', 'React', 'Next.js', 'Node.js', 'MERN', 'AI', 'FinTech', 'Full-stack']
  .map((label) => ({ label, count: label === 'All' ? projects.length : projects.filter((project) => project.stack.includes(label)).length }))
  .filter((filter) => filter.count > 0)

const skills = ['AWS', 'Docker', 'Kubernetes', 'ArgoCD', 'Terraform', 'Ansible', 'Jenkins', 'GitHub Actions', 'Trivy', 'SonarQube', 'HashiCorp Vault', 'Prometheus', 'Grafana', 'Linux']

const OWNER_EMAIL = 'askmuhammadtayyab786@gmail.com'
const FIVERR_URL = 'https://www.fiverr.com/muhammadtayy724'
const UPWORK_URL = 'https://www.upwork.com/freelancers/~013155b5af1f177b63'

const heroHeading: TypeSegment[] = [{ text: 'Secure delivery, ' }, { text: 'automated end to end.', accent: true }]
const aboutLead: TypeSegment[] = [{ text: "I'm Tayyab, a DevOps and DevSecOps engineer who automates how software is built, shipped, and secured — so releases are fast, repeatable, and safe by default." }]
const projectsHeading: TypeSegment[] = [{ text: "Projects I've " }, { text: 'built', accent: true }]
const projectsIntro: TypeSegment[] = [{ text: "Applications I've built and shipped — the kind of products I now deploy, automate, and secure with modern DevOps practices." }]
const contactHeading: TypeSegment[] = [{ text: 'Have a project in mind?' }]
const contactIntro: TypeSegment[] = [{ text: "I'm available for freelance and full-time work — CI/CD, cloud infrastructure, and security automation." }]

const heroPhrases = ['DevOps engineer', 'DevSecOps engineer', 'Cloud automation engineer']
const aboutPhrases = ['CI/CD pipelines', 'secure infrastructure', 'automated deployments']
const aboutHeadingPhrases = ['reliable pipelines', 'secure releases', 'scalable infrastructure']

type ContactStatus = 'idle' | 'sending' | 'sent'

// Deletes and retypes each phrase in turn, starting from the fully typed first phrase.
function useTypingCycle(phrases: string[], speed: number) {
  const [text, setText] = useState(phrases[0])
  useEffect(() => {
    let phraseIndex = 0
    let characterIndex = phrases[0].length
    let deleting = true
    const timer = window.setInterval(() => {
      const phrase = phrases[phraseIndex]
      if (deleting) {
        characterIndex -= 1
        if (characterIndex === 0) deleting = false
      } else {
        characterIndex += 1
        if (characterIndex === phrase.length) {
          deleting = true
          phraseIndex = (phraseIndex + 1) % phrases.length
        }
      }
      setText(phrase.slice(0, characterIndex))
    }, speed)
    return () => window.clearInterval(timer)
  }, [phrases, speed])
  return text
}

const ProjectCard = memo(function ProjectCard({ project }: { project: Project }) {
  const [ref, inView] = useInView<HTMLElement>(0.2)
  const titleSegments = useMemo(() => [{ text: project.title }], [project.title])
  return (
    <article ref={ref} className={inView ? 'project-card in-view' : 'project-card'}>
      <a className="project-image" href={project.link} target="_blank" rel="noreferrer"><img src={project.image} alt={`${project.title} dashboard screenshot`} /><span className="image-electron" aria-hidden="true" /><span className="image-electron image-electron-two" aria-hidden="true" /></a>
      <div className="project-body"><div className="tag-row">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div><TypeText as="h3" segments={titleSegments} speed={28} delay={250} />{project.category && <p className="project-category">{project.category}</p>}<p>{project.description}</p>{project.features && <ul className="feature-list">{project.features.map((feature) => <li key={feature}>{feature}</li>)}</ul>}<a className="project-link" href={project.link} target="_blank" rel="noreferrer">{project.linkLabel ?? 'View live project'} <ArrowUpRight size={16} /></a>{project.repo && <a className="project-link" href={project.repo} target="_blank" rel="noreferrer">View code &amp; evidence <ArrowUpRight size={16} /></a>}</div>
    </article>
  )
})

export default function Page() {
  const [dark, setDark] = useState(true)
  const [contactStatus, setContactStatus] = useState<ContactStatus>('idle')
  const [projectFilter, setProjectFilter] = useState('All')
  const visibleProjects = projectFilter === 'All' ? projects : projects.filter((project) => project.stack.includes(projectFilter))
  const typedText = useTypingCycle(heroPhrases, 95)
  const aboutTypedText = useTypingCycle(aboutPhrases, 105)
  const aboutHeadingText = useTypingCycle(aboutHeadingPhrases, 95)

  async function handleContactSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (contactStatus === 'sending') return
    const formElement = event.currentTarget
    const form = new FormData(formElement)
    const data = {
      name: String(form.get('name') || '').trim(),
      email: String(form.get('email') || '').trim(),
      message: String(form.get('message') || '').trim(),
      company: String(form.get('company') || ''),
      page: window.location.href,
    }
    const openMailApp = () => {
      const subject = `Project inquiry from ${data.name}`
      const body = `Name: ${data.name}\nEmail: ${data.email}\n\n${data.message}`
      window.location.href = `mailto:${OWNER_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    }

    setContactStatus('sending')
    const pending = toast.loading('Sending your message…', { description: 'This only takes a moment.' })
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const result = await response.json().catch(() => ({}))
      if (!response.ok) {
        setContactStatus('idle')
        if (result.fallback) {
          toast.error(result.error || 'Your message could not be sent.', {
            id: pending,
            description: 'You can still reach me directly through your email app.',
            action: { label: 'Open email', onClick: openMailApp },
            duration: 10000,
          })
        } else {
          toast.error(result.error || 'Something went wrong. Please try again.', { id: pending, description: undefined })
        }
        return
      }
      formElement.reset()
      setContactStatus('sent')
      toast.success('Message sent successfully!', {
        id: pending,
        description: `Thanks, ${data.name.split(' ')[0]}! A confirmation is on its way to ${data.email}.`,
        duration: 6000,
      })
      window.setTimeout(() => setContactStatus('idle'), 5000)
    } catch {
      setContactStatus('idle')
      toast.error('Network error — message not sent.', {
        id: pending,
        description: 'Check your connection and try again, or email me directly.',
        action: { label: 'Open email', onClick: openMailApp },
        duration: 10000,
      })
    }
  }

  return (
    <div className={dark ? 'site dark' : 'site'}>
      <header className="nav-wrap">
        <nav className="nav container" aria-label="Main navigation">
          <a className="brand" href="#home">Portfolio</a>
          <div className="nav-links">
            <a className="active" href="#home">Home</a>
            <a href="#about">About</a>
            <a href="#projects">Projects</a>
            <a href="#contact">Contact</a>
            <button className="theme-btn" onClick={() => setDark(!dark)} aria-label="Toggle theme">
              {dark ? <Sun size={19} /> : <Moon size={19} />}
            </button>
          </div>
        </nav>
      </header>

      <main>
        <div className="ambient-atoms" aria-hidden="true"><span /><span /><span /><span /><span /><span /></div>
        <section id="home" className="hero container">
          <div className="globe-roam"><Globe className="hero-globe" /></div>
          <div className="hero-copy-block">
            <p className="eyebrow"><Sparkles size={15} /> Available for new opportunities</p>
            <TypeText as="h1" segments={heroHeading} speed={70} delay={450} />
            <p className="hero-copy">I&apos;m Tayyab, a <span className="typing-line"><span>{typedText}</span><i aria-hidden="true" /></span> automating the path from commit to production — CI/CD pipelines, containers and Kubernetes, infrastructure as code on the cloud, and security built into every stage: scanning, secrets management, and compliance checks.</p>
            <div className="hero-actions">
              <a className="button primary" href="#projects">Explore my work <ArrowUpRight size={18} /></a>
              <a className="button secondary" href="#contact">Start a conversation</a>
              <a className="button secondary" href={FIVERR_URL} target="_blank" rel="noreferrer"><Store size={17} /> Hire on Fiverr</a>
              <a className="button secondary" href={UPWORK_URL} target="_blank" rel="noreferrer"><Briefcase size={17} /> Hire on Upwork</a>
            </div>
            <div className="stats">
              <div><strong>20+</strong><span>Projects shipped</span></div>
              <div><strong>2+</strong><span>Years building</span></div>
              <div><strong>10+</strong><span>Tools in stack</span></div>
            </div>
          </div>
          <div className="hero-visual" aria-label="A preview of Tayyab&apos;s work">
            <div className="visual-glow" />
            <div className="visual-card visual-card-main"><img src="/laptop.svg" alt="Laptop running DevOps pipeline commands" /><span className="visual-name">Muhammad Tayyab</span><div className="visual-caption"><span><Code2 size={14} /> DevOps + DevSecOps</span><strong>Built to ship safely</strong></div></div>
            <div className="visual-card visual-card-top"><Layers3 size={17} /><span>Pipelines that ship</span></div>
            <div className="visual-card visual-card-bottom"><span className="status-dot" /> Open to work <ArrowUpRight size={14} /></div>
          </div>
        </section>

        <section id="about" className="section container about">
          <div className="section-heading"><p className="eyebrow">About me</p><h2>Turning ideas into <span className="typing-line"><span>{aboutHeadingText}</span><i aria-hidden="true" /></span></h2></div>
          <div className="about-grid">
            <div className="about-profile">
              <div className="profile-photo-wrap">
                <AtomOrbits className="profile-atoms" />
                <img className="profile-photo" src="/profile-portrait.png" alt="Tayyab Latif, DevOps and DevSecOps engineer" />
                <span className="profile-orbit profile-orbit-one" />
                <span className="profile-orbit profile-orbit-two" />
                <span className="profile-orbit profile-orbit-three" />
                <span className="orbit-node orbit-node-one" />
                <span className="orbit-node orbit-node-two" />
              </div>
              <div className="profile-copy">
                <strong>Tayyab Latif</strong>
                <span>DevOps · DevSecOps &amp; Cloud engineer</span>
              </div>
              <p>I automate delivery and bake security into every stage, so teams can ship often without worrying.</p>
              <div className="about-typing" aria-live="polite"><span>Automating </span><strong>{aboutTypedText}</strong><i aria-hidden="true" /></div>
              <div className="profile-status"><span className="status-dot" /> Available for selected projects</div>
            </div>
            <div className="about-details">
              <TypeText as="p" className="about-lead" segments={aboutLead} speed={22} delay={300} />
              <p className="about-body">I work across the delivery lifecycle: CI/CD pipelines with GitHub Actions and Jenkins, containerised workloads on Docker and Kubernetes, infrastructure as code with Terraform and Ansible, and monitoring with Prometheus and Grafana. On the security side I shift checks left — SAST and DAST scanning, dependency and container image scanning, and secrets management — as a developer who has also built and shipped full-stack products.</p>
              <div className="about-highlights" aria-label="What I bring">
                <div><Layers3 size={18} /><span><strong>Automation first</strong> Repeatable CI/CD from commit to production.</span></div>
                <div><Gauge size={18} /><span><strong>Reliable infrastructure</strong> Code-defined, observable, and scalable.</span></div>
                <div><Sparkles size={18} /><span><strong>Security built in</strong> Scanning, secrets, and compliance in every pipeline.</span></div>
              </div>
              <div className="skill-groups" aria-label="Technical skills"><div className="skill-list">{skills.map((skill) => <span key={skill}><Check size={15} />{skill}</span>)}</div></div>
            </div>
          </div>
        </section>

        <section id="projects" className="section container projects">
          <div className="section-heading"><p className="eyebrow">Selected work</p><TypeText as="h2" segments={projectsHeading} speed={60} /><TypeText as="p" segments={projectsIntro} speed={24} delay={900} /></div>
          <div className="project-filters" role="group" aria-label="Filter projects by technology">
            {projectFilters.map((filter) => (
              <button type="button" key={filter.label} className={projectFilter === filter.label ? 'active' : undefined} aria-pressed={projectFilter === filter.label} onClick={() => setProjectFilter(filter.label)}>
                {filter.label}<span>{filter.count}</span>
              </button>
            ))}
          </div>
          <div className="project-grid">
            {visibleProjects.map((project) => <ProjectCard project={project} key={project.title} />)}
          </div>
        </section>

        <section id="contact" className="section contact container">
          <div className="contact-layout">
            <div className="contact-intro">
              <p className="eyebrow">Let&apos;s connect</p>
              <TypeText as="h2" segments={contactHeading} speed={55} />
              <TypeText as="p" segments={contactIntro} speed={22} delay={1300} />
              <div className="contact-links"><a href="mailto:askmuhammadtayyab786@gmail.com"><Mail size={18} />askmuhammadtayyab786@gmail.com</a><a href="tel:+923154064911"><Phone size={18} />+92 315 4064911</a><span className="contact-location"><MapPin size={18} />Islamabad, Pakistan</span><a href="https://www.linkedin.com/in/muhammad-tayyab41" target="_blank" rel="noreferrer"><Link2 size={18} />LinkedIn</a><a href="https://github.com/askmuhammadtayyab786-max" target="_blank" rel="noreferrer"><AtSign size={18} />GitHub</a><a href={FIVERR_URL} target="_blank" rel="noreferrer"><Store size={18} />Fiverr</a><a href={UPWORK_URL} target="_blank" rel="noreferrer"><Briefcase size={18} />Upwork</a></div>
            </div>
            <form className="contact-form" onSubmit={handleContactSubmit} aria-busy={contactStatus === 'sending'}>
              <div className="form-row">
                <label htmlFor="name">Name</label>
                <input id="name" name="name" type="text" placeholder="Your name" autoComplete="name" minLength={2} maxLength={120} required disabled={contactStatus === 'sending'} />
              </div>
              <div className="form-row">
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" placeholder="you@example.com" autoComplete="email" maxLength={200} required disabled={contactStatus === 'sending'} />
              </div>
              <div className="form-row">
                <label htmlFor="message">Message</label>
                <textarea id="message" name="message" placeholder="Tell me a little about your infrastructure or pipeline needs..." rows={5} minLength={10} maxLength={5000} required disabled={contactStatus === 'sending'} />
              </div>
              <div className="form-honeypot" aria-hidden="true">
                <label htmlFor="company">Company</label>
                <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
              </div>
              <div className="form-actions">
                <button className={`button primary form-submit is-${contactStatus}`} type="submit" disabled={contactStatus === 'sending'}>
                  {contactStatus === 'sending' ? <><LoaderCircle size={18} className="spin" />Sending…</> : contactStatus === 'sent' ? <><CircleCheck size={18} />Message sent</> : <><Send size={17} className="send-icon" />Send message</>}
                </button>
                <span className="form-hint"><Clock3 size={14} /> Usually replies within 24–48 hours</span>
              </div>
              {contactStatus === 'sent' && <p className="form-note" role="status">Thanks! Your message is in my inbox — check your email for a confirmation.</p>}
            </form>
          </div>
        </section>
      </main>

      <footer><div className="container footer-inner"><div><strong>Portfolio</strong><p>DevOps and DevSecOps engineer automating and securing software delivery.</p></div><p>© 2026 Tayyab Latif. All rights reserved.</p></div></footer>
    </div>
  )
}
