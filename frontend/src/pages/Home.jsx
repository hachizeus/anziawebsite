import React from 'react'
import Hero from '../components/Hero'
import ProductsShow from '../components/productsshow'
import Features from '../components/Features'

const Home = () => {
  return (
    <div className="bg-gray-50">
      <Hero />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProductsShow />
        <Features />
      </div>
    </div>
  )
}

export default Home

