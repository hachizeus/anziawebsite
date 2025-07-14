import React from 'react';
import PropTypes from 'prop-types';
import { responsivePadding, responsiveText } from '../utils/responsiveUtils';

/**
 * A responsive table component that works well on all screen sizes
 */
const ResponsiveTable = ({ 
  columns, 
  data, 
  emptyMessage = 'No data available',
  isLoading = false,
  className = ''
}) => {
  if (isLoading) {
    return (
      <div className="w-full py-8 flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full py-6 text-center">
        <p className={`${responsiveText.body} text-gray-500`}>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto -mx-3 sm:-mx-4 md:-mx-6 ${className}`}>
      <div className="inline-block min-w-full py-2 align-middle px-3 sm:px-4 md:px-6">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column, index) => (
                <th 
                  key={index} 
                  scope="col" 
                  className={`${responsivePadding.table} text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${column.className || ''}`}
                  style={column.width ? { width: column.width } : {}}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                {columns.map((column, colIndex) => (
                  <td 
                    key={colIndex} 
                    className={`${responsivePadding.table} whitespace-nowrap text-xs sm:text-sm text-gray-900 ${column.cellClassName || ''}`}
                  >
                    {column.render ? column.render(row) : row[column.accessor]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

ResponsiveTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      header: PropTypes.node.isRequired,
      accessor: PropTypes.string,
      render: PropTypes.func,
      className: PropTypes.string,
      cellClassName: PropTypes.string,
      width: PropTypes.string
    })
  ).isRequired,
  data: PropTypes.array.isRequired,
  emptyMessage: PropTypes.string,
  isLoading: PropTypes.bool,
  className: PropTypes.string
};

export default ResponsiveTable;