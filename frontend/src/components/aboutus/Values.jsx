import { motion } from 'framer-motion';
import { Shield, Clock, CheckCircle } from '../utils/icons.jsx';

const values = [
	{
		icon: Shield,
		title: 'Integrity',
		description:
			'We operate with honesty, transparency, and ethical principles at the core of every decision. Whether dealing with clients, tenants, partners, or team members, we remain accountable and trustworthy in all our actions.',
		imgSrc: '/images/32px-Icon_Shield_72x72^s_BLACK,_TotK.png',
	},
	{
		icon: CheckCircle,
		title: 'Excellence',
		description:
			'We are committed to delivering the highest quality in every service we offer. From managing properties to client engagement, we strive for continuous improvement, precision, and professionalism that exceeds expectations.',
		imgSrc: '/images/trophy.svg',
	},
	{
		icon: Clock,
		title: 'Reliability',
		description:
			'We honor our word and deliver consistent, dependable results. Our clients count on us to protect their interests, resolve issues promptly, and maintain open, responsive communication at all times.',
		imgSrc: '/images/clock-check-symbol.svg',
	},
];

export default function Values() {
	return (
		<section className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<motion.div
					initial={{ y: 20, opacity: 0 }}
					whileInView={{ y: 0, opacity: 1 }}
					viewport={{ once: true }}
					className="text-center mb-16"
				>
					<h2 className="text-4xl font-bold mb-4 dark:text-white">Our Core Values</h2>
					<div className="w-24 h-1 bg-primary-600 mx-auto mb-6"></div>
					<p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg">
						These core values guide everything we do at Makini Realtors
					</p>
				</motion.div>

				<div className="grid md:grid-cols-3 gap-8">
					{values.map((value, index) => {
						const Icon = value.icon;
						return (
							<motion.div
								key={value.title}
								initial={{ y: 20, opacity: 0 }}
								whileInView={{ y: 0, opacity: 1 }}
								viewport={{ once: true }}
								transition={{ delay: index * 0.2 }}
								className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
								whileHover={{ y: -5 }}
							>
								<div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center mb-6 transform transition-transform duration-300 hover:rotate-6">
									{value.imgSrc ? (
										<img
											src={value.imgSrc}
											alt={value.title}
											className="w-8 h-8"
										/>
									) : (
										<Icon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
									)}
								</div>
								<h3 className="text-2xl font-bold mb-4 dark:text-white">{value.title}</h3>
								<p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
									{value.description}
								</p>
							</motion.div>
						);
					})}
				</div>
			</div>
		</section>
	);
}


