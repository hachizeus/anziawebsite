# Makini Realtors Admin Guide

This guide provides detailed instructions for administrators on how to manage the Makini Realtors website, with a focus on the property categorization system and document management.

## Table of Contents
- [Makini Realtors Admin Guide](#makini-realtors-admin-guide)
  - [Table of Contents](#table-of-contents)
  - [Property Management](#property-management)
    - [Property Categorization System](#property-categorization-system)
    - [Adding Properties](#adding-properties)
    - [Editing Properties](#editing-properties)
    - [Managing Property Listings](#managing-property-listings)
  - [Document Management](#document-management)
    - [Uploading Documents](#uploading-documents)
    - [Managing Documents](#managing-documents)
    - [Tenant Documents](#tenant-documents)
  - [Dashboard Analytics](#dashboard-analytics)
    - [Property Category Breakdown](#property-category-breakdown)
    - [Performance Metrics](#performance-metrics)
  - [Appointment Management](#appointment-management)
  - [User Management](#user-management)
  - [Troubleshooting](#troubleshooting)

## Property Management

### Property Categorization System

The property management system uses a two-level categorization:

1. **Main Categories**:
   - **Residential**: Properties primarily for living purposes
   - **Commercial**: Properties for business operations
   - **Specialty**: Properties with specialized uses
   - **Land & Agricultural**: Undeveloped land and farming properties

2. **Property Types** (subcategories):
   - **Residential Types**:
     - Single-family home
     - Multi-family home
     - Apartment
     - Condominium
     - Townhouse
     - Airbnb
   - **Commercial Types**:
     - Office building
     - Retail store
     - Shopping center
     - Mall
     - Warehouse
     - Industrial space
   - **Specialty Types**:
     - Hotel
     - Resort
     - Student housing
     - Senior housing
     - Assisted living
     - Co-working space
     - Event venue
   - **Land & Agricultural Types**:
     - Vacant lot
     - Raw land
     - Agricultural land
     - Farm
     - Ranch

### Adding Properties

1. Navigate to **Add Property** in the admin panel
2. Fill in the property details:
   - **Title**: Create a descriptive title
   - **Description**: Provide a detailed description
   - **Category**: Select one of the four main categories
   - **Type**: Select a specific type within the chosen category
   - **Price**: Enter the property price
   - **Location**: Enter the property address
   - **Get Coordinates**: Click to automatically fetch GPS coordinates
   - **Bedrooms/Bathrooms/Square Feet**: Enter property specifications
   - **Amenities**: Add relevant amenities
   - **Images**: Upload up to 4 high-quality images (recommended dimensions: 1200x800px)
   - **Availability**: Set as available, sold, rented, or pending

3. Click **Submit Property** to save

### Editing Properties

1. Navigate to **Property Listings**
2. Find the property you want to edit
3. Click the **Edit** button
4. Update any property details as needed
5. To change the category:
   - Select the new category
   - Then select an appropriate type within that category
6. Click **Update Property** to save changes

### Managing Property Listings

1. Navigate to **Property Listings**
2. Use filters to find specific properties:
   - Filter by category
   - Filter by type
   - Filter by availability
   - Filter by price range
3. Use the search bar to find properties by title or location
4. Actions available for each property:
   - **View**: See the property as it appears to users
   - **Edit**: Modify property details
   - **Delete**: Remove the property (requires confirmation)
   - **Toggle Availability**: Quickly change availability status

## Document Management

### Uploading Documents

1. Navigate to **Documents** > **Upload Document**
2. Upload a document file (supported formats: PDF, DOC, DOCX, JPG, PNG)
3. Enter document details:
   - **Title**: Name of the document
   - **Description**: Optional description
   - **Tenant Assignment**: Optionally assign to a specific tenant
4. Click **Upload Document**

### Managing Documents

1. Navigate to **Documents**
2. View all documents in the system
3. For each document:
   - See document title and description
   - See upload date
   - See associated tenant (if any)
   - **Download**: Get a copy of the document
   - **Delete**: Remove the document

### Tenant Documents

1. Navigate to **Tenants**
2. Select a tenant
3. Click on the **Documents** tab
4. View documents specific to this tenant
5. Upload new documents directly to this tenant's profile
6. Manage tenant-specific documents

## Dashboard Analytics

### Property Category Breakdown

The dashboard provides visual analytics of your property portfolio:

1. **Category Distribution Chart**: Shows the distribution of properties across the four main categories
2. **Category Details**: Displays subcategories within each main category
3. **Performance Metrics**: Shows views and inquiries by category

Use this data to:
- Identify which property categories are most popular
- Balance your property portfolio
- Focus marketing efforts on high-performing categories

### Performance Metrics

The dashboard displays key performance indicators:

1. **Total Properties**: Count of all properties in the system
2. **Active Listings**: Number of properties currently available
3. **Total Views**: Number of property page views
4. **Pending Appointments**: Number of appointment requests awaiting confirmation

## Appointment Management

1. Navigate to **Appointments**
2. View all scheduled property viewings
3. Filter appointments by:
   - Date range
   - Property
   - Status (pending, confirmed, completed, cancelled)
4. For each appointment:
   - View client details
   - See property information
   - Check scheduled date and time
   - **Confirm**: Approve the appointment request
   - **Reschedule**: Change the appointment time
   - **Cancel**: Cancel the appointment
   - **Add Notes**: Record additional information

## User Management

1. Navigate to **Users**
2. View all users in the system
3. Filter users by role (admin, agent, tenant, user)
4. For each user:
   - View contact information
   - See associated properties or tenancies
   - **Edit**: Modify user details
   - **Deactivate/Activate**: Control account access

## Troubleshooting

**Document Upload Issues**:
- Ensure the file is under 10MB
- Check that the file format is supported
- Verify that ImageKit integration is properly configured

**Property Image Issues**:
- Images should be less than 5MB each
- Recommended formats: JPG, PNG
- Recommended dimensions: 1200x800px or 16:9 aspect ratio

**Category/Type Selection Issues**:
- You must select a category first before selecting a type
- If changing categories, the type will reset and must be selected again

For additional support, contact the system administrator or development team.