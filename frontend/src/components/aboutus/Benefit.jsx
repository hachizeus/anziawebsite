import { motion } from 'framer-motion';
import { Home, Globe, Headphones, List } from '../utils/icons.jsx';

const benefits = [
	{
		icon: Home,
		title: 'Verified Properties',
		description: 'Every property is thoroughly verified for quality and security.',
		imgSrc: '/images/32px-Home_free_icon.png', // Updated path
	},
	{
		icon: Globe,
		title: 'User-Friendly Platform',
		description: 'Intuitive navigation and seamless property management.',
		imgSrc: '/images/32px-Globe_icon.png', // Updated path
	},
	{
		icon: Headphones,
		title: '24/7 Support',
		description: 'Round-the-clock assistance for all your queries.',
		imgSrc: '/images/32px-Headphones_(1292150)_-_The_Noun_Project.png', // Updated path
	},
	{
		icon: List,
		title: 'Comprehensive Listings',
		description: 'Wide range of properties to match every need and budget.',
		imgSrc: '/images/16px-Bimetrical_icon_clipboard_black.png', // Updated path
	},
];

export default function Benefits() {
	return (
		<section className="py-24 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<motion.div
					initial={{ y: 20, opacity: 0 }}
					whileInView={{ y: 0, opacity: 1 }}
					viewport={{ once: true }}
					className="text-center mb-16"
				>
					<h2 className="text-4xl font-bold mb-4 dark:text-white">Why Choose Anzia Electronics ?</h2>
					<div className="w-24 h-1 bg-primary-600 mx-auto mb-6"></div>
					<p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
						Experience the difference with our comprehensive property solutions
					</p>
				</motion.div>

				<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
					{benefits.map((benefit, index) => {
						const Icon = benefit.icon;
						return (
							<motion.div
								key={benefit.title}
								initial={{ y: 20, opacity: 0 }}
								whileInView={{ y: 0, opacity: 1 }}
								viewport={{ once: true }}
								transition={{ delay: index * 0.2 }}
								className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
								whileHover={{ y: -5 }}
							>
								<div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center mb-6 transform transition-transform duration-300 hover:rotate-6">
									{benefit.imgSrc ? (
										<img
											src={benefit.imgSrc}
											alt={benefit.title}
											className="w-8 h-8"
										/>
									) : (
										<Icon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
									)}
								</div>
								<h3 className="text-xl font-bold mb-4 dark:text-white">{benefit.title}</h3>
								<p className="text-gray-600 dark:text-gray-300 text-lg">{benefit.description}</p>
							</motion.div>
						);
					})}
				</div>
			</div>
		</section>
	);
}


