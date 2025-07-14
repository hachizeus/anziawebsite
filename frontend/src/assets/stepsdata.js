import { Search, Calendar, Home, Map, Shield, FileCheck, Phone, UserCheck, FileText, CreditCard, Building, Users, Lock } from '../utils/icons.jsx';

export const tenantSteps = [
	{
		icon: Search,
		title: 'Property Inquiry & Viewing Request',
		description: 'Browse available properties online or visit our office. Schedule a guided viewing via our website or direct office line with one of our agents at your convenience.',
		imgSrc: '/images/32px-VK_icons_search_outline_56.png',
	},
	{
		icon: Calendar,
		title: 'Property Viewing',
		description: 'Receive a private tour of the property by a Makini representative. We answer questions about terms, utilities, security, and surrounding amenities.',
		imgSrc: '/images/32px-Noun_project_-_Museum_Visit.png',
	},
	{
		icon: FileCheck,
		title: 'Application Submission',
		description: 'Complete a rental application form including personal details, employment status, references, and consent for background checks.',
		imgSrc: '/images/16px-Bimetrical_icon_clipboard_black.png',
	},
	{
		icon: UserCheck,
		title: 'Tenant Screening & Approval',
		description: 'We conduct thorough screening including employment verification, rental history, creditworthiness, reference checks, and review of six months\' M-Pesa and bank statements.',
		imgSrc: '/images/screening.png',
	},
	{
		icon: FileText,
		title: 'Lease Agreement Signing',
		description: 'Review and sign the tenancy agreement outlining rent terms, deposit requirements, obligations, and house rules.',
		imgSrc: '/images/32px-Handshake-solid.png',
	},
	{
		icon: CreditCard,
		title: 'Deposit & Rent Payment',
		description: 'Pay the security deposit (usually one month\'s rent) and the first month\'s rent before receiving the keys.',
		imgSrc: '/images/deposit.svg',
	},
	{
		icon: Lock,
		title: 'Move-In & Handover',
		description: 'Receive your keys, an inventory checklist, and a brief orientation of the property. Any existing maintenance issues are documented.',
		imgSrc: '/images/handover.png',
	},
	{
		icon: Phone,
		title: 'Ongoing Tenant Support',
		description: 'Access our tenant support line for any issues related to maintenance, billing, or tenancy guidance. Makini Realtors remains your reliable partner throughout your stay.',
		imgSrc: '/images/32px-Headphones_(1292150)_-_The_Noun_Project.png',
	},
];

export const landlordSteps = [
	{
		icon: Building,
		title: 'Initial Contact & Consultation',
		description: 'The property owner reaches out to Makini Realtors—or we contact them—via phone, email, or our online form. We schedule a personalized consultation to understand the property type, location, ownership structure, and management goals.',
		imgSrc: '/images/meeting.png',
	},
	{
		icon: Home,
		title: 'Property Assessment & On-Site Visit',
		description: 'Our team visits the property to evaluate its condition, market value, rental potential, and unique features. We also discuss expectations around tenant types, rent pricing, and maintenance plans.',
		imgSrc: '/images/property-inspection.png',
	},
	{
		icon: FileText,
		title: 'Proposal & Management Agreement',
		description: 'We prepare a tailored Property Management Proposal outlining services, responsibilities, reporting structure, and fees. Upon agreement, both parties sign the Property Management Contract.',
		imgSrc: '/images/32px-Handshake-solid.png',
	},
	{
		icon: FileCheck,
		title: 'Property Onboarding & Preparation',
		description: 'We collect and organize all required documentation (ownership proof, compliance certificates, insurance, keys, utility details). If necessary, we coordinate repairs, cleaning, photography, and staging.',
		imgSrc: '/images/property-setup.png',
	},
	{
		icon: Search,
		title: 'Marketing & Tenant Placement',
		description: 'We list the property on top platforms, use digital marketing, conduct viewings, screen applicants, and recommend qualified tenants. Once approved, lease agreements are signed, and the tenant is onboarded.',
		imgSrc: '/images/marketing-megaphone.png',
	},
	{
		icon: Shield,
		title: 'Ongoing Property Management',
		description: 'We handle rent collection, routine maintenance, tenant communication, legal compliance, inspections, and financial reporting. You receive regular updates and monthly reports through our secure portal.',
		imgSrc: '/images/building-cog.png',
	},
	{
		icon: CreditCard,
		title: 'Performance Reviews & Portfolio Growth',
		description: 'We review the performance of your property periodically and provide insights to help you make informed decisions, whether it\'s rental adjustments, upgrades, or expanding your investment portfolio.',
		imgSrc: '/images/growth-chart.png',
	}
];

export const steps = tenantSteps.slice(0, 3);


