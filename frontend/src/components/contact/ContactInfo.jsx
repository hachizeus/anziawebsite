import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, MessageCircle, } from '../utils/icons.jsx';
import ContactInfoItem from './InfoItem';

const contactInfo = [
	{
		icon: Phone,
		title: 'Phone',
		content: '+254 769 162 665',
		link: 'tel:+254769162665',
		imgSrc: '/images/32px-VK_icons_phone_36.png',
	},
	{
		icon: MessageCircle,
		title: 'WhatsApp',
		content: '+254 769 162 665',
		link: 'https://wa.me/254769162665',
		imgSrc: '/images/32px-WhatsApp.png',
	},
	{
		icon: Mail,
		title: 'Email',
		content: 'support@Anzia Electronics .co.ke',
		link: 'mailto:support@Anzia Electronics .co.ke',
		imgSrc: '/images/32px-Ic_email_48px.png',
	},
	{
		icon: MapPin,
		title: 'Address',
		content: 'Joska, Keore Hse, Along Kangundo Rd. P. O BOX 58096 - 00200, Nairobi, Kenya',
		link: 'https://maps.google.com/?q=Joska,Keore+Hse,Along+Kangundo+Rd,Nairobi,Kenya',
		imgSrc: '/images/32px-Pin_point_location_SVG_black.png',
	},
	{
		icon: Clock,
		title: 'Working Hours',
		content: 'Mon-Fri: 9 AM - 6 PM',
		imgSrc: '/images/32px-OOjs_UI_icon_reload_flipX_time.png',
	},

];

export default function ContactInfo() {
	return (
		<motion.div
			initial={{ x: 20, opacity: 0 }}
			whileInView={{ x: 0, opacity: 1 }}
			viewport={{ once: true }}
			className="bg-white p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-sm"
		>
			<h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-8">
				Our Office
			</h2>
			<div className="space-y-4 sm:space-y-6">
				{contactInfo.map((info, index) => (
					<ContactInfoItem key={index} {...info} />
				))}
			</div>
			
			{/* Social Media Links */}
			<div className="mt-8 pt-6 border-t border-gray-200">
				<h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
				<div className="flex flex-wrap gap-3">
					{/* Facebook */}
					<a 
						href="https://www.facebook.com/share/15qX1kK637/?mibextid=wwXIfr" 
						target="_blank" 
						rel="noopener noreferrer"
						className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
					>
						<img src="/images/64px-Facebook_f_logo_(2019).png" alt="Facebook" className="w-5 h-5" />
					</a>
					
					{/* X (Twitter) */}
					<a 
						href="https://x.com/Anzia Electronics ?s=11" 
						target="_blank" 
						rel="noopener noreferrer"
						className="p-2 bg-white text-black rounded-full hover:bg-gray-100 transition-colors"
					>
						<img src="/images/32px-X_logo_2023.png" alt="X" className="w-5 h-5" />
					</a>
					
					{/* Instagram */}
					<a 
						href="https://www.instagram.com/makini.realtors?utm_source=qr" 
						target="_blank" 
						rel="noopener noreferrer"
						className="p-2 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white rounded-full hover:from-purple-600 hover:via-pink-600 hover:to-red-600 transition-colors"
					>
						<img src="/images/32px-Instagram_logo_2022.png" alt="Instagram" className="w-5 h-5" />
					</a>
					
					{/* LinkedIn */}
					<a 
						href="https://www.linkedin.com/company/107895153/admin/dashboard/" 
						target="_blank" 
						rel="noopener noreferrer"
						className="p-2 bg-blue-700 text-white rounded-full hover:bg-blue-800 transition-colors"
					>
						<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
							<path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
						</svg>
					</a>
					
					{/* YouTube */}
					<a 
						href="https://www.youtube.com/@Anzia Electronics " 
						target="_blank" 
						rel="noopener noreferrer"
						className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
					>
						<img src="/images/32px-YouTube_full-color_icon_(2017).png" alt="YouTube" className="w-5 h-5" />
					</a>
					
					{/* Threads */}
					<a 
						href="https://www.threads.com/@makini.realtors?igshid=NTc4MTIwNjQ2YQ==" 
						target="_blank" 
						rel="noopener noreferrer"
						className="p-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
					>
						<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 192 192" aria-hidden="true">
							<path d="M141.537 88.9883C140.71 88.5919 139.87 88.2104 139.019 87.8451C137.537 60.5382 122.616 44.905 97.5619 44.745C97.4484 44.7443 97.3355 44.7443 97.222 44.7443C82.2364 44.7443 69.7731 51.1409 62.102 62.7807L75.881 72.2328C81.6116 63.5383 90.6052 61.6848 97.2286 61.6848C97.3051 61.6848 97.3819 61.6848 97.4576 61.6855C105.707 61.7381 111.932 64.1366 115.961 68.814C118.893 72.2193 120.854 76.925 121.825 82.8638C114.511 81.6207 106.601 81.2385 98.145 81.7233C74.3247 83.0954 59.0111 96.9879 60.0396 116.292C60.5615 126.084 65.4397 134.508 73.775 140.011C80.8224 144.663 89.899 146.938 99.3323 146.423C111.79 145.74 121.563 140.987 128.381 132.296C133.559 125.696 136.834 117.143 138.28 106.366C144.217 109.949 148.617 114.664 151.047 120.332C155.179 129.967 155.42 145.8 142.501 158.708C131.182 170.016 117.576 174.908 97.0135 175.059C74.2042 174.89 56.9538 167.575 45.7381 153.317C35.2355 139.966 29.8077 120.682 29.6052 96C29.8077 71.3178 35.2355 52.0336 45.7381 38.6827C56.9538 24.4249 74.2039 17.11 97.0132 16.9405C119.988 17.1113 137.539 24.4614 149.184 38.788C154.894 45.8136 159.199 54.6488 162.037 64.9503L178.184 60.6422C174.744 47.9622 169.331 37.0357 161.965 27.974C147.036 9.60668 125.202 0.195148 97.0695 0H96.9569C68.8816 0.19447 47.2921 9.6418 32.7883 28.0793C19.8819 44.4864 13.2244 67.3157 13.0007 95.9325L13 96L13.0007 96.0675C13.2244 124.684 19.8819 147.514 32.7883 163.921C47.2921 182.358 68.8816 191.806 96.9569 192H97.0695C122.03 191.827 139.624 185.292 154.118 170.811C173.081 151.866 172.51 128.119 166.26 113.541C161.776 103.087 153.227 94.5962 141.537 88.9883ZM98.4405 129.507C88.0005 130.095 77.1544 125.409 76.6196 115.372C76.2232 107.93 81.9158 99.626 99.0812 98.6368C101.047 98.5234 102.976 98.468 104.871 98.468C111.106 98.468 116.939 99.0737 122.242 100.233C120.264 124.935 108.662 128.946 98.4405 129.507Z"></path>
						</svg>
					</a>
					
					{/* Telegram */}
					<a 
						href="https://t.me/Anzia Electronics KE" 
						target="_blank" 
						rel="noopener noreferrer"
						className="p-2 bg-[#0088cc] text-white rounded-full hover:bg-[#0088cc]/90 transition-colors"
					>
						<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
							<path d="M9.417 15.181l-.397 5.584c.568 0 .814-.244 1.109-.537l2.663-2.545 5.518 4.041c1.012.564 1.725.267 1.998-.931l3.622-16.972.001-.001c.321-1.496-.541-2.081-1.527-1.714l-21.29 8.151c-1.453.564-1.431 1.374-.247 1.741l5.443 1.693 12.643-7.911c.595-.394 1.136-.176.691.218l-10.226 9.183z"/>
						</svg>
					</a>
					
					
				</div>
			</div>
		</motion.div>
	);
}


