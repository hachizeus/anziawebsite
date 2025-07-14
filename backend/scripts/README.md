# Database Fix Scripts

This directory contains scripts to fix database issues.

## Fix Map Location Script

The `fix-map-location.js` script fixes properties where iframe code was mistakenly saved in the title field instead of the mapLocation field.

### How to run:

```bash
# Navigate to the backend directory
cd backend

# Run the script
node scripts/fix-map-location.js
```

## Add Sample Map Script

The `add-sample-map.js` script adds a sample Google Maps iframe to a specific property.

### How to run:

```bash
# Navigate to the backend directory
cd backend

# Run the script with a property ID
node scripts/add-sample-map.js 684321ed94631a783f517cfc
```

Replace `684321ed94631a783f517cfc` with the ID of the property you want to update.

## Fix Missing Map Fields Script

The `fix-missing-map-fields.js` script adds a default Google Maps iframe to all properties that don't have a mapLocation field.

### How to run:

```bash
# Navigate to the backend directory
cd backend

# Run the script
node scripts/fix-missing-map-fields.js
```

This will add a default map to all properties that are missing the mapLocation field.

## Test Property Map Script

The `test-property-map.js` script checks the mapLocation field of a specific property.

### How to run:

```bash
# Navigate to the backend directory
cd backend

# Run the script with a property ID
node scripts/test-property-map.js 684321ed94631a783f517cfc
```

Replace `684321ed94631a783f517cfc` with the ID of the property you want to check.