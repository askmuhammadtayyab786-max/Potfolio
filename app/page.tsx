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
} from 'lucide-react'
import { TypeText, type TypeSegment } from '@/components/type-text'
import { AtomOrbits } from '@/components/atom-orbits'
import { Globe } from '@/components/globe'
import { useInView } from '@/lib/use-in-view'

type Project = {
  title: string
  category?: string
  description: string
  image?: string
  terminal?: string[]
  link?: string
  badge?: string
  tags: string[]
  stack: string[]
  features?: string[]
}

const projects: Project[] = [
  {
    title: 'BigBlueButton Multi-Node Cluster',
    category: 'Production Infrastructure | EdTech Live Classes',
    description: 'Scalelite load-balanced BigBlueButton cluster for live online classes: a master node routing meetings across worker nodes, behind pfSense, on VMware ESXi.',
    terminal: ['$ client -> edge router -> pfSense (NAT)', '$ haproxy :443  SNI routing', '  ├─ master   scalelite + nginx + postgres', '  ├─ worker-1 bbb 3.0  turn :3478', '  └─ worker-2 bbb 3.0  turn :3479', '✓ prometheus + grafana scraping 3 nodes'],
    badge: 'Production · TeleTaleem',
    tags: ['BigBlueButton', 'Scalelite', 'HAProxy', 'pfSense', 'Grafana'],
    stack: ['Infrastructure', 'Networking', 'Monitoring'],
    features: ['SNI-based TLS routing', 'Double-NAT port forwarding', 'TURN/WebRTC NAT fixes', 'Prometheus + Grafana', 'ufw hardening'],
  },
  {
    title: 'Moodle LMS Production Platform',
    category: 'Production Infrastructure | LMS Operations',
    description: 'Running production infrastructure for 9+ Moodle LMS instances, integrated with BigBlueButton live classes and a custom results-import pipeline.',
    terminal: ['$ systemctl status nginx php-fpm', '✓ 9+ moodle instances online', '$ php import_multiple_results.php', '  tangerine (couchdb) -> moodle grades', '✓ live classes via bigbluebutton'],
    badge: 'Production · TeleTaleem',
    tags: ['Moodle', 'Linux', 'PHP', 'CouchDB'],
    stack: ['Infrastructure'],
    features: ['9+ production instances', 'Tangerine → Moodle results import', 'BBB live class integration', 'Linux server operations'],
  },
  {
    title: 'Secure Infra From Scratch',
    category: 'DevSecOps | End-to-End Build',
    description: 'A hospital 3-tier app taken from bare network to hardened production: STRIDE threat model, SAST/SCA/secret scanning, Vault-managed secrets and a locked-down HAProxy + Nginx edge — with before/after evidence for every layer.',
    terminal: ['$ threat-dragon  STRIDE -> 69 threats -> jira', '$ snyk test        9 issues -> 0  (397 tests pass)', '$ gitleaks detect  2 leaks  -> 0  (CI gate on PRs)', '$ trivy image      47/6/6/26 -> 0/0/0/0', '$ curl /.env      403 · TRACE 405 · brute-force 429', '✓ vault down -> app refuses to start'],
    badge: 'Open source',
    link: 'https://github.com/askmuhammadtayyab786-max/secure-infra-from-scratch',
    tags: ['Threat modeling', 'Snyk', 'Gitleaks', 'Vault', 'Trivy', 'HAProxy'],
    stack: ['DevSecOps', 'Infrastructure'],
    features: ['69 threats → Jira backlog', 'Snyk: 9 → 0 vulns', 'Gitleaks CI gate', 'Vault fail-closed secrets', 'Edge rate limiting + fail2ban'],
  },
  {
    title: 'FileForge DevSecOps CI/CD Pipeline',
    category: 'CI/CD | Shift-Left Security',
    description: 'Jenkins pipeline for a React + Express + MongoDB file platform that runs secret scanning, SAST with a quality gate, SCA, image scanning, SBOMs, a Vault-backed deploy and a DAST scan on every build.',
    terminal: ['$ jenkins build #fileforge', '  gitleaks -> sonarqube + quality gate', '  snyk -> owasp dependency-check', '  docker build -> trivy -> syft sbom -> grype', '  deploy (vault) -> owasp zap baseline', '✓ reports archived per stage'],
    badge: 'Jenkins',
    link: 'https://github.com/askmuhammadtayyab786-max/fileforge-devsecops-pipeline',
    tags: ['Jenkins', 'SonarQube', 'Snyk', 'Trivy', 'Syft/Grype', 'OWASP ZAP'],
    stack: ['CI/CD', 'DevSecOps'],
    features: ['10+ security stages', 'Quality gate', 'SBOM generation', 'Vault secrets', 'DAST scan'],
  },
  {
    title: 'FileForge on Kubernetes — Secured',
    category: 'Kubernetes | Threat-Model Driven',
    description: 'FileForge deployed to Kubernetes after a STRIDE review, with 13 threats fixed in code and manifests: JWT auth, audit logs, upload quotas, policy enforcement, network isolation and encrypted storage.',
    terminal: ['$ kubectl apply -f k8s/', '  namespace  secrets  storageclass (encrypted)', '  mongo  backend  frontend  ingress (tls)', '$ kyverno: runAsNonRoot  no privilege escalation', '$ netpol: mongo <- backend only', '✓ 13 STRIDE threats fixed'],
    badge: 'Kubernetes',
    link: 'https://github.com/askmuhammadtayyab786-max/fileforge-devsecops-k8s',
    tags: ['Kubernetes', 'Kyverno', 'NetworkPolicy', 'Vault', 'cert-manager', 'SBOM'],
    stack: ['Kubernetes', 'DevSecOps'],
    features: ['Kyverno policies', 'NetworkPolicies', 'Encrypted PVCs', 'Ingress rate limiting', 'Vault service account'],
  },
  {
    title: 'Terraform Multi-Environment AWS',
    category: 'Infrastructure as Code | AWS',
    description: 'One Terraform codebase that provisions separate testing, dev and production environments on AWS using workspaces, with remote state locked in S3 and DynamoDB.',
    terminal: ['$ terraform workspace select production', '$ terraform plan', '  + aws_vpc  aws_subnet  aws_security_group', '  + aws_instance  aws_s3_bucket (versioned, private)', '  state: s3 (encrypted) + dynamodb lock', '✓ apply complete'],
    badge: 'AWS',
    link: 'https://github.com/askmuhammadtayyab786-max/terraform-workspace',
    tags: ['Terraform', 'AWS', 'EC2', 'S3', 'DynamoDB'],
    stack: ['Terraform', 'Cloud'],
    features: ['3 workspaces: testing/dev/prod', 'Per-env sizing', 'Remote state + locking', 'Versioned S3', 'Public access blocked'],
  },
  {
    title: 'Hardened Container Stack',
    category: 'Containers | Supply-Chain Security',
    description: 'Next.js frontend, Express API and PostgreSQL in Docker Compose, hardened to least privilege and scanned with Trivy until every image came back clean.',
    terminal: ['$ docker compose up -d', '✓ frontend  backend  postgres  vault  healthy', '$ docker inspect backend', '  user: node  cap_drop: ALL  read_only: true', '$ ./scan.sh   trivy repo + 4 images', '✓ 0 HIGH/CRITICAL  (1 risk-accepted w/ expiry)'],
    badge: 'Open source',
    link: 'https://github.com/askmuhammadtayyab786-max/secure-infra-from-scratch/tree/main/13-containers-docker',
    tags: ['Docker', 'Compose', 'Trivy', 'PostgreSQL', 'Least privilege'],
    stack: ['DevSecOps'],
    features: ['Non-root containers', 'cap_drop ALL + read-only FS', 'Loopback-only ports', 'Least-privilege DB role', 'Trivy HTML reports'],
  },
  {
    title: 'FileForge CI/CD with Jenkins',
    category: 'CI/CD | Containers',
    description: 'Jenkins pipeline that rebuilds and redeploys the full FileForge stack — React, Express, MongoDB and an Nginx reverse proxy — with Docker Compose and a post-deploy health check.',
    terminal: ['$ jenkins build #fileforge', '  checkout -> compose down -> prune images', '  compose build --no-cache -> compose up -d', '$ docker ps  frontend  backend  mongo  nginx', '✓ health check passed'],
    badge: 'Jenkins',
    link: 'https://github.com/askmuhammadtayyab786-max/filefordgewithjenkins',
    tags: ['Jenkins', 'Docker Compose', 'Nginx', 'MongoDB'],
    stack: ['CI/CD'],
    features: ['Automated rebuild', 'Zero manual steps', 'Health checks', 'Logs on failure'],
  },
  {
    title: 'FileForge on AWS EC2 with Docker',
    category: 'Cloud Deployment | AWS',
    description: 'Containerised file-processing platform deployed on AWS EC2 with Docker Compose behind an Nginx reverse proxy, with a one-command redeploy script.',
    terminal: ['$ ssh ubuntu@ec2', '$ ./scripts/postScript.sh', '  compose down -> build -> up -d', '  nginx :80 -> frontend :3000', '  nginx /api -> backend :5000 -> mongo', '✓ live on ec2'],
    badge: 'AWS',
    link: 'https://github.com/askmuhammadtayyab786-max/fileforge-docker-aws',
    tags: ['AWS EC2', 'Docker', 'Nginx', 'React', 'Node.js'],
    stack: ['Cloud'],
    features: ['EC2 deployment', 'Reverse proxy', 'Redeploy script', 'Multi-container stack'],
  },
  {
    title: 'LogStream — Real-Time Log Monitor',
    category: 'Monitoring | CI/CD',
    description: 'Real-time log monitoring app with live WebSocket updates, filtering and error alerts, containerised and deployed through a Jenkins pipeline.',
    terminal: ['$ jenkins build #logstream', '  docker build backend  docker build frontend', '  compose up -d  frontend  backend  mongo', '$ socket.io  new-log  ERROR  payment-svc', '✓ live dashboard updating'],
    badge: 'Jenkins',
    link: 'https://github.com/askmuhammadtayyab786-max/user-logs-monitor',
    tags: ['React', 'Node.js', 'Socket.IO', 'MongoDB', 'Jenkins'],
    stack: ['CI/CD'],
    features: ['Real-time WebSocket feed', 'Level/service filters', 'Error alerts', 'Jenkins deploy'],
  },
  {
    title: 'VMware vSphere HA Lab',
    category: 'Virtualization | Data Center',
    description: 'Multi-host vSphere environment managed from vCenter, with shared NFS storage, high availability, live migration and VM lifecycle automation.',
    terminal: ['$ vcenter > cluster > hosts', '  ├─ esxi-01  connected', '  ├─ esxi-02  connected', '  └─ esxi-03  connected', '✓ HA + DRS enabled', '✓ vMotion: vm-web -> esxi-02 (0 downtime)'],
    link: 'https://github.com/askmuhammadtayyab786-max/secure-infra-from-scratch',
    tags: ['VMware ESXi', 'vCenter', 'vMotion', 'HA', 'DRS'],
    stack: ['Infrastructure'],
    features: ['3 ESXi hosts in vCenter', 'NFS shared storage', 'Templates & clones', 'Snapshots', 'vSwitch networking'],
  },
  {
    title: 'pfSense HA & Network Segmentation',
    category: 'Networking | Security',
    description: 'Redundant pfSense firewalls on separate hosts with CARP failover, separating users from servers with VLANs and hosting core internal services.',
    terminal: ['$ pfSense-1 MASTER  <-carp->  pfSense-2 BACKUP', '  LAN      users', '  VLAN 20  servers', '$ jump-server  bind9-dns  smb  sftp', '✓ failover tested'],
    link: 'https://github.com/askmuhammadtayyab786-max/secure-infra-from-scratch',
    tags: ['pfSense', 'CARP HA', 'VLANs', 'BIND9', 'Firewall'],
    stack: ['Networking', 'Infrastructure'],
    features: ['CARP high availability', 'Users/servers segmentation', 'Jump server', 'Internal DNS (BIND9)', 'SMB & SFTP'],
  },
  {
    title: 'Traffic Flow AI Dashboard',
    description: 'AI-powered traffic management dashboard, containerised with Docker and deployed on Kubernetes with rolling updates and health probes.',
    image: '/projects/traffic.png',
    link: 'https://trafficflowaidashboard.vercel.app/',
    tags: ['Docker', 'Kubernetes', 'Next.js', 'AI integrations', 'Analytics'],
    stack: ['React', 'Next.js', 'AI', 'Docker', 'Kubernetes'],
    features: ['Dockerised', 'Deployed on Kubernetes', 'Live demo'],
  },
  {
    title: 'Smart Parking Management System',
    description: 'Parking management dashboard with a React frontend and Node.js API, shipped as Docker images and run as Kubernetes deployments behind an Nginx ingress.',
    image: '/projects/parking.png',
    link: 'https://v0-parking-system-dashboard.vercel.app/',
    tags: ['Docker', 'Kubernetes', 'React.js', 'Node.js', 'Dashboard'],
    stack: ['React', 'Node.js', 'MERN', 'Docker', 'Kubernetes'],
    features: ['Dockerised', 'Deployed on Kubernetes', 'Live demo'],
  },
  {
    title: 'Hospital Doctor Dashboard',
    description: 'Healthcare dashboard for doctors, packaged as a non-root Docker image and deployed to Kubernetes with config and secrets kept out of the image.',
    image: '/projects/hospital.png',
    link: 'https://v0-hospital-doctor-dashboard.vercel.app/records',
    tags: ['Docker', 'Kubernetes', 'Next.js', 'REST APIs', 'Healthcare'],
    stack: ['React', 'Next.js', 'Docker', 'Kubernetes'],
    features: ['Dockerised', 'Deployed on Kubernetes', 'Live demo'],
  },
  {
    title: 'BuildCore Construction Platform',
    description: 'Construction management platform with PostgreSQL, deployed as a multi-container stack with Docker Compose and on Kubernetes with persistent storage for the database.',
    image: '/projects/buildcore.png',
    link: 'https://buildcore-ebon.vercel.app/',
    tags: ['Docker', 'Kubernetes', 'Full-stack', 'PostgreSQL', 'Reporting'],
    stack: ['Full-stack', 'Docker', 'Kubernetes'],
    features: ['Dockerised', 'Deployed on Kubernetes', 'Live demo'],
  },
  {
    title: 'Custom Trading Dashboard',
    category: 'FinTech Dashboard | Trading Platform',
    description: 'Financial trading dashboard containerised with a multi-stage Docker build and deployed on Kubernetes, scaled with multiple replicas behind a Service.',
    image: '/projects/custom-trading.png',
    link: 'https://v0-custom-trading-dashboard-chi.vercel.app/',
    tags: ['Docker', 'Kubernetes', 'Next.js', 'React.js', 'TypeScript'],
    stack: ['React', 'Next.js', 'FinTech', 'Docker', 'Kubernetes'],
    features: ['Dockerised', 'Deployed on Kubernetes', 'Trading analytics', 'Portfolio overview', 'Market insights'],
  },
  {
    title: 'Crypto Trading & Analytics Platform',
    category: 'Crypto Platform | Financial Analytics',
    description: 'Crypto analytics platform built into a slim Docker image and deployed on Kubernetes with an Ingress, readiness checks and zero-downtime rollouts.',
    image: '/projects/crypto-reports.png',
    link: 'https://v0-crypto-trading-website-mauve.vercel.app/reports',
    tags: ['Docker', 'Kubernetes', 'Next.js', 'React.js', 'TypeScript'],
    stack: ['React', 'Next.js', 'FinTech', 'Docker', 'Kubernetes'],
    features: ['Dockerised', 'Deployed on Kubernetes', 'Crypto analytics', 'Financial reports', 'Market insights'],
  },
  {
    title: 'Restaurant Management & Ordering Platform',
    category: 'Food & Business Applications',
    description: 'Restaurant ordering web app, containerised with Docker and served through Nginx, deployed on a Linux server and on Kubernetes.',
    image: '/projects/restaurant.png',
    link: 'https://reestaturant.vercel.app/',
    tags: ['Docker', 'Kubernetes', 'React.js', 'Next.js', 'TypeScript'],
    stack: ['React', 'Next.js', 'Docker', 'Kubernetes'],
    features: ['Dockerised', 'Deployed on Kubernetes', 'Restaurant landing page', 'Menu browsing', 'Food categories'],
  },
]

// Filter buttons in display order; any without matching projects are hidden.
const projectFilters = ['All', 'DevSecOps', 'CI/CD', 'Kubernetes', 'Docker', 'Terraform', 'Cloud', 'Infrastructure', 'Networking', 'React', 'Next.js', 'Node.js', 'MERN', 'AI', 'FinTech', 'Full-stack']
  .map((label) => ({ label, count: label === 'All' ? projects.length : projects.filter((project) => project.stack.includes(label)).length }))
  .filter((filter) => filter.count > 0)

const skills = ['AWS', 'Docker', 'Kubernetes', 'ArgoCD', 'Terraform', 'Ansible', 'Jenkins', 'GitHub Actions', 'Trivy', 'SonarQube', 'HashiCorp Vault', 'Prometheus', 'Grafana', 'Linux']

const OWNER_EMAIL = 'askmuhammadtayyab786@gmail.com'

const heroHeading: TypeSegment[] = [{ text: 'Secure delivery, ' }, { text: 'automated end to end.', accent: true }]
const aboutLead: TypeSegment[] = [{ text: "I'm Tayyab, a DevOps and DevSecOps engineer who automates how software is built, shipped, and secured — so releases are fast, repeatable, and safe by default." }]
const projectsHeading: TypeSegment[] = [{ text: "Projects I've " }, { text: 'built', accent: true }]
const projectsIntro: TypeSegment[] = [{ text: "Production infrastructure I run, DevSecOps pipelines and labs I've built, and full-stack apps I've containerised and deployed with Docker and Kubernetes." }]
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
      {project.terminal ? (
        <div className="project-image project-terminal" aria-label={`${project.title} overview`}><div className="terminal-bar"><i /><i /><i />{project.badge && <span>{project.badge}</span>}</div><pre>{project.terminal.map((line) => <code key={line} className={line.startsWith('✓') ? 'ok' : line.startsWith('$') ? 'cmd' : undefined}>{line}</code>)}</pre><span className="image-electron" aria-hidden="true" /><span className="image-electron image-electron-two" aria-hidden="true" /></div>
      ) : (
        <a className="project-image" href={project.link} target="_blank" rel="noreferrer"><img src={project.image} alt={`${project.title} dashboard screenshot`} /><span className="image-electron" aria-hidden="true" /><span className="image-electron image-electron-two" aria-hidden="true" /></a>
      )}
      <div className="project-body"><div className="tag-row">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div><TypeText as="h3" segments={titleSegments} speed={28} delay={250} />{project.category && <p className="project-category">{project.category}</p>}<p>{project.description}</p>{project.features && <ul className="feature-list">{project.features.map((feature) => <li key={feature}>{feature}</li>)}</ul>}{project.link ? <a className="project-link" href={project.link} target="_blank" rel="noreferrer">{project.link.includes('github.com') ? 'View on GitHub' : 'View live project'} <ArrowUpRight size={16} /></a> : <span className="project-link project-private">Private production system</span>}</div>
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
              <div className="contact-links"><a href="mailto:askmuhammadtayyab786@gmail.com"><Mail size={18} />askmuhammadtayyab786@gmail.com</a><a href="tel:+923154064911"><Phone size={18} />+92 315 4064911</a><span className="contact-location"><MapPin size={18} />Islamabad, Pakistan</span><a href="https://www.linkedin.com/in/muhammad-tayyab41" target="_blank" rel="noreferrer"><Link2 size={18} />LinkedIn</a><a href="https://github.com/askmuhammadtayyab786-max" target="_blank" rel="noreferrer"><AtSign size={18} />GitHub</a></div>
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
