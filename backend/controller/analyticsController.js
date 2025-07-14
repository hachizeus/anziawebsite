import mongoose from 'mongoose';
import Property from '../models/propertymodel.js';
import Transaction from '../models/transactionModel.js';
import Analytics from '../models/analyticsModel.js';

// Get dashboard overview stats
export const getDashboardStats = async (req, res) => {
  try {
    // Get total properties count
    const totalProperties = await Property.countDocuments();
    
    // Get properties by status
    const propertiesByStatus = await Property.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    // Get total earnings (all time)
    const totalEarnings = await Transaction.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    // Get monthly earnings for the current year
    const currentYear = new Date().getFullYear();
    const monthlyEarnings = await Transaction.aggregate([
      { 
        $match: { 
          status: 'completed',
          date: { 
            $gte: new Date(`${currentYear}-01-01`),
            $lte: new Date(`${currentYear}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: { $month: '$date' },
          earnings: { $sum: '$amount' }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    // Get popular locations
    const popularLocations = await Property.aggregate([
      {
        $group: {
          _id: '$location.city',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);
    
    // Get most viewed properties
    const mostViewedProperties = await Property.find()
      .sort({ views: -1 })
      .limit(5)
      .select('title location views price');
    
    // Get total views
    const totalViews = await Property.aggregate([
      { $group: { _id: null, totalViews: { $sum: '$views' } } }
    ]);
    
    // Get views by day for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const viewsByDay = await Property.aggregate([
      { $unwind: '$viewHistory' },
      { $match: { 'viewHistory.date': { $gte: thirtyDaysAgo } } },
      { $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$viewHistory.date' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        totalProperties,
        propertiesByStatus: propertiesByStatus.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        totalEarnings: totalEarnings[0]?.total || 0,
        monthlyEarnings: monthlyEarnings.map(item => ({
          month: item._id,
          earnings: item.earnings
        })),
        popularLocations,
        productViews: {
          total: totalViews[0]?.totalViews || 0,
          mostViewed: mostViewedProperties,
          viewsByDay: viewsByDay.map(item => ({
            date: item._id,
            views: item.count
          }))
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard stats',
      error: error.message
    });
  }
};

// Get financial analytics
export const getFinancialAnalytics = async (req, res) => {
  try {
    const { period = 'monthly', startDate, endDate } = req.query;
    
    const dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);
    
    // Get earnings per product
    const earningsPerproduct = await Transaction.aggregate([
      { 
        $match: { 
          status: 'completed',
          ...(Object.keys(dateFilter).length > 0 ? { date: dateFilter } : {})
        }
      },
      {
        $lookup: {
          from: 'properties',
          localField: 'productId',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $group: {
          _id: '$productId',
          productTitle: { $first: '$Property.title' },
          totalEarnings: { $sum: '$amount' },
          transactionCount: { $sum: 1 }
        }
      },
      { $sort: { totalEarnings: -1 } },
      { $limit: 10 }
    ]);
    
    // Get payment trends over time
    const paymentTrends = await Transaction.aggregate([
      {
        $match: {
          status: 'completed',
          ...(Object.keys(dateFilter).length > 0 ? { date: dateFilter } : {})
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' }
          },
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        earningsPerproduct,
        paymentTrends: paymentTrends.map(item => ({
          date: `${item._id.year}-${item._id.month.toString().padStart(2, '0')}`,
          totalAmount: item.totalAmount,
          count: item.count
        }))
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching financial analytics',
      error: error.message
    });
  }
};

// Get product analytics
export const getproductAnalytics = async (req, res) => {
  try {
    // Get product status distribution
    const statusDistribution = await Property.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    // Get product type distribution
    const typeDistribution = await Property.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    // Get location distribution
    const locationDistribution = await Property.aggregate([
      { $group: { _id: '$location.city', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    // Get most viewed properties
    const mostViewedProperties = await Property.find()
      .sort({ views: -1 })
      .limit(10)
      .select('title location views price type');
    
    // Get view trends by day for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const viewTrends = await Property.aggregate([
      { $unwind: '$viewHistory' },
      { $match: { 'viewHistory.date': { $gte: thirtyDaysAgo } } },
      { $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$viewHistory.date' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        statusDistribution,
        typeDistribution,
        locationDistribution,
        viewAnalytics: {
          mostViewedProperties,
          viewTrends: viewTrends.map(item => ({
            date: item._id,
            views: item.count
          }))
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching product analytics',
      error: error.message
    });
  }
};
